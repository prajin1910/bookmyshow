package com.scenicairways.repository;

import com.scenicairways.model.Booking;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends MongoRepository<Booking, String> {
    List<Booking> findByUserId(String userId);
    List<Booking> findByFlightId(String flightId);
    List<Booking> findByStatus(Booking.BookingStatus status);
}