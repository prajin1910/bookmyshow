import React, { useEffect, useRef, useState } from 'react';
import { Sun, Sunrise, Sunset, MapPin, Plane } from 'lucide-react';
import { Flight, RoutePoint } from '../../types';

interface InteractiveMapProps {
  flight: Flight;
  className?: string;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({ flight, className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [sunPosition, setSunPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (canvasRef.current && flight.route) {
      drawMap();
    }
  }, [flight, currentTime]);

  const calculateSunPosition = (time: Date, lat: number, lng: number) => {
    // Simplified sun position calculation
    const hour = time.getHours() + time.getMinutes() / 60;
    const dayOfYear = Math.floor((time.getTime() - new Date(time.getFullYear(), 0, 0).getTime()) / 86400000);
    
    // Solar declination
    const declination = 23.45 * Math.sin((360 * (284 + dayOfYear) / 365) * Math.PI / 180);
    
    // Hour angle
    const hourAngle = 15 * (hour - 12);
    
    // Solar elevation
    const elevation = Math.asin(
      Math.sin(declination * Math.PI / 180) * Math.sin(lat * Math.PI / 180) +
      Math.cos(declination * Math.PI / 180) * Math.cos(lat * Math.PI / 180) * Math.cos(hourAngle * Math.PI / 180)
    ) * 180 / Math.PI;
    
    // Solar azimuth (simplified)
    const azimuth = 180 + Math.atan2(
      Math.sin(hourAngle * Math.PI / 180),
      Math.cos(hourAngle * Math.PI / 180) * Math.sin(lat * Math.PI / 180) - Math.tan(declination * Math.PI / 180) * Math.cos(lat * Math.PI / 180)
    ) * 180 / Math.PI;
    
    return { elevation, azimuth };
  };

  const drawMap = () => {
    const canvas = canvasRef.current;
    if (!canvas || !flight.route) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);

    // Calculate bounds
    const lats = flight.route.map(p => p.lat);
    const lngs = flight.route.map(p => p.lng);
    const minLat = Math.min(...lats) - 1;
    const maxLat = Math.max(...lats) + 1;
    const minLng = Math.min(...lngs) - 1;
    const maxLng = Math.max(...lngs) + 1;

    // Convert lat/lng to canvas coordinates
    const latToY = (lat: number) => height - ((lat - minLat) / (maxLat - minLat)) * height;
    const lngToX = (lng: number) => ((lng - minLng) / (maxLng - minLng)) * width;

    // Draw background gradient (sky)
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#87CEEB'); // Sky blue
    gradient.addColorStop(1, '#98FB98'); // Light green (ground)
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Draw route line
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 3;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    
    flight.route.forEach((point, index) => {
      const x = lngToX(point.lng);
      const y = latToY(point.lat);
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw route points
    flight.route.forEach((point, index) => {
      const x = lngToX(point.lng);
      const y = latToY(point.lat);

      // Draw point
      ctx.fillStyle = point.type === 'departure' ? '#10b981' : 
                     point.type === 'arrival' ? '#ef4444' : '#f59e0b';
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, 2 * Math.PI);
      ctx.fill();

      // Draw label
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(point.name, x, y - 15);
    });

    // Calculate and draw sun position
    if (flight.route.length > 0) {
      const midPoint = flight.route[Math.floor(flight.route.length / 2)];
      const sunPos = calculateSunPosition(currentTime, midPoint.lat, midPoint.lng);
      
      // Draw sun
      const sunX = width * 0.8;
      const sunY = height * 0.2;
      
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(sunX, sunY, 20, 0, 2 * Math.PI);
      ctx.fill();
      
      // Draw sun rays
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 2;
      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI) / 4;
        const startX = sunX + Math.cos(angle) * 25;
        const startY = sunY + Math.sin(angle) * 25;
        const endX = sunX + Math.cos(angle) * 35;
        const endY = sunY + Math.sin(angle) * 35;
        
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
      }

      setSunPosition({ x: sunX, y: sunY });
    }

    // Draw scenic side indicator
    const scenicText = `Best views: ${flight.scenicSide === 'both' ? 'Both sides' : `${flight.scenicSide} side`}`;
    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(scenicText, 10, height - 10);
  };

  const getSunIcon = () => {
    const hour = currentTime.getHours();
    if (hour < 7) return <Sunrise className="w-5 h-5 text-orange-500" />;
    if (hour > 18) return <Sunset className="w-5 h-5 text-orange-600" />;
    return <Sun className="w-5 h-5 text-yellow-500" />;
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden ${className}`}>
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            Flight Route Map
          </h3>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            {getSunIcon()}
            <span>{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>
      </div>
      
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={600}
          height={400}
          className="w-full h-auto"
        />
        
        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-gray-800/90 rounded-lg p-3 text-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Departure</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Arrival</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span>Waypoint</span>
            </div>
            <div className="flex items-center gap-2">
              <Plane className="w-3 h-3 text-blue-600" />
              <span>Flight Path</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};