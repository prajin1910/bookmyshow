import React, { useState, useEffect } from 'react';
import { Plane, MapPin, Calendar, Clock, Info } from 'lucide-react';
import { Flight, SeatRow, RoutePoint } from '../../types';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface FlightFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (flight: Omit<Flight, 'id'>) => void;
  initialData?: Flight | null;
}

export const FlightForm: React.FC<FlightFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData
}) => {
  const [formData, setFormData] = useState({
    flightNumber: '',
    departure: '',
    arrival: '',
    departureTime: '',
    arrivalTime: '',
    date: '',
    aircraft: '',
    scenicSide: 'left' as 'left' | 'right' | 'both',
    scenicDescription: '',
    price: 8500,
    totalSeats: 150,
    availableSeats: 150,
    sunPosition: 'daylight' as 'sunrise' | 'sunset' | 'daylight',
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        flightNumber: initialData.flightNumber,
        departure: initialData.departure,
        arrival: initialData.arrival,
        departureTime: initialData.departureTime,
        arrivalTime: initialData.arrivalTime,
        date: initialData.date,
        aircraft: initialData.aircraft,
        scenicSide: initialData.scenicSide,
        scenicDescription: initialData.scenicDescription,
        price: initialData.price,
        totalSeats: initialData.totalSeats,
        availableSeats: initialData.availableSeats,
        sunPosition: initialData.sunPosition || 'daylight',
      });
    } else {
      // Reset form for new flight
      setFormData({
        flightNumber: '',
        departure: '',
        arrival: '',
        departureTime: '',
        arrivalTime: '',
        date: '',
        aircraft: '',
        scenicSide: 'left',
        scenicDescription: '',
        price: 8500,
        totalSeats: 150,
        availableSeats: 150,
        sunPosition: 'daylight',
      });
    }
  }, [initialData, isOpen]);

  const generateSeatLayout = (totalSeats: number): SeatRow[] => {
    const rows: SeatRow[] = [];
    const seatsPerRow = 6; // 3-3 configuration for most aircraft
    const numRows = Math.ceil(totalSeats / seatsPerRow);
    
    for (let i = 0; i < numRows; i++) {
      const rowLetter = String.fromCharCode(65 + i); // A, B, C, etc.
      const seats = [];
      
      for (let j = 0; j < seatsPerRow && (i * seatsPerRow + j) < totalSeats; j++) {
        const seatNumber = `${rowLetter}${j + 1}`;
        const isWindowSeat = j === 0 || j === seatsPerRow - 1;
        const isLeftSide = j < seatsPerRow / 2;
        
        let isScenic = false;
        if (formData.scenicSide === 'both') {
          isScenic = isWindowSeat;
        } else if (formData.scenicSide === 'left' && isLeftSide && isWindowSeat) {
          isScenic = true;
        } else if (formData.scenicSide === 'right' && !isLeftSide && isWindowSeat) {
          isScenic = true;
        }

        let seatType: 'economy' | 'premium' | 'business' = 'economy';
        if (i < 2) seatType = 'business';
        else if (i < 5) seatType = 'premium';

        let seatPrice = formData.price;
        if (seatType === 'business') seatPrice = Math.round(formData.price * 1.4);
        else if (seatType === 'premium') seatPrice = Math.round(formData.price * 1.2);
        
        seats.push({
          id: `${seatNumber}-${Math.random()}`,
          seatNumber,
          type: seatType,
          isScenic,
          isAvailable: true,
          price: seatPrice,
        });
      }
      
      rows.push({ row: rowLetter, seats });
    }
    
    return rows;
  };

  const generateRoutePoints = (): RoutePoint[] => {
    // This would typically come from a mapping service
    const routeMap: Record<string, { lat: number; lng: number }> = {
      'Mumbai': { lat: 19.0760, lng: 72.8777 },
      'Goa': { lat: 15.2993, lng: 74.1240 },
      'Delhi': { lat: 28.7041, lng: 77.1025 },
      'Leh': { lat: 34.1526, lng: 77.5771 },
      'Chennai': { lat: 13.0827, lng: 80.2707 },
      'Port Blair': { lat: 11.6234, lng: 92.7265 },
      'Bangalore': { lat: 12.9716, lng: 77.5946 },
      'Mysore': { lat: 12.2958, lng: 76.6394 },
    };

    const departureCoords = routeMap[formData.departure];
    const arrivalCoords = routeMap[formData.arrival];
    
    if (!departureCoords || !arrivalCoords) {
      return [
        { lat: 0, lng: 0, name: formData.departure, type: 'departure' },
        { lat: 0, lng: 0, name: formData.arrival, type: 'arrival' }
      ];
    }

    // Add a waypoint between departure and arrival
    const waypointLat = (departureCoords.lat + arrivalCoords.lat) / 2;
    const waypointLng = (departureCoords.lng + arrivalCoords.lng) / 2;

    return [
      { ...departureCoords, name: formData.departure, type: 'departure' },
      { lat: waypointLat, lng: waypointLng, name: 'En Route', type: 'waypoint' },
      { ...arrivalCoords, name: formData.arrival, type: 'arrival' }
    ];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const flightData: Omit<Flight, 'id'> = {
        ...formData,
        seatLayout: generateSeatLayout(formData.totalSeats),
        route: generateRoutePoints(),
      };

      onSubmit(flightData);
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Flight' : 'Add New Flight'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Flight Number"
            icon={Plane}
            placeholder="e.g., SA101"
            value={formData.flightNumber}
            onChange={(e) => updateField('flightNumber', e.target.value)}
            required
          />
          
          <Input
            label="Aircraft"
            placeholder="e.g., Boeing 737"
            value={formData.aircraft}
            onChange={(e) => updateField('aircraft', e.target.value)}
            required
          />
        </div>

        {/* Route Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Departure City"
            icon={MapPin}
            placeholder="e.g., Mumbai"
            value={formData.departure}
            onChange={(e) => updateField('departure', e.target.value)}
            required
          />
          
          <Input
            label="Arrival City"
            icon={MapPin}
            placeholder="e.g., Goa"
            value={formData.arrival}
            onChange={(e) => updateField('arrival', e.target.value)}
            required
          />
        </div>

        {/* Schedule */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            type="date"
            label="Date"
            icon={Calendar}
            value={formData.date}
            onChange={(e) => updateField('date', e.target.value)}
            required
            min={new Date().toISOString().split('T')[0]}
          />
          
          <Input
            type="time"
            label="Departure Time"
            icon={Clock}
            value={formData.departureTime}
            onChange={(e) => updateField('departureTime', e.target.value)}
            required
          />
          
          <Input
            type="time"
            label="Arrival Time"
            icon={Clock}
            value={formData.arrivalTime}
            onChange={(e) => updateField('arrivalTime', e.target.value)}
            required
          />
        </div>

        {/* Scenic Configuration */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900 dark:text-gray-100">
            Scenic Configuration
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Scenic Side
              </label>
              <select
                value={formData.scenicSide}
                onChange={(e) => updateField('scenicSide', e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                required
              >
                <option value="left">Left Side</option>
                <option value="right">Right Side</option>
                <option value="both">Both Sides</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Sun Position
              </label>
              <select
                value={formData.sunPosition}
                onChange={(e) => updateField('sunPosition', e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                required
              >
                <option value="sunrise">Sunrise</option>
                <option value="sunset">Sunset</option>
                <option value="daylight">Daylight</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Scenic Description
            </label>
            <textarea
              value={formData.scenicDescription}
              onChange={(e) => updateField('scenicDescription', e.target.value)}
              placeholder="Describe what passengers will see during this flight..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              rows={3}
              required
            />
          </div>
        </div>

        {/* Pricing and Capacity */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            type="number"
            label="Base Price (₹)"
            value={formData.price}
            onChange={(e) => updateField('price', parseInt(e.target.value))}
            min={1000}
            required
          />
          
          <Input
            type="number"
            label="Total Seats"
            value={formData.totalSeats}
            onChange={(e) => {
              const total = parseInt(e.target.value);
              updateField('totalSeats', total);
              updateField('availableSeats', total); // Reset available seats
            }}
            min={50}
            max={500}
            required
          />
          
          <Input
            type="number"
            label="Available Seats"
            value={formData.availableSeats}
            onChange={(e) => updateField('availableSeats', parseInt(e.target.value))}
            min={0}
            max={formData.totalSeats}
            required
          />
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={loading}
            className="flex-1"
          >
            {initialData ? 'Update Flight' : 'Add Flight'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};