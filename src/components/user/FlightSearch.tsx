import React, { useState } from 'react';
import { Search, MapPin, Calendar, Users } from 'lucide-react';
import { SearchFilters } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface FlightSearchProps {
  onSearch: (filters: SearchFilters) => void;
  loading?: boolean;
}

const popularDestinations = [
  { from: 'Mumbai', to: 'Goa' },
  { from: 'Delhi', to: 'Leh' },
  { from: 'Chennai', to: 'Port Blair' },
  { from: 'Bangalore', to: 'Mysore' },
];

export const FlightSearch: React.FC<FlightSearchProps> = ({ onSearch, loading }) => {
  const [filters, setFilters] = useState<SearchFilters>({
    departure: '',
    arrival: '',
    date: '',
    passengers: 1,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(filters);
  };

  const handleQuickSelect = (from: string, to: string) => {
    setFilters({
      ...filters,
      departure: from,
      arrival: to,
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Find Your Perfect Scenic Flight
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Discover breathtaking views from 30,000 feet
        </p>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            type="text"
            label="From"
            icon={MapPin}
            placeholder="Departure city"
            value={filters.departure}
            onChange={(e) => setFilters({ ...filters, departure: e.target.value })}
            required
          />
          
          <Input
            type="text"
            label="To"
            icon={MapPin}
            placeholder="Destination city"
            value={filters.arrival}
            onChange={(e) => setFilters({ ...filters, arrival: e.target.value })}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            type="date"
            label="Departure Date"
            icon={Calendar}
            value={filters.date}
            onChange={(e) => setFilters({ ...filters, date: e.target.value })}
            required
            min={new Date().toISOString().split('T')[0]}
          />
          
          <Input
            type="number"
            label="Passengers"
            icon={Users}
            value={filters.passengers}
            onChange={(e) => setFilters({ ...filters, passengers: parseInt(e.target.value) })}
            min={1}
            max={9}
            required
          />
        </div>

        <Button
          type="submit"
          size="lg"
          loading={loading}
          icon={Search}
          className="w-full"
        >
          Search Scenic Flights
        </Button>
      </form>

      {/* Quick Select */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Popular Scenic Routes
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {popularDestinations.map((dest, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleQuickSelect(dest.from, dest.to)}
              className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {dest.from} → {dest.to}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};