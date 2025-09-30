const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export const api = {
  // Auth endpoints
  login: (credentials: { username: string; password: string }) =>
    fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    }),

  register: (userData: { username: string; email: string; password: string }) =>
    fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    }),

  // Flight endpoints
  searchFlights: (params: { departure: string; arrival: string; date?: string }) => {
    const searchParams = new URLSearchParams();
    searchParams.append('departure', params.departure);
    searchParams.append('arrival', params.arrival);
    if (params.date) searchParams.append('date', params.date);
    
    return fetch(`${API_BASE_URL}/flights/search?${searchParams}`);
  },

  getAvailableFlights: () =>
    fetch(`${API_BASE_URL}/flights/available`),

  getFlightById: (id: string) =>
    fetch(`${API_BASE_URL}/flights/${id}`),

  getAllFlights: (token: string) =>
    fetch(`${API_BASE_URL}/flights`, {
      headers: { 'Authorization': `Bearer ${token}` },
    }),

  createFlight: (flightData: any, token: string) =>
    fetch(`${API_BASE_URL}/flights`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(flightData),
    }),

  updateFlight: (id: string, flightData: any, token: string) =>
    fetch(`${API_BASE_URL}/flights/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(flightData),
    }),

  deleteFlight: (id: string, token: string) =>
    fetch(`${API_BASE_URL}/flights/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    }),

  // Booking endpoints
  createBooking: (bookingData: any, token: string) =>
    fetch(`${API_BASE_URL}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(bookingData),
    }),

  getUserBookings: (token: string) =>
    fetch(`${API_BASE_URL}/bookings/user`, {
      headers: { 'Authorization': `Bearer ${token}` },
    }),

  getAllBookings: (token: string) =>
    fetch(`${API_BASE_URL}/bookings`, {
      headers: { 'Authorization': `Bearer ${token}` },
    }),

  updateBookingStatus: (id: string, status: string, token: string) =>
    fetch(`${API_BASE_URL}/bookings/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    }),

  downloadTicket: (bookingId: string, token: string) =>
    fetch(`${API_BASE_URL}/bookings/${bookingId}/ticket`, {
      headers: { 'Authorization': `Bearer ${token}` },
    }),
};