package com.scenicairways.controller;

import com.scenicairways.dto.BookingRequest;
import com.scenicairways.dto.BookingStatusRequest;
import com.scenicairways.model.Booking;
import com.scenicairways.model.User;
import com.scenicairways.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/bookings")
@CrossOrigin(origins = "*")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @PostMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Booking> createBooking(@Valid @RequestBody BookingRequest bookingRequest, 
                                               Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        Booking booking = bookingService.createBooking(bookingRequest, user.getId());
        return ResponseEntity.ok(booking);
    }

    @GetMapping("/user")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<Booking>> getUserBookings(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        List<Booking> bookings = bookingService.getBookingsByUserId(user.getId());
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Booking> getBookingById(@PathVariable String id, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        Optional<Booking> booking = bookingService.getBookingById(id);
        
        if (booking.isPresent()) {
            // Users can only see their own bookings, admins can see all
            if (user.getRole() == User.Role.ADMIN || booking.get().getUserId().equals(user.getId())) {
                return ResponseEntity.ok(booking.get());
            } else {
                return ResponseEntity.forbidden().build();
            }
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Booking>> getAllBookings() {
        List<Booking> bookings = bookingService.getAllBookings();
        return ResponseEntity.ok(bookings);
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Booking> updateBookingStatus(@PathVariable String id, 
                                                     @Valid @RequestBody BookingStatusRequest statusRequest) {
        Booking updatedBooking = bookingService.updateBookingStatus(id, statusRequest.getStatus());
        return updatedBooking != null ? ResponseEntity.ok(updatedBooking) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('USER') and @bookingService.isBookingOwner(#id, authentication.principal.id))")
    public ResponseEntity<Void> cancelBooking(@PathVariable String id) {
        boolean cancelled = bookingService.cancelBooking(id);
        return cancelled ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
    }

    @GetMapping("/{id}/ticket")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<byte[]> downloadTicket(@PathVariable String id, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        Optional<Booking> booking = bookingService.getBookingById(id);
        
        if (booking.isPresent()) {
            // Users can only download their own tickets, admins can download all
            if (user.getRole() == User.Role.ADMIN || booking.get().getUserId().equals(user.getId())) {
                byte[] ticketPdf = bookingService.generateTicketPdf(booking.get());
                return ResponseEntity.ok()
                    .header("Content-Type", "application/pdf")
                    .header("Content-Disposition", "attachment; filename=ticket-" + id + ".pdf")
                    .body(ticketPdf);
            } else {
                return ResponseEntity.forbidden().build();
            }
        }
        return ResponseEntity.notFound().build();
    }
}