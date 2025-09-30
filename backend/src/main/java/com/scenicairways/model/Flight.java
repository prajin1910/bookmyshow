package com.scenicairways.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "flights")
public class Flight {
    @Id
    private String id;
    private String flightNumber;
    private String departure;
    private String arrival;
    private LocalTime departureTime;
    private LocalTime arrivalTime;
    private LocalDate date;
    private String aircraft;
    private ScenicSide scenicSide;
    private String scenicDescription;
    private String aiGeneratedDescription;
    private double price;
    private int totalSeats;
    private int availableSeats;
    private List<SeatRow> seatLayout;
    private List<RoutePoint> route;
    private SunPosition sunPosition;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public enum ScenicSide {
        LEFT, RIGHT, BOTH
    }

    public enum SunPosition {
        SUNRISE, SUNSET, DAYLIGHT
    }

    public static class SeatRow {
        private String row;
        private List<Seat> seats;

        // Getters and Setters
        public String getRow() { return row; }
        public void setRow(String row) { this.row = row; }
        public List<Seat> getSeats() { return seats; }
        public void setSeats(List<Seat> seats) { this.seats = seats; }
    }

    public static class Seat {
        private String id;
        private String seatNumber;
        private SeatType type;
        private boolean isScenic;
        private boolean isAvailable;
        private double price;

        public enum SeatType {
            ECONOMY, PREMIUM, BUSINESS
        }

        // Getters and Setters
        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
        public String getSeatNumber() { return seatNumber; }
        public void setSeatNumber(String seatNumber) { this.seatNumber = seatNumber; }
        public SeatType getType() { return type; }
        public void setType(SeatType type) { this.type = type; }
        public boolean isScenic() { return isScenic; }
        public void setScenic(boolean scenic) { isScenic = scenic; }
        public boolean isAvailable() { return isAvailable; }
        public void setAvailable(boolean available) { isAvailable = available; }
        public double getPrice() { return price; }
        public void setPrice(double price) { this.price = price; }
    }

    public static class RoutePoint {
        private double lat;
        private double lng;
        private String name;
        private RoutePointType type;

        public enum RoutePointType {
            DEPARTURE, ARRIVAL, WAYPOINT
        }

        // Getters and Setters
        public double getLat() { return lat; }
        public void setLat(double lat) { this.lat = lat; }
        public double getLng() { return lng; }
        public void setLng(double lng) { this.lng = lng; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public RoutePointType getType() { return type; }
        public void setType(RoutePointType type) { this.type = type; }
    }

    public Flight() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getFlightNumber() { return flightNumber; }
    public void setFlightNumber(String flightNumber) { this.flightNumber = flightNumber; }

    public String getDeparture() { return departure; }
    public void setDeparture(String departure) { this.departure = departure; }

    public String getArrival() { return arrival; }
    public void setArrival(String arrival) { this.arrival = arrival; }

    public LocalTime getDepartureTime() { return departureTime; }
    public void setDepartureTime(LocalTime departureTime) { this.departureTime = departureTime; }

    public LocalTime getArrivalTime() { return arrivalTime; }
    public void setArrivalTime(LocalTime arrivalTime) { this.arrivalTime = arrivalTime; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public String getAircraft() { return aircraft; }
    public void setAircraft(String aircraft) { this.aircraft = aircraft; }

    public ScenicSide getScenicSide() { return scenicSide; }
    public void setScenicSide(ScenicSide scenicSide) { this.scenicSide = scenicSide; }

    public String getScenicDescription() { return scenicDescription; }
    public void setScenicDescription(String scenicDescription) { this.scenicDescription = scenicDescription; }

    public String getAiGeneratedDescription() { return aiGeneratedDescription; }
    public void setAiGeneratedDescription(String aiGeneratedDescription) { this.aiGeneratedDescription = aiGeneratedDescription; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }

    public int getTotalSeats() { return totalSeats; }
    public void setTotalSeats(int totalSeats) { this.totalSeats = totalSeats; }

    public int getAvailableSeats() { return availableSeats; }
    public void setAvailableSeats(int availableSeats) { this.availableSeats = availableSeats; }

    public List<SeatRow> getSeatLayout() { return seatLayout; }
    public void setSeatLayout(List<SeatRow> seatLayout) { this.seatLayout = seatLayout; }

    public List<RoutePoint> getRoute() { return route; }
    public void setRoute(List<RoutePoint> route) { this.route = route; }

    public SunPosition getSunPosition() { return sunPosition; }
    public void setSunPosition(SunPosition sunPosition) { this.sunPosition = sunPosition; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}