package com.scenicairways.service;

import com.scenicairways.model.Booking;
import com.scenicairways.model.Flight;
import com.scenicairways.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private FlightService flightService;

    @Autowired
    private QRCodeService qrCodeService;

    @Autowired
    private EmailService emailService;

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public List<Booking> getBookingsByUserId(String userId) {
        return bookingRepository.findByUserId(userId);
    }

    public Optional<Booking> getBookingById(String id) {
        return bookingRepository.findById(id);
    }

    public Booking createBooking(Booking booking) {
        // Generate unique booking ID
        booking.setId(generateBookingId());
        
        // Set booking date
        booking.setBookingDate(LocalDateTime.now());
        booking.setUpdatedAt(LocalDateTime.now());
        
        // Update seat availability
        flightService.updateSeatAvailability(booking.getFlightId(), booking.getSeats(), false);
        
        // Generate QR code
        String qrCodeData = generateQRCodeData(booking);
        String qrCodePath = qrCodeService.generateQRCode(qrCodeData, booking.getId());
        booking.setQrCode(qrCodePath);
        
        // Save booking
        Booking savedBooking = bookingRepository.save(booking);
        
        // Send confirmation email
        emailService.sendBookingConfirmation(savedBooking);
        
        return savedBooking;
    }

    public Booking updateBookingStatus(String bookingId, Booking.BookingStatus status) {
        Optional<Booking> optionalBooking = bookingRepository.findById(bookingId);
        if (optionalBooking.isPresent()) {
            Booking booking = optionalBooking.get();
            booking.setStatus(status);
            booking.setUpdatedAt(LocalDateTime.now());
            
            Booking updatedBooking = bookingRepository.save(booking);
            
            // Send status update email
            emailService.sendBookingStatusUpdate(updatedBooking);
            
            return updatedBooking;
        }
        return null;
    }

    public boolean cancelBooking(String bookingId) {
        Optional<Booking> optionalBooking = bookingRepository.findById(bookingId);
        if (optionalBooking.isPresent()) {
            Booking booking = optionalBooking.get();
            booking.setStatus(Booking.BookingStatus.CANCELLED);
            booking.setUpdatedAt(LocalDateTime.now());
            
            // Release seats
            flightService.updateSeatAvailability(booking.getFlightId(), booking.getSeats(), true);
            
            bookingRepository.save(booking);
            
            // Send cancellation email
            emailService.sendBookingCancellation(booking);
            
            return true;
        }
        return false;
    }

    private String generateBookingId() {
        return "SA" + System.currentTimeMillis() + UUID.randomUUID().toString().substring(0, 4).toUpperCase();
    }

    private String generateQRCodeData(Booking booking) {
        return String.format("BOOKING:%s|FLIGHT:%s|SEATS:%s|PASSENGER:%s", 
            booking.getId(), 
            booking.getFlightId(), 
            String.join(",", booking.getSeats()),
            booking.getPassengerDetails().get(0).getName()
        );
    }
}