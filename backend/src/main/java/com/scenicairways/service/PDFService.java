package com.scenicairways.service;

import com.scenicairways.model.Booking;
import com.scenicairways.model.Flight;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.util.Optional;

@Service
public class PDFService {

    @Autowired
    private FlightService flightService;

    @Autowired
    private QRCodeService qrCodeService;

    public byte[] generateTicketPdf(Booking booking) {
        try {
            Optional<Flight> flightOpt = flightService.getFlightById(booking.getFlightId());
            if (!flightOpt.isPresent()) {
                throw new RuntimeException("Flight not found");
            }
            
            Flight flight = flightOpt.get();
            
            // For now, return a simple PDF-like content as bytes
            // In a real implementation, you would use iText or similar library
            String ticketContent = generateTicketContent(booking, flight);
            
            return ticketContent.getBytes();
        } catch (Exception e) {
            System.err.println("Error generating PDF: " + e.getMessage());
            return new byte[0];
        }
    }

    private String generateTicketContent(Booking booking, Flight flight) {
        StringBuilder content = new StringBuilder();
        
        content.append("SCENIC AIRWAYS - BOARDING PASS\n");
        content.append("================================\n\n");
        content.append("Booking ID: ").append(booking.getId()).append("\n");
        content.append("Flight: ").append(flight.getFlightNumber()).append("\n");
        content.append("Route: ").append(flight.getDeparture()).append(" → ").append(flight.getArrival()).append("\n");
        content.append("Date: ").append(flight.getDate()).append("\n");
        content.append("Departure: ").append(flight.getDepartureTime()).append("\n");
        content.append("Aircraft: ").append(flight.getAircraft()).append("\n");
        content.append("Seats: ").append(String.join(", ", booking.getSeats())).append("\n\n");
        
        content.append("PASSENGER DETAILS:\n");
        content.append("------------------\n");
        for (Booking.PassengerDetail passenger : booking.getPassengerDetails()) {
            content.append("Name: ").append(passenger.getName()).append("\n");
            content.append("Age: ").append(passenger.getAge()).append("\n");
            content.append("Gender: ").append(passenger.getGender()).append("\n");
            content.append("Seat: ").append(passenger.getSeatNumber()).append("\n\n");
        }
        
        content.append("Total Amount: ₹").append(String.format("%.2f", booking.getTotalPrice())).append("\n");
        content.append("Status: ").append(booking.getStatus()).append("\n\n");
        
        content.append("Contact: ").append(booking.getContactEmail()).append("\n");
        content.append("Phone: ").append(booking.getContactPhone()).append("\n\n");
        
        content.append("Please arrive at the airport at least 2 hours before departure.\n");
        content.append("For support: support@scenicairways.com\n");
        
        return content.toString();
    }
}