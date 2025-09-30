package com.scenicairways.repository;

import com.scenicairways.model.Flight;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface FlightRepository extends MongoRepository<Flight, String> {
    List<Flight> findByDepartureAndArrivalAndDate(String departure, String arrival, LocalDate date);
    List<Flight> findByDepartureContainingIgnoreCaseAndArrivalContainingIgnoreCase(String departure, String arrival);
    List<Flight> findByDateGreaterThanEqual(LocalDate date);
    
    @Query("{ 'date' : { $gte: ?0 }, 'availableSeats' : { $gt: 0 } }")
    List<Flight> findAvailableFlights(LocalDate fromDate);
}