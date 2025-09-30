package com.scenicairways.dto;

import com.scenicairways.model.Booking;
import jakarta.validation.constraints.NotNull;

public class BookingStatusRequest {
    @NotNull(message = "Status is required")
    private Booking.BookingStatus status;

    public Booking.BookingStatus getStatus() { return status; }
    public void setStatus(Booking.BookingStatus status) { this.status = status; }
}