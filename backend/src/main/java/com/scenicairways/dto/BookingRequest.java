package com.scenicairways.dto;

import com.scenicairways.model.Booking;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;

import java.util.List;

public class BookingRequest {
    @NotBlank(message = "Flight ID is required")
    private String flightId;

    @NotEmpty(message = "At least one seat must be selected")
    private List<String> seats;

    @DecimalMin(value = "0.0", inclusive = false, message = "Total price must be greater than 0")
    private double totalPrice;

    @Valid
    @NotEmpty(message = "At least one passenger detail is required")
    private List<PassengerDetailRequest> passengerDetails;

    @Email(message = "Valid email is required")
    @NotBlank(message = "Contact email is required")
    private String contactEmail;

    @NotBlank(message = "Contact phone is required")
    private String contactPhone;

    public static class PassengerDetailRequest {
        @NotBlank(message = "Passenger name is required")
        private String name;

        @Min(value = 1, message = "Age must be at least 1")
        @Max(value = 120, message = "Age must be less than 120")
        private int age;

        @NotNull(message = "Gender is required")
        private Booking.PassengerDetail.Gender gender;

        @NotBlank(message = "Seat number is required")
        private String seatNumber;

        // Getters and Setters
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public int getAge() { return age; }
        public void setAge(int age) { this.age = age; }
        public Booking.PassengerDetail.Gender getGender() { return gender; }
        public void setGender(Booking.PassengerDetail.Gender gender) { this.gender = gender; }
        public String getSeatNumber() { return seatNumber; }
        public void setSeatNumber(String seatNumber) { this.seatNumber = seatNumber; }
    }

    // Getters and Setters
    public String getFlightId() { return flightId; }
    public void setFlightId(String flightId) { this.flightId = flightId; }
    public List<String> getSeats() { return seats; }
    public void setSeats(List<String> seats) { this.seats = seats; }
    public double getTotalPrice() { return totalPrice; }
    public void setTotalPrice(double totalPrice) { this.totalPrice = totalPrice; }
    public List<PassengerDetailRequest> getPassengerDetails() { return passengerDetails; }
    public void setPassengerDetails(List<PassengerDetailRequest> passengerDetails) { this.passengerDetails = passengerDetails; }
    public String getContactEmail() { return contactEmail; }
    public void setContactEmail(String contactEmail) { this.contactEmail = contactEmail; }
    public String getContactPhone() { return contactPhone; }
    public void setContactPhone(String contactPhone) { this.contactPhone = contactPhone; }
}