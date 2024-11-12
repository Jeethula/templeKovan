import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import toast from 'react-hot-toast';
import DetailsModal from './DetailsModal';
import { Calendar } from '../ui/calendar';

interface DateCheckModalProps {
  title: string;
  id: string;
  open: boolean;
  minAmount:number;
  userId: string;
  onClose: () => void;
}

const DateCheckModal: React.FC<DateCheckModalProps> = ({ 
  title, 
  id, 
  open, 
  minAmount,
  onClose, 
  userId 
}) => {
  const [serviceDate, setServiceDate] = useState<Date | undefined>(undefined);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [formattedDate, setFormattedDate] = useState<string>('');
  
  const checkAvailability = async () => {
    if (!serviceDate) {
      setError('Please select a date');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
       setFormattedDate(new Date(serviceDate.getTime() - (serviceDate.getTimezoneOffset() * 60000))
      .toISOString()
      .split('T')[0]);
      
      const response = await fetch('/api/services/datecheck', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          serviceDate: formattedDate, 
          nameOfTheServiceId: id 
        }),
      });

      const data = await response.json();

      if (data.isAvailable) {
        onClose(); // First close the date check modal
        setTimeout(() => {
          setShowDetailsModal(true); // Then open the details modal
        }, 100); // Small delay to ensure smooth transition
      } else {
        setError('The selected date is not available');
      }
    } catch (error) {
      console.error('Error checking date availability:', error);
      setError('An error occurred while checking date availability');
      toast.error('Error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDetailsModalClose = () => {
    setShowDetailsModal(false);
  };

  return (
    <>
      {/* Date Check Modal */}
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Select Date for {title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="relative">
              <div className="grid justify-center">
                <Calendar
                  mode="single"
                  selected={serviceDate}
                  onSelect={(date: Date | undefined) => {
                    setServiceDate(date);
                    if (date) {
                      setError('');
                    }
                  }}
                  disabled={(date) => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    return date < today;
                  }}
                  className="rounded-md border w-full"
                />
                {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
              </div>
            </div>

            <Button 
              onClick={checkAvailability} 
              className="w-full bg-[rgb(102,51,153)]" 
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-3 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    ></path>
                  </svg>
                  Checking...
                </span>
              ) : (
                'Check Availability'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Details Modal */}
      <Dialog 
        open={showDetailsModal} 
        onOpenChange={(open) => !open && handleDetailsModalClose()}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DetailsModal
            serviceName={title}
            date={formattedDate || new Date()}
            userId={userId}
            minAmount={minAmount}
            nameOfTheServiceId={id}
            onSubmitSuccess={handleDetailsModalClose}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DateCheckModal;