import React, { useState } from 'react';
import { PlusCircle, Plane, Users, Calendar, TrendingUp, CreditCard as Edit, Trash2, Eye } from 'lucide-react';
import { Flight, Booking } from '../../types';
import { FlightForm } from './FlightForm';
import { mockFlights, mockBookings } from '../../data/mockData';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'flights' | 'bookings' | 'analytics'>('overview');
  const [flights, setFlights] = useState<Flight[]>(mockFlights);
  const [showFlightForm, setShowFlightForm] = useState(false);
  const [editingFlight, setEditingFlight] = useState<Flight | null>(null);
  const [showFlightDetails, setShowFlightDetails] = useState<Flight | null>(null);

  const stats = {
    totalFlights: flights.length,
    totalBookings: mockBookings.length,
    totalRevenue: mockBookings.reduce((sum, booking) => sum + booking.totalPrice, 0),
    averageOccupancy: 75
  };

  const handleAddFlight = (flightData: Omit<Flight, 'id'>) => {
    const newFlight: Flight = {
      ...flightData,
      id: 'FL' + String(flights.length + 1).padStart(3, '0'),
    };
    setFlights([...flights, newFlight]);
    setShowFlightForm(false);
  };

  const handleEditFlight = (flightData: Omit<Flight, 'id'>) => {
    if (editingFlight) {
      const updatedFlights = flights.map(f => 
        f.id === editingFlight.id ? { ...flightData, id: editingFlight.id } : f
      );
      setFlights(updatedFlights);
      setEditingFlight(null);
      setShowFlightForm(false);
    }
  };

  const handleDeleteFlight = (flightId: string) => {
    if (confirm('Are you sure you want to delete this flight?')) {
      setFlights(flights.filter(f => f.id !== flightId));
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'flights', label: 'Flights', icon: Plane },
    { id: 'bookings', label: 'Bookings', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: Calendar },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage flights, bookings, and monitor performance
        </p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1 mb-8">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-gray-800 text-blue-600 shadow'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <Icon className="w-4 h-4 inline mr-2" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Total Flights
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                      {stats.totalFlights}
                    </p>
                  </div>
                  <Plane className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Total Bookings
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                      {stats.totalBookings}
                    </p>
                  </div>
                  <Users className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Total Revenue
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                      ₹{stats.totalRevenue.toLocaleString()}
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Avg. Occupancy
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                      {stats.averageOccupancy}%
                    </p>
                  </div>
                  <Calendar className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Recent Bookings</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockBookings.slice(0, 5).map(booking => {
                  const flight = flights.find(f => f.id === booking.flightId);
                  return (
                    <div key={booking.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          {flight?.flightNumber} - {booking.seats.join(', ')}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {booking.passengerDetails.length} passenger(s) • {booking.bookingDate}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">
                          ₹{booking.totalPrice.toLocaleString()}
                        </p>
                        <Badge variant="success">{booking.status}</Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Flights Tab */}
      {activeTab === 'flights' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Flight Management
            </h2>
            <Button
              icon={PlusCircle}
              onClick={() => setShowFlightForm(true)}
            >
              Add New Flight
            </Button>
          </div>

          <div className="grid gap-6">
            {flights.map(flight => (
              <Card key={flight.id} hover>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                          {flight.flightNumber}
                        </h3>
                        <Badge variant="info">{flight.aircraft}</Badge>
                        <Badge 
                          variant={flight.scenicSide === 'both' ? 'success' : 'default'}
                        >
                          Scenic {flight.scenicSide}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100">Route</p>
                          <p className="text-gray-600 dark:text-gray-400">
                            {flight.departure} → {flight.arrival}
                          </p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100">Schedule</p>
                          <p className="text-gray-600 dark:text-gray-400">
                            {flight.date} | {flight.departureTime} - {flight.arrivalTime}
                          </p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100">Occupancy</p>
                          <p className="text-gray-600 dark:text-gray-400">
                            {flight.totalSeats - flight.availableSeats}/{flight.totalSeats} booked
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={Eye}
                        onClick={() => setShowFlightDetails(flight)}
                      >
                        View
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={Edit}
                        onClick={() => {
                          setEditingFlight(flight);
                          setShowFlightForm(true);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={Trash2}
                        onClick={() => handleDeleteFlight(flight.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Bookings Tab */}
      {activeTab === 'bookings' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Booking Management
          </h2>
          
          <div className="grid gap-6">
            {mockBookings.map(booking => {
              const flight = flights.find(f => f.id === booking.flightId);
              return (
                <Card key={booking.id} hover>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-4">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            Booking #{booking.id}
                          </h3>
                          <Badge 
                            variant={booking.status === 'confirmed' ? 'success' : 'warning'}
                          >
                            {booking.status}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-gray-100">Flight</p>
                            <p className="text-gray-600 dark:text-gray-400">
                              {flight?.flightNumber}
                            </p>
                            <p className="text-gray-600 dark:text-gray-400">
                              {flight?.departure} → {flight?.arrival}
                            </p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-gray-100">Passenger</p>
                            <p className="text-gray-600 dark:text-gray-400">
                              {booking.passengerDetails[0]?.name}
                            </p>
                            <p className="text-gray-600 dark:text-gray-400">
                              +{booking.passengerDetails.length - 1} others
                            </p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-gray-100">Seats</p>
                            <p className="text-gray-600 dark:text-gray-400">
                              {booking.seats.join(', ')}
                            </p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-gray-100">Total</p>
                            <p className="text-lg font-bold text-green-600">
                              ₹{booking.totalPrice.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Analytics & Reports
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Popular Routes</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {flights.map((flight, index) => (
                    <div key={flight.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          {flight.departure} → {flight.arrival}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {flight.totalSeats - flight.availableSeats} bookings
                        </p>
                      </div>
                      <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ 
                            width: `${((flight.totalSeats - flight.availableSeats) / flight.totalSeats) * 100}%` 
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Revenue Breakdown</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Total Revenue</span>
                    <span className="font-bold text-gray-900 dark:text-gray-100">
                      ₹{stats.totalRevenue.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Average Booking</span>
                    <span className="font-bold text-gray-900 dark:text-gray-100">
                      ₹{Math.round(stats.totalRevenue / stats.totalBookings).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Scenic Seat Premium</span>
                    <span className="font-bold text-green-600">+25%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Flight Form Modal */}
      {showFlightForm && (
        <FlightForm
          isOpen={showFlightForm}
          onClose={() => {
            setShowFlightForm(false);
            setEditingFlight(null);
          }}
          onSubmit={editingFlight ? handleEditFlight : handleAddFlight}
          initialData={editingFlight}
        />
      )}

      {/* Flight Details Modal */}
      {showFlightDetails && (
        <Modal
          isOpen={!!showFlightDetails}
          onClose={() => setShowFlightDetails(null)}
          title="Flight Details"
          size="lg"
        >
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Flight Information
                </h4>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Flight:</span> {showFlightDetails.flightNumber}</p>
                  <p><span className="font-medium">Aircraft:</span> {showFlightDetails.aircraft}</p>
                  <p><span className="font-medium">Route:</span> {showFlightDetails.departure} → {showFlightDetails.arrival}</p>
                  <p><span className="font-medium">Date:</span> {showFlightDetails.date}</p>
                  <p><span className="font-medium">Time:</span> {showFlightDetails.departureTime} - {showFlightDetails.arrivalTime}</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Scenic Information
                </h4>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Scenic Side:</span> {showFlightDetails.scenicSide}</p>
                  <p><span className="font-medium">Sun Position:</span> {showFlightDetails.sunPosition}</p>
                  <p className="text-gray-600 dark:text-gray-400">
                    {showFlightDetails.scenicDescription}
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Seat Availability
              </h4>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="font-medium">Total Seats</p>
                  <p>{showFlightDetails.totalSeats}</p>
                </div>
                <div>
                  <p className="font-medium">Available</p>
                  <p>{showFlightDetails.availableSeats}</p>
                </div>
                <div>
                  <p className="font-medium">Booked</p>
                  <p>{showFlightDetails.totalSeats - showFlightDetails.availableSeats}</p>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};