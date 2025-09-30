package com.scenicairways.service;

import com.scenicairways.model.Flight;
import com.scenicairways.repository.FlightRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class FlightService {

    @Autowired
    private FlightRepository flightRepository;

    @Autowired
    private AIService aiService;

    public List<Flight> getAllFlights() {
        return flightRepository.findAll();
    }

    public List<Flight> getAvailableFlights() {
        return flightRepository.findAvailableFlights(LocalDate.now());
    }

    public Optional<Flight> getFlightById(String id) {
        return flightRepository.findById(id);
    }

    public List<Flight> searchFlights(String departure, String arrival, LocalDate date) {
        if (date != null) {
            return flightRepository.findByDepartureAndArrivalAndDate(departure, arrival, date);
        } else {
            return flightRepository.findByDepartureContainingIgnoreCaseAndArrivalContainingIgnoreCase(departure, arrival);
        }
    }

    public Flight createFlight(Flight flight) {
        flight.setUpdatedAt(LocalDateTime.now());
        
        // Generate AI description for scenic views
        String aiDescription = aiService.generateScenicDescription(flight);
        flight.setAiGeneratedDescription(aiDescription);
        
        return flightRepository.save(flight);
    }

    public Flight updateFlight(String id, Flight flightDetails) {
        Optional<Flight> optionalFlight = flightRepository.findById(id);
        if (optionalFlight.isPresent()) {
            Flight flight = optionalFlight.get();
            flight.setFlightNumber(flightDetails.getFlightNumber());
            flight.setDeparture(flightDetails.getDeparture());
            flight.setArrival(flightDetails.getArrival());
            flight.setDepartureTime(flightDetails.getDepartureTime());
            flight.setArrivalTime(flightDetails.getArrivalTime());
            flight.setDate(flightDetails.getDate());
            flight.setAircraft(flightDetails.getAircraft());
            flight.setScenicSide(flightDetails.getScenicSide());
            flight.setScenicDescription(flightDetails.getScenicDescription());
            flight.setPrice(flightDetails.getPrice());
            flight.setTotalSeats(flightDetails.getTotalSeats());
            flight.setAvailableSeats(flightDetails.getAvailableSeats());
            flight.setSeatLayout(flightDetails.getSeatLayout());
            flight.setRoute(flightDetails.getRoute());
            flight.setSunPosition(flightDetails.getSunPosition());
            flight.setUpdatedAt(LocalDateTime.now());

            // Regenerate AI description if scenic details changed
            String aiDescription = aiService.generateScenicDescription(flight);
            flight.setAiGeneratedDescription(aiDescription);

            return flightRepository.save(flight);
        }
        return null;
    }

    public boolean deleteFlight(String id) {
        if (flightRepository.existsById(id)) {
            flightRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public boolean updateSeatAvailability(String flightId, List<String> seatNumbers, boolean available) {
        Optional<Flight> optionalFlight = flightRepository.findById(flightId);
        if (optionalFlight.isPresent()) {
            Flight flight = optionalFlight.get();
            
            for (Flight.SeatRow row : flight.getSeatLayout()) {
                for (Flight.Seat seat : row.getSeats()) {
                    if (seatNumbers.contains(seat.getSeatNumber())) {
                        seat.setAvailable(available);
                    }
                }
            }
            
            // Update available seats count
            long availableCount = flight.getSeatLayout().stream()
                .flatMap(row -> row.getSeats().stream())
                .mapToLong(seat -> seat.isAvailable() ? 1 : 0)
                .sum();
            
            flight.setAvailableSeats((int) availableCount);
            flight.setUpdatedAt(LocalDateTime.now());
            
            flightRepository.save(flight);
            return true;
        }
        return false;
    }
}