import React, { useState } from 'react';
import { Download, QrCode, Plane, Calendar, MapPin, User } from 'lucide-react';
import { Booking, Flight } from '../../types';
import { Button } from '../ui/Button';
import { api } from '../../config/api';
import { useAuth } from '../../contexts/AuthContext';

interface QRTicketDownloadProps {
  booking: Booking;
  flight: Flight;
}

export const QRTicketDownload: React.FC<QRTicketDownloadProps> = ({ booking, flight }) => {
  const { token } = useAuth();
  const [downloading, setDownloading] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);

  const generateQRCode = async () => {
    const qrData = `SCENIC-AIRWAYS|${booking.id}|${flight.flightNumber}|${booking.seats.join(',')}|${booking.passengerDetails[0]?.name}`;
    
    // Generate QR code using a simple canvas approach
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    canvas.width = 200;
    canvas.height = 200;
    
    // Simple QR-like pattern (in a real app, use a proper QR library)
    ctx.fillStyle = '#000';
    const cellSize = 10;
    const data = qrData.split('').map(char => char.charCodeAt(0));
    
    for (let i = 0; i < 20; i++) {
      for (let j = 0; j < 20; j++) {
        if ((data[i * j % data.length] + i + j) % 2 === 0) {
          ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
        }
      }
    }
    
    return canvas.toDataURL();
  };

  const downloadTicket = async () => {
    if (!token) return;
    
    setDownloading(true);
    try {
      // Generate QR code
      const qrDataUrl = await generateQRCode();
      setQrCode(qrDataUrl);

      // Create ticket PDF-like content
      const ticketContent = createTicketHTML(qrDataUrl);
      
      // Create and download
      const blob = new Blob([ticketContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `scenic-airways-ticket-${booking.id}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading ticket:', error);
    } finally {
      setDownloading(false);
    }
  };

  const createTicketHTML = (qrDataUrl: string | null) => {
    return `
<!DOCTYPE html>
<html>
<head>
    <title>Scenic Airways - Boarding Pass</title>
    <style>
        body { 
            font-family: 'Arial', sans-serif; 
            margin: 0; 
            padding: 20px; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }
        .ticket {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .airline-name {
            font-size: 32px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        .tagline {
            font-size: 16px;
            opacity: 0.9;
        }
        .ticket-body {
            display: flex;
            min-height: 400px;
        }
        .main-info {
            flex: 2;
            padding: 40px;
        }
        .qr-section {
            flex: 1;
            background: #f8f9fa;
            padding: 40px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            border-left: 2px dashed #dee2e6;
        }
        .flight-route {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin: 30px 0;
            font-size: 24px;
            font-weight: bold;
        }
        .city {
            text-align: center;
        }
        .city-code {
            font-size: 36px;
            color: #667eea;
        }
        .city-name {
            font-size: 14px;
            color: #666;
            margin-top: 5px;
        }
        .plane-icon {
            color: #667eea;
            font-size: 24px;
        }
        .details-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin: 30px 0;
        }
        .detail-item {
            padding: 15px;
            background: #f8f9fa;
            border-radius: 10px;
        }
        .detail-label {
            font-size: 12px;
            color: #666;
            text-transform: uppercase;
            margin-bottom: 5px;
        }
        .detail-value {
            font-size: 16px;
            font-weight: bold;
            color: #333;
        }
        .qr-code {
            width: 150px;
            height: 150px;
            border: 2px solid #667eea;
            border-radius: 10px;
            margin-bottom: 20px;
        }
        .booking-id {
            font-size: 18px;
            font-weight: bold;
            color: #667eea;
            text-align: center;
            margin-bottom: 10px;
        }
        .scan-text {
            font-size: 12px;
            color: #666;
            text-align: center;
        }
        .passenger-info {
            background: #e3f2fd;
            padding: 20px;
            border-radius: 10px;
            margin: 20px 0;
        }
        .passenger-name {
            font-size: 20px;
            font-weight: bold;
            color: #1976d2;
            margin-bottom: 10px;
        }
        .seats {
            font-size: 18px;
            color: #333;
        }
        .footer {
            background: #f8f9fa;
            padding: 20px;
            text-align: center;
            color: #666;
            font-size: 12px;
        }
        @media print {
            body { background: white; }
            .ticket { box-shadow: none; }
        }
    </style>
</head>
<body>
    <div class="ticket">
        <div class="header">
            <div class="airline-name">✈️ SCENIC AIRWAYS</div>
            <div class="tagline">Where Every Seat Has a View</div>
        </div>
        
        <div class="ticket-body">
            <div class="main-info">
                <div class="flight-route">
                    <div class="city">
                        <div class="city-code">${flight.departure.substring(0, 3).toUpperCase()}</div>
                        <div class="city-name">${flight.departure}</div>
                    </div>
                    <div class="plane-icon">✈️</div>
                    <div class="city">
                        <div class="city-code">${flight.arrival.substring(0, 3).toUpperCase()}</div>
                        <div class="city-name">${flight.arrival}</div>
                    </div>
                </div>
                
                <div class="passenger-info">
                    <div class="passenger-name">${booking.passengerDetails[0]?.name || 'Passenger'}</div>
                    <div class="seats">Seats: ${booking.seats.join(', ')}</div>
                </div>
                
                <div class="details-grid">
                    <div class="detail-item">
                        <div class="detail-label">Flight</div>
                        <div class="detail-value">${flight.flightNumber}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Date</div>
                        <div class="detail-value">${flight.date}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Departure</div>
                        <div class="detail-value">${flight.departureTime}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Aircraft</div>
                        <div class="detail-value">${flight.aircraft}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Status</div>
                        <div class="detail-value">${booking.status.toUpperCase()}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Total Price</div>
                        <div class="detail-value">₹${booking.totalPrice.toLocaleString()}</div>
                    </div>
                </div>
            </div>
            
            <div class="qr-section">
                ${qrDataUrl ? `<img src="${qrDataUrl}" alt="QR Code" class="qr-code">` : '<div class="qr-code" style="background: #f0f0f0; display: flex; align-items: center; justify-content: center;">QR Code</div>'}
                <div class="booking-id">${booking.id}</div>
                <div class="scan-text">Scan at airport for boarding</div>
            </div>
        </div>
        
        <div class="footer">
            <p>Please arrive at the airport at least 2 hours before departure</p>
            <p>For support: support@scenicairways.com | +91-1800-SCENIC</p>
            <p>Generated on ${new Date().toLocaleString()}</p>
        </div>
    </div>
</body>
</html>`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <QrCode className="w-6 h-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Digital Boarding Pass
          </h3>
        </div>
        <Button
          onClick={downloadTicket}
          loading={downloading}
          icon={Download}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          Download Ticket
        </Button>
      </div>

      {/* Ticket Preview */}
      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Plane className="w-8 h-8 text-blue-600" />
            <div>
              <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Scenic Airways
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Where Every Seat Has a View
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-blue-600">{flight.flightNumber}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Booking: {booking.id}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Route</p>
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                {flight.departure} → {flight.arrival}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Date & Time</p>
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                {flight.date} at {flight.departureTime}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Passenger</p>
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                {booking.passengerDetails[0]?.name}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-600">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Seats</p>
            <p className="font-bold text-lg text-blue-600">{booking.seats.join(', ')}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Paid</p>
            <p className="font-bold text-lg text-green-600">₹{booking.totalPrice.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
        <p className="text-sm text-yellow-800 dark:text-yellow-200">
          <strong>Important:</strong> Please arrive at the airport at least 2 hours before departure. 
          Your digital boarding pass contains a QR code for easy check-in.
        </p>
      </div>
    </div>
  );
};