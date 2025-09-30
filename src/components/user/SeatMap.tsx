import React from 'react';
import { CheckCircle, X } from 'lucide-react';
import { Flight, Seat } from '../../types';
import { Badge } from '../ui/Badge';

interface SeatMapProps {
  flight: Flight;
  selectedSeats: string[];
  onSeatSelect: (seatId: string) => void;
}

export const SeatMap: React.FC<SeatMapProps> = ({ flight, selectedSeats, onSeatSelect }) => {
  const getSeatClassName = (seat: Seat) => {
    const baseClasses = 'w-10 h-10 rounded-lg border-2 transition-all duration-200 cursor-pointer flex items-center justify-center text-xs font-medium';
    
    if (!seat.isAvailable) {
      return `${baseClasses} bg-gray-300 border-gray-400 cursor-not-allowed text-gray-600`;
    }
    
    if (selectedSeats.includes(seat.id)) {
      return `${baseClasses} bg-blue-600 border-blue-600 text-white shadow-lg`;
    }
    
    if (seat.isScenic) {
      return `${baseClasses} bg-gradient-to-br from-orange-100 to-yellow-100 border-orange-300 hover:from-orange-200 hover:to-yellow-200 text-orange-800 shadow-md`;
    }
    
    const typeClasses = {
      economy: 'bg-gray-50 border-gray-300 hover:bg-gray-100 text-gray-700',
      premium: 'bg-blue-50 border-blue-300 hover:bg-blue-100 text-blue-700',
      business: 'bg-purple-50 border-purple-300 hover:bg-purple-100 text-purple-700',
    };
    
    return `${baseClasses} ${typeClasses[seat.type]}`;
  };

  const getScenicSideIndicator = () => {
    if (flight.scenicSide === 'both') {
      return (
        <div className="flex justify-between text-sm font-medium text-orange-600">
          <span>🌅 Scenic Side</span>
          <span>Scenic Side 🌅</span>
        </div>
      );
    }
    
    return (
      <div className={`text-sm font-medium text-orange-600 ${flight.scenicSide === 'right' ? 'text-right' : 'text-left'}`}>
        🌅 Scenic Side ({flight.scenicSide})
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      {/* Aircraft Header */}
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          {flight.aircraft} - Seat Map
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Select your preferred seats for the best scenic views
        </p>
      </div>

      {/* Scenic Side Indicator */}
      <div className="mb-6">
        {getScenicSideIndicator()}
      </div>

      {/* Aircraft Body */}
      <div className="relative bg-gray-100 dark:bg-gray-700 rounded-full p-6 mx-auto max-w-md">
        {/* Cockpit */}
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-blue-600 rounded-t-full"></div>
        
        {/* Seat Rows */}
        <div className="space-y-4">
          {flight.seatLayout.map((row) => (
            <div key={row.row} className="flex justify-center items-center gap-2">
              {/* Left Seats */}
              <div className="flex gap-1">
                {row.seats.slice(0, Math.ceil(row.seats.length / 2)).map((seat) => (
                  <button
                    key={seat.id}
                    className={getSeatClassName(seat)}
                    onClick={() => seat.isAvailable && onSeatSelect(seat.id)}
                    disabled={!seat.isAvailable}
                    title={`${seat.seatNumber} - ${seat.type} - ₹${seat.price} ${seat.isScenic ? '(Scenic)' : ''}`}
                  >
                    {seat.isScenic && '🌅'}
                    {!seat.isAvailable && <X size={12} />}
                    {selectedSeats.includes(seat.id) && <CheckCircle size={12} />}
                  </button>
                ))}
              </div>
              
              {/* Aisle */}
              <div className="w-8 flex items-center justify-center">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  {row.row}
                </span>
              </div>
              
              {/* Right Seats */}
              <div className="flex gap-1">
                {row.seats.slice(Math.ceil(row.seats.length / 2)).map((seat) => (
                  <button
                    key={seat.id}
                    className={getSeatClassName(seat)}
                    onClick={() => seat.isAvailable && onSeatSelect(seat.id)}
                    disabled={!seat.isAvailable}
                    title={`${seat.seatNumber} - ${seat.type} - ₹${seat.price} ${seat.isScenic ? '(Scenic)' : ''}`}
                  >
                    {seat.isScenic && '🌅'}
                    {!seat.isAvailable && <X size={12} />}
                    {selectedSeats.includes(seat.id) && <CheckCircle size={12} />}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gradient-to-br from-orange-100 to-yellow-100 border border-orange-300 rounded"></div>
          <span>Scenic Seat</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-600 rounded"></div>
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-300 rounded"></div>
          <span>Occupied</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-50 border border-gray-300 rounded"></div>
          <span>Available</span>
        </div>
      </div>

      {/* Seat Types */}
      <div className="mt-4 flex flex-wrap gap-2">
        <Badge variant="default">Economy</Badge>
        <Badge variant="info">Premium</Badge>
        <Badge variant="success">Business</Badge>
      </div>
    </div>
  );
};