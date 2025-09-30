import React, { useState } from 'react';
import { User, Mail, Phone, Calendar } from 'lucide-react';
import { Flight, PassengerDetail } from '../../types';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  flight: Flight;
  selectedSeats: string[];
  totalPrice: number;
  onConfirm: (passengerDetails: PassengerDetail[]) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  flight,
  selectedSeats,
  totalPrice,
  onConfirm,
}) => {
  const [passengerDetails, setPassengerDetails] = useState<PassengerDetail[]>(
    selectedSeats.map((seatId, index) => ({
      name: '',
      age: 25,
      gender: 'male' as const,
      seatNumber: getSeatNumber(seatId),
    }))
  );
  
  const [loading, setLoading] = useState(false);

  function getSeatNumber(seatId: string): string {
    for (const row of flight.seatLayout) {
      const seat = row.seats.find(s => s.id === seatId);
      if (seat) return seat.seatNumber;
    }
    return '';
  }

  const updatePassenger = (index: number, field: keyof PassengerDetail, value: any) => {
    const updated = [...passengerDetails];
    updated[index] = { ...updated[index], [field]: value };
    setPassengerDetails(updated);
  };

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      onConfirm(passengerDetails);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = passengerDetails.every(p => p.name.trim() && p.age > 0);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Passenger Details" size="lg">
      <div className="space-y-6">
        {/* Flight Summary */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
            Booking Summary
          </h4>
          <div className="space-y-1 text-sm text-blue-700 dark:text-blue-400">
            <p>{flight.flightNumber} - {flight.departure} to {flight.arrival}</p>
            <p>Date: {flight.date} | Time: {flight.departureTime}</p>
            <p>Seats: {selectedSeats.map(seatId => getSeatNumber(seatId)).join(', ')}</p>
            <p className="font-semibold">Total: ₹{totalPrice.toLocaleString()}</p>
          </div>
        </div>

        {/* Passenger Forms */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900 dark:text-gray-100">
            Passenger Information
          </h4>
          {passengerDetails.map((passenger, index) => (
            <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h5 className="font-medium text-gray-900 dark:text-gray-100">
                  Passenger {index + 1} - Seat {passenger.seatNumber}
                </h5>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  icon={User}
                  placeholder="Enter passenger name"
                  value={passenger.name}
                  onChange={(e) => updatePassenger(index, 'name', e.target.value)}
                  required
                />
                
                <Input
                  type="number"
                  label="Age"
                  icon={Calendar}
                  placeholder="Enter age"
                  value={passenger.age}
                  onChange={(e) => updatePassenger(index, 'age', parseInt(e.target.value))}
                  min={1}
                  max={120}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Gender
                </label>
                <div className="flex gap-4">
                  {['male', 'female', 'other'].map((gender) => (
                    <label key={gender} className="flex items-center">
                      <input
                        type="radio"
                        name={`gender-${index}`}
                        value={gender}
                        checked={passenger.gender === gender}
                        onChange={(e) => updatePassenger(index, 'gender', e.target.value as any)}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                        {gender}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Information */}
        <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 space-y-4">
          <h5 className="font-medium text-gray-900 dark:text-gray-100">
            Contact Information
          </h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="email"
              label="Email"
              icon={Mail}
              placeholder="booking@example.com"
              required
            />
            <Input
              type="tel"
              label="Phone"
              icon={Phone}
              placeholder="+91 9876543210"
              required
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            loading={loading}
            disabled={!isFormValid}
            className="flex-1"
          >
            Confirm Booking - ₹{totalPrice.toLocaleString()}
          </Button>
        </div>
      </div>
    </Modal>
  );
};