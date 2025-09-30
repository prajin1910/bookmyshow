import React, { useState } from 'react';
import { Search, Ticket, Clock, MapPin } from 'lucide-react';
import { Flight, Booking } from '../../types';
import { FlightSearch } from './FlightSearch';
import { FlightCard } from './FlightCard';
import { SeatMap } from './SeatMap';
import { BookingModal } from './BookingModal';
import { InteractiveMap } from '../map/InteractiveMap';
import { QRTicketDownload } from '../booking/QRTicketDownload';
import { AIGeneratedDescription } from '../flight/AIGeneratedDescription';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../config/api';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Badge } from '../ui/Badge';

export const UserDashboard: React.FC = () => {
  const { user, token } = useAuth();
  const [activeTab, setActiveTab] = useState<'search' | 'bookings'>('search');
  const [searchResults, setSearchResults] = useState<Flight[]>([]);
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [userBookings, setUserBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (activeTab === 'bookings' && token) {
      fetchUserBookings();
    }
  }, [activeTab, token]);

  const fetchUserBookings = async () => {
    if (!token) return;
    
    try {
      setLoading(true);
      const response = await api.getUserBookings(token);
      if (response.ok) {
        const bookings = await response.json();
        setUserBookings(bookings);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (filters: any) => {
    try {
      setLoading(true);
      const response = await api.searchFlights(filters);
      if (response.ok) {
        const flights = await response.json();
        setSearchResults(flights);
      }
    } catch (error) {
      console.error('Error searching flights:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFlightSelect = (flightId: string) => {
    const flight = searchResults.find(f => f.id === flightId);
    if (flight) {
      setSelectedFlight(flight);
      setSelectedSeats([]);
    }
  };

  const handleSeatSelect = (seatId: string) => {
    setSelectedSeats(prev => 
      prev.includes(seatId) 
        ? prev.filter(id => id !== seatId)
        : [...prev, seatId]
    );
  };

  const calculateTotal = () => {
    if (!selectedFlight || selectedSeats.length === 0) return 0;
    
    return selectedSeats.reduce((total, seatId) => {
      for (const row of selectedFlight.seatLayout) {
        const seat = row.seats.find(s => s.id === seatId);
        if (seat) total += seat.price;
      }
      return total;
    }, 0);
  };

  const handleBookingConfirm = async (passengerDetails: any[], contactInfo: any) => {
    if (!selectedFlight || !token) return;

    try {
      const bookingData = {
        flightId: selectedFlight.id,
        seats: selectedSeats.map(seatId => {
          for (const row of selectedFlight.seatLayout) {
            const seat = row.seats.find(s => s.id === seatId);
            if (seat) return seat.seatNumber;
          }
          return '';
        }),
        totalPrice: calculateTotal(),
        passengerDetails,
        contactEmail: contactInfo.email,
        contactPhone: contactInfo.phone,
      };

      const response = await api.createBooking(bookingData, token);
      
      if (response.ok) {
        const booking = await response.json();
        
        // Reset state
        setSelectedFlight(null);
        setSelectedSeats([]);
        setShowBookingModal(false);
        
        // Refresh bookings
        fetchUserBookings();
        
        // Show success message
        alert('Booking confirmed! Check your email for confirmation details.');
      } else {
        throw new Error('Booking failed');
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Booking failed. Please try again.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Welcome back, {user?.username}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Ready to book your next scenic adventure?
        </p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1 mb-8 max-w-md">
        <button
          onClick={() => setActiveTab('search')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'search'
              ? 'bg-white dark:bg-gray-800 text-blue-600 shadow'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          <Search className="w-4 h-4 inline mr-2" />
          Search Flights
        </button>
        <button
          onClick={() => setActiveTab('bookings')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'bookings'
              ? 'bg-white dark:bg-gray-800 text-blue-600 shadow'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          <Ticket className="w-4 h-4 inline mr-2" />
          My Bookings
        </button>
      </div>

      {/* Search Tab */}
      {activeTab === 'search' && (
        <div className="space-y-8">
          {/* Flight Search */}
          {!selectedFlight && (
            <FlightSearch onSearch={handleSearch} />
          )}

          {/* Search Results */}
          {!selectedFlight && searchResults.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                Available Flights ({searchResults.length})
              </h2>
              <div className="grid gap-6">
                {searchResults.map((flight) => (
                  <div key={flight.id} className="space-y-4">
                    <FlightCard
                      flight={flight}
                      onBook={handleFlightSelect}
                    />
                    <AIGeneratedDescription flight={flight} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Seat Selection */}
          {selectedFlight && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    Select Your Seats
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {selectedFlight.flightNumber} - {selectedFlight.departure} to {selectedFlight.arrival}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => setSelectedFlight(null)}
                >
                  ← Back to Results
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <SeatMap
                    flight={selectedFlight}
                    selectedSeats={selectedSeats}
                    onSeatSelect={handleSeatSelect}
                  />
                  
                  <div className="mt-6">
                    <InteractiveMap flight={selectedFlight} />
                  </div>
                </div>

                <div>
                  <Card>
                    <CardHeader>
                      <h3 className="text-lg font-semibold">Booking Summary</h3>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Selected Seats</p>
                          <p className="font-medium">
                            {selectedSeats.length > 0 
                              ? selectedSeats.map(seatId => {
                                  for (const row of selectedFlight.seatLayout) {
                                    const seat = row.seats.find(s => s.id === seatId);
                                    if (seat) return seat.seatNumber;
                                  }
                                  return '';
                                }).join(', ')
                              : 'No seats selected'
                            }
                          </p>
                        </div>
                        
                        {selectedSeats.length > 0 && (
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Total Price</p>
                            <p className="text-2xl font-bold text-blue-600">
                              ₹{calculateTotal().toLocaleString()}
                            </p>
                          </div>
                        )}

                        <Button
                          size="lg"
                          disabled={selectedSeats.length === 0}
                          onClick={() => setShowBookingModal(true)}
                          className="w-full"
                        >
                          Continue to Book
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Bookings Tab */}
      {activeTab === 'bookings' && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            My Bookings
          </h2>
          
          {userBookings.length > 0 ? (
            <div className="grid gap-6">
              {userBookings.map((booking) => {
                const flight = searchResults.find(f => f.id === booking.flightId);
                if (!flight) return null;

                return (
                  <div key={booking.id} className="space-y-4">
                    <Card hover>
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                              {flight.flightNumber}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                              {flight.departure} → {flight.arrival}
                            </p>
                          </div>
                          <Badge 
                            variant={booking.status === 'confirmed' ? 'success' : 'warning'}
                          >
                            {booking.status}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <div>
                              <p className="font-medium">{flight.date}</p>
                              <p className="text-gray-500 dark:text-gray-400">
                                {flight.departureTime} - {flight.arrivalTime}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <div>
                              <p className="font-medium">Seats: {booking.seats.join(', ')}</p>
                              <p className="text-gray-500 dark:text-gray-400">
                                {booking.passengerDetails.length} passenger(s)
                              </p>
                            </div>
                          </div>
                          
                          <div>
                            <p className="font-medium">Total Paid</p>
                            <p className="text-lg font-bold text-green-600">
                              ₹{booking.totalPrice.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    {booking.status === 'confirmed' && (
                      <QRTicketDownload booking={booking} flight={flight} />
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Ticket className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  No bookings yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Start exploring our scenic flights to make your first booking!
                </p>
                <Button onClick={() => setActiveTab('search')}>
                  Search Flights
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Booking Modal */}
      {showBookingModal && selectedFlight && (
        <BookingModal
          isOpen={showBookingModal}
          onClose={() => setShowBookingModal(false)}
          flight={selectedFlight}
          selectedSeats={selectedSeats}
          totalPrice={calculateTotal()}
          onConfirm={handleBookingConfirm}
        />
      )}
    </div>
  );
};