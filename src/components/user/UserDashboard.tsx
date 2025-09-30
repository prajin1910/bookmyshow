import React, { useState } from 'react';
import { Search, Ticket, Clock, MapPin } from 'lucide-react';
import { Flight, Booking } from '../../types';
import { FlightSearch } from './FlightSearch';
import { FlightCard } from './FlightCard';
import { SeatMap } from './SeatMap';
import { BookingModal } from './BookingModal';
import { mockFlights, mockBookings } from '../../data/mockData';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Badge } from '../ui/Badge';

export const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'search' | 'bookings'>('search');
  const [searchResults, setSearchResults] = useState<Flight[]>([]);
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [userBookings] = useState<Booking[]>(mockBookings);

  const handleSearch = (filters: any) => {
    // Mock search - in real app, this would call an API
    const results = mockFlights.filter(flight =>
      flight.departure.toLowerCase().includes(filters.departure.toLowerCase()) &&
      flight.arrival.toLowerCase().includes(filters.arrival.toLowerCase())
    );
    setSearchResults(results);
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

  const handleBookingConfirm = (passengerDetails: any[]) => {
    // In real app, this would call booking API
    console.log('Booking confirmed:', { selectedFlight, selectedSeats, passengerDetails });
    
    // Reset state
    setSelectedFlight(null);
    setSelectedSeats([]);
    setShowBookingModal(false);
    
    // Show success message
    alert('Booking confirmed! Check your email for details.');
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
                  <FlightCard
                    key={flight.id}
                    flight={flight}
                    onBook={handleFlightSelect}
                  />
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
                const flight = mockFlights.find(f => f.id === booking.flightId);
                if (!flight) return null;

                return (
                  <Card key={booking.id} hover>
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