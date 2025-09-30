import { Flight, Booking } from '../types';

export const mockFlights: Flight[] = [
  {
    id: 'FL001',
    flightNumber: 'SA101',
    departure: 'Mumbai',
    arrival: 'Goa',
    departureTime: '06:00',
    arrivalTime: '07:30',
    date: '2025-01-15',
    aircraft: 'Boeing 737',
    scenicSide: 'left',
    scenicDescription: 'Experience breathtaking sunrise views over the Western Ghats and Arabian Sea coastline',
    price: 8500,
    totalSeats: 150,
    availableSeats: 120,
    sunPosition: 'sunrise',
    route: [
      { lat: 19.0760, lng: 72.8777, name: 'Mumbai', type: 'departure' },
      { lat: 18.5204, lng: 73.8567, name: 'Pune Mountains', type: 'waypoint' },
      { lat: 15.2993, lng: 74.1240, name: 'Goa', type: 'arrival' }
    ],
    seatLayout: [
      {
        row: 'A',
        seats: [
          { id: 'A1', seatNumber: 'A1', type: 'business', isScenic: true, isAvailable: true, price: 12000 },
          { id: 'A2', seatNumber: 'A2', type: 'business', isScenic: true, isAvailable: true, price: 12000 },
          { id: 'A3', seatNumber: 'A3', type: 'business', isScenic: false, isAvailable: false, price: 12000 },
          { id: 'A4', seatNumber: 'A4', type: 'business', isScenic: false, isAvailable: true, price: 12000 }
        ]
      },
      {
        row: 'B',
        seats: [
          { id: 'B1', seatNumber: 'B1', type: 'premium', isScenic: true, isAvailable: true, price: 10000 },
          { id: 'B2', seatNumber: 'B2', type: 'premium', isScenic: true, isAvailable: true, price: 10000 },
          { id: 'B3', seatNumber: 'B3', type: 'premium', isScenic: false, isAvailable: true, price: 10000 },
          { id: 'B4', seatNumber: 'B4', type: 'premium', isScenic: false, isAvailable: true, price: 10000 }
        ]
      },
      {
        row: 'C',
        seats: [
          { id: 'C1', seatNumber: 'C1', type: 'economy', isScenic: true, isAvailable: true, price: 8500 },
          { id: 'C2', seatNumber: 'C2', type: 'economy', isScenic: true, isAvailable: false, price: 8500 },
          { id: 'C3', seatNumber: 'C3', type: 'economy', isScenic: false, isAvailable: true, price: 8500 },
          { id: 'C4', seatNumber: 'C4', type: 'economy', isScenic: false, isAvailable: true, price: 8500 },
          { id: 'C5', seatNumber: 'C5', type: 'economy', isScenic: false, isAvailable: true, price: 8500 },
          { id: 'C6', seatNumber: 'C6', type: 'economy', isScenic: false, isAvailable: true, price: 8500 }
        ]
      }
    ]
  },
  {
    id: 'FL002',
    flightNumber: 'SA202',
    departure: 'Delhi',
    arrival: 'Leh',
    departureTime: '08:00',
    arrivalTime: '09:30',
    date: '2025-01-16',
    aircraft: 'Airbus A320',
    scenicSide: 'right',
    scenicDescription: 'Marvel at the majestic Himalayan peaks and pristine valleys from your window',
    price: 15000,
    totalSeats: 180,
    availableSeats: 145,
    sunPosition: 'daylight',
    route: [
      { lat: 28.7041, lng: 77.1025, name: 'Delhi', type: 'departure' },
      { lat: 32.2432, lng: 78.1273, name: 'Himachal Pradesh', type: 'waypoint' },
      { lat: 34.1526, lng: 77.5771, name: 'Leh', type: 'arrival' }
    ],
    seatLayout: [
      {
        row: 'A',
        seats: [
          { id: 'A1-2', seatNumber: 'A1', type: 'business', isScenic: false, isAvailable: true, price: 20000 },
          { id: 'A2-2', seatNumber: 'A2', type: 'business', isScenic: false, isAvailable: true, price: 20000 },
          { id: 'A3-2', seatNumber: 'A3', type: 'business', isScenic: true, isAvailable: true, price: 20000 },
          { id: 'A4-2', seatNumber: 'A4', type: 'business', isScenic: true, isAvailable: false, price: 20000 }
        ]
      },
      {
        row: 'B',
        seats: [
          { id: 'B1-2', seatNumber: 'B1', type: 'premium', isScenic: false, isAvailable: true, price: 17500 },
          { id: 'B2-2', seatNumber: 'B2', type: 'premium', isScenic: false, isAvailable: true, price: 17500 },
          { id: 'B3-2', seatNumber: 'B3', type: 'premium', isScenic: true, isAvailable: true, price: 17500 },
          { id: 'B4-2', seatNumber: 'B4', type: 'premium', isScenic: true, isAvailable: true, price: 17500 }
        ]
      }
    ]
  },
  {
    id: 'FL003',
    flightNumber: 'SA303',
    departure: 'Chennai',
    arrival: 'Port Blair',
    departureTime: '14:30',
    arrivalTime: '16:00',
    date: '2025-01-17',
    aircraft: 'ATR 72',
    scenicSide: 'both',
    scenicDescription: 'Spectacular aerial views of the Bay of Bengal and Andaman Islands archipelago',
    price: 12000,
    totalSeats: 70,
    availableSeats: 55,
    sunPosition: 'daylight',
    route: [
      { lat: 13.0827, lng: 80.2707, name: 'Chennai', type: 'departure' },
      { lat: 11.9416, lng: 79.8083, name: 'Bay of Bengal', type: 'waypoint' },
      { lat: 11.6234, lng: 92.7265, name: 'Port Blair', type: 'arrival' }
    ],
    seatLayout: [
      {
        row: 'A',
        seats: [
          { id: 'A1-3', seatNumber: 'A1', type: 'premium', isScenic: true, isAvailable: true, price: 15000 },
          { id: 'A2-3', seatNumber: 'A2', type: 'premium', isScenic: true, isAvailable: true, price: 15000 },
          { id: 'A3-3', seatNumber: 'A3', type: 'premium', isScenic: true, isAvailable: false, price: 15000 },
          { id: 'A4-3', seatNumber: 'A4', type: 'premium', isScenic: true, isAvailable: true, price: 15000 }
        ]
      },
      {
        row: 'B',
        seats: [
          { id: 'B1-3', seatNumber: 'B1', type: 'economy', isScenic: true, isAvailable: true, price: 12000 },
          { id: 'B2-3', seatNumber: 'B2', type: 'economy', isScenic: true, isAvailable: true, price: 12000 },
          { id: 'B3-3', seatNumber: 'B3', type: 'economy', isScenic: true, isAvailable: true, price: 12000 },
          { id: 'B4-3', seatNumber: 'B4', type: 'economy', isScenic: true, isAvailable: true, price: 12000 }
        ]
      }
    ]
  }
];

export const mockBookings: Booking[] = [
  {
    id: 'BK001',
    userId: 'user-1',
    flightId: 'FL001',
    seats: ['C1', 'C2'],
    totalPrice: 17000,
    status: 'confirmed',
    bookingDate: '2025-01-10',
    passengerDetails: [
      { name: 'John Doe', age: 30, gender: 'male', seatNumber: 'C1' },
      { name: 'Jane Doe', age: 28, gender: 'female', seatNumber: 'C2' }
    ]
  }
];