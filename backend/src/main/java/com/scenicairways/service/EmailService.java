package com.scenicairways.service;

import com.scenicairways.model.Booking;
import com.scenicairways.model.Flight;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.util.Optional;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private FlightService flightService;

    @Autowired
    private QRCodeService qrCodeService;

    @Async
    public void sendBookingConfirmation(Booking booking) {
        try {
            Optional<Flight> flightOpt = flightService.getFlightById(booking.getFlightId());
            if (flightOpt.isPresent()) {
                Flight flight = flightOpt.get();
                
                MimeMessage message = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(message, true);

                helper.setTo(booking.getContactEmail());
                helper.setSubject("Booking Confirmation - Scenic Airways Flight " + flight.getFlightNumber());
                
                String htmlContent = generateBookingConfirmationEmail(booking, flight);
                helper.setText(htmlContent, true);

                // Attach QR code
                byte[] qrCodeBytes = qrCodeService.generateQRCodeBytes(
                    String.format("BOOKING:%s|FLIGHT:%s", booking.getId(), flight.getFlightNumber())
                );
                if (qrCodeBytes != null) {
                    helper.addAttachment("boarding-pass-qr.png", () -> qrCodeBytes);
                }

                mailSender.send(message);
                System.out.println("Booking confirmation email sent to: " + booking.getContactEmail());
            }
        } catch (MessagingException e) {
            System.err.println("Failed to send booking confirmation email: " + e.getMessage());
        }
    }

    @Async
    public void sendBookingStatusUpdate(Booking booking) {
        try {
            Optional<Flight> flightOpt = flightService.getFlightById(booking.getFlightId());
            if (flightOpt.isPresent()) {
                Flight flight = flightOpt.get();
                
                MimeMessage message = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(message, false);

                helper.setTo(booking.getContactEmail());
                helper.setSubject("Booking Status Update - " + flight.getFlightNumber());
                
                String htmlContent = generateStatusUpdateEmail(booking, flight);
                helper.setText(htmlContent, true);

                mailSender.send(message);
                System.out.println("Status update email sent to: " + booking.getContactEmail());
            }
        } catch (MessagingException e) {
            System.err.println("Failed to send status update email: " + e.getMessage());
        }
    }

    @Async
    public void sendBookingCancellation(Booking booking) {
        try {
            Optional<Flight> flightOpt = flightService.getFlightById(booking.getFlightId());
            if (flightOpt.isPresent()) {
                Flight flight = flightOpt.get();
                
                MimeMessage message = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(message, false);

                helper.setTo(booking.getContactEmail());
                helper.setSubject("Booking Cancellation - " + flight.getFlightNumber());
                
                String htmlContent = generateCancellationEmail(booking, flight);
                helper.setText(htmlContent, true);

                mailSender.send(message);
                System.out.println("Cancellation email sent to: " + booking.getContactEmail());
            }
        } catch (MessagingException e) {
            System.err.println("Failed to send cancellation email: " + e.getMessage());
        }
    }

    private String generateBookingConfirmationEmail(Booking booking, Flight flight) {
        return String.format("""
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .header { background: linear-gradient(135deg, #667eea 0%%, #764ba2 100%%); color: white; padding: 20px; text-align: center; }
                    .content { padding: 20px; }
                    .flight-details { background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0; }
                    .passenger-list { background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 20px 0; }
                    .footer { background: #333; color: white; padding: 20px; text-align: center; }
                    .highlight { color: #667eea; font-weight: bold; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>✈️ Scenic Airways</h1>
                    <h2>Booking Confirmation</h2>
                </div>
                
                <div class="content">
                    <p>Dear %s,</p>
                    
                    <p>Thank you for choosing Scenic Airways! Your booking has been confirmed.</p>
                    
                    <div class="flight-details">
                        <h3>Flight Details</h3>
                        <p><strong>Booking ID:</strong> <span class="highlight">%s</span></p>
                        <p><strong>Flight:</strong> %s</p>
                        <p><strong>Route:</strong> %s → %s</p>
                        <p><strong>Date:</strong> %s</p>
                        <p><strong>Departure:</strong> %s</p>
                        <p><strong>Arrival:</strong> %s</p>
                        <p><strong>Aircraft:</strong> %s</p>
                        <p><strong>Seats:</strong> %s</p>
                        <p><strong>Total Amount:</strong> ₹%,.2f</p>
                    </div>
                    
                    <div class="passenger-list">
                        <h3>Passenger Details</h3>
                        %s
                    </div>
                    
                    <p><strong>Scenic Highlights:</strong></p>
                    <p>%s</p>
                    
                    <p>Please arrive at the airport at least 2 hours before departure. Your QR code boarding pass is attached to this email.</p>
                    
                    <p>We look forward to providing you with an unforgettable scenic flight experience!</p>
                </div>
                
                <div class="footer">
                    <p>Scenic Airways - Where Every Seat Has a View</p>
                    <p>For support, contact us at support@scenicairways.com</p>
                </div>
            </body>
            </html>
            """,
            booking.getPassengerDetails().get(0).getName(),
            booking.getId(),
            flight.getFlightNumber(),
            flight.getDeparture(),
            flight.getArrival(),
            flight.getDate(),
            flight.getDepartureTime(),
            flight.getArrivalTime(),
            flight.getAircraft(),
            String.join(", ", booking.getSeats()),
            booking.getTotalPrice(),
            generatePassengerListHtml(booking),
            flight.getAiGeneratedDescription() != null ? flight.getAiGeneratedDescription() : flight.getScenicDescription()
        );
    }

    private String generateStatusUpdateEmail(Booking booking, Flight flight) {
        return String.format("""
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .header { background: linear-gradient(135deg, #667eea 0%%, #764ba2 100%%); color: white; padding: 20px; text-align: center; }
                    .content { padding: 20px; }
                    .status { background: #e8f5e8; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center; }
                    .footer { background: #333; color: white; padding: 20px; text-align: center; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>✈️ Scenic Airways</h1>
                    <h2>Booking Status Update</h2>
                </div>
                
                <div class="content">
                    <p>Dear %s,</p>
                    
                    <div class="status">
                        <h3>Your booking status has been updated to: <strong>%s</strong></h3>
                        <p>Booking ID: %s</p>
                        <p>Flight: %s (%s → %s)</p>
                    </div>
                    
                    <p>If you have any questions, please contact our customer service team.</p>
                </div>
                
                <div class="footer">
                    <p>Scenic Airways - Where Every Seat Has a View</p>
                </div>
            </body>
            </html>
            """,
            booking.getPassengerDetails().get(0).getName(),
            booking.getStatus(),
            booking.getId(),
            flight.getFlightNumber(),
            flight.getDeparture(),
            flight.getArrival()
        );
    }

    private String generateCancellationEmail(Booking booking, Flight flight) {
        return String.format("""
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .header { background: #dc3545; color: white; padding: 20px; text-align: center; }
                    .content { padding: 20px; }
                    .cancellation { background: #f8d7da; padding: 15px; border-radius: 8px; margin: 20px 0; }
                    .footer { background: #333; color: white; padding: 20px; text-align: center; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>✈️ Scenic Airways</h1>
                    <h2>Booking Cancellation</h2>
                </div>
                
                <div class="content">
                    <p>Dear %s,</p>
                    
                    <div class="cancellation">
                        <h3>Your booking has been cancelled</h3>
                        <p>Booking ID: %s</p>
                        <p>Flight: %s (%s → %s)</p>
                        <p>Refund will be processed within 5-7 business days.</p>
                    </div>
                    
                    <p>We're sorry to see you go. We hope to serve you again in the future!</p>
                </div>
                
                <div class="footer">
                    <p>Scenic Airways - Where Every Seat Has a View</p>
                </div>
            </body>
            </html>
            """,
            booking.getPassengerDetails().get(0).getName(),
            booking.getId(),
            flight.getFlightNumber(),
            flight.getDeparture(),
            flight.getArrival()
        );
    }

    private String generatePassengerListHtml(Booking booking) {
        StringBuilder html = new StringBuilder();
        for (Booking.PassengerDetail passenger : booking.getPassengerDetails()) {
            html.append(String.format(
                "<p><strong>%s</strong> - Age: %d, Gender: %s, Seat: %s</p>",
                passenger.getName(),
                passenger.getAge(),
                passenger.getGender(),
                passenger.getSeatNumber()
            ));
        }
        return html.toString();
    }
}