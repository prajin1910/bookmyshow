export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: string;
}

export interface Flight {
  id: string;
  flightNumber: string;
  departure: string;
  arrival: string;
  departureTime: string;
  arrivalTime: string;
  date: string;
  aircraft: string;
  scenicSide: 'left' | 'right' | 'both';
  scenicDescription: string;
  price: number;
  totalSeats: number;
  availableSeats: number;
  seatLayout: SeatRow[];
  route: RoutePoint[];
  sunPosition?: 'sunrise' | 'sunset' | 'daylight';
}

export interface SeatRow {
  row: string;
  seats: Seat[];
}

export interface Seat {
  id: string;
  seatNumber: string;
  type: 'economy' | 'premium' | 'business';
  isScenic: boolean;
  isAvailable: boolean;
  price: number;
}

export interface Booking {
  id: string;
  userId: string;
  flightId: string;
  seats: string[];
  totalPrice: number;
  status: 'confirmed' | 'cancelled' | 'pending';
  bookingDate: string;
  passengerDetails: PassengerDetail[];
}

export interface PassengerDetail {
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  seatNumber: string;
}

export interface RoutePoint {
  lat: number;
  lng: number;
  name: string;
  type: 'departure' | 'arrival' | 'waypoint';
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
}

export interface SearchFilters {
  departure: string;
  arrival: string;
  date: string;
  passengers: number;
}