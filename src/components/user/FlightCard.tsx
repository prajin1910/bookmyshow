import React from 'react';
import { Plane, Clock, MapPin, Sunrise, Sun, Sunset } from 'lucide-react';
import { Flight } from '../../types';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

interface FlightCardProps {
  flight: Flight;
  onBook: (flightId: string) => void;
}

export const FlightCard: React.FC<FlightCardProps> = ({ flight, onBook }) => {
  const getSunIcon = () => {
    switch (flight.sunPosition) {
      case 'sunrise': return <Sunrise className="w-4 h-4" />;
      case 'sunset': return <Sunset className="w-4 h-4" />;
      default: return <Sun className="w-4 h-4" />;
    }
  };

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700">
      {/* Header with scenic badge */}
      <div className="relative bg-gradient-to-r from-blue-600 to-teal-600 p-4 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold">{flight.flightNumber}</h3>
            <p className="text-blue-100">{flight.aircraft}</p>
          </div>
          <div className="flex items-center gap-2 bg-white/20 rounded-full px-3 py-1">
            {getSunIcon()}
            <span className="text-sm font-medium">
              Scenic {flight.scenicSide === 'both' ? 'Views' : `${flight.scenicSide} side`}
            </span>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Route and timing */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {formatTime(flight.departureTime)}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{flight.departure}</p>
            </div>
            
            <div className="flex-1 px-4">
              <div className="relative">
                <div className="border-t-2 border-dashed border-gray-300 dark:border-gray-600"></div>
                <Plane className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 text-blue-600 w-6 h-6 p-1 rounded-full" />
              </div>
              <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                1h 30m
              </p>
            </div>
            
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {formatTime(flight.arrivalTime)}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{flight.arrival}</p>
            </div>
          </div>
        </div>

        {/* Scenic description */}
        <div className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 p-4 rounded-lg mb-4">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-orange-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                Scenic Highlights
              </h4>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {flight.scenicDescription}
              </p>
            </div>
          </div>
        </div>

        {/* Details and price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Badge variant="info">{flight.date}</Badge>
            <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
              <Clock size={16} />
              <span>{flight.availableSeats} seats left</span>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-sm text-gray-500 dark:text-gray-400">Starting from</p>
            <p className="text-2xl font-bold text-blue-600">₹{flight.price.toLocaleString()}</p>
          </div>
        </div>

        {/* Book button */}
        <Button
          size="lg"
          onClick={() => onBook(flight.id)}
          className="w-full mt-4"
        >
          Select Seats
        </Button>
      </div>
    </div>
  );
};