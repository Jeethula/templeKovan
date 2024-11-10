import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import toast from 'react-hot-toast';
import { Calendar } from '../ui/calendar';

interface DateCheckModalProps {
  title: string;
  id: string;
  open: boolean;
  onClose: () => void;
}

const DateCheckModal: React.FC<DateCheckModalProps> = ({ title, id, open, onClose }) => {
  const [serviceDate, setServiceDate] = useState<Date | undefined>(undefined);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  console.log(id);
  console.log(title);
  
  // const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setServiceDate(new Date(e.target.value));
  //   setError('');
  // };
   
    

  const checkAvailability = async (): Promise<void> => {
    setIsLoading(true); 
    try {
      if (!serviceDate) {
        setError('Please select a date');
        setIsLoading(false);
        return;
      }

      const formattedDate = serviceDate.toISOString().split('T')[0];
      const requestBody = { 
        serviceDate: formattedDate, 
        nameOfTheServiceId: id 
      };

      const response = await fetch('/api/services/datecheck', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      if (data.isAvailable) {
        const selectedDate = new Date(serviceDate);
        router.push(`/services/${id}?date=${selectedDate.toISOString()}`);
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

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className='text-[#663399] '>{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
            <div className="relative">
            <div className="grid justify-center"> {/* Add this wrapper div */}
              <Calendar
                mode="single"
                selected={serviceDate}
                onSelect={(date: Date | undefined) => {
                  setServiceDate(date);
                  if (date) {
                    // const formattedDate = date.toISOString().split('T')[0];
                    setError('');
                  }
                }}
                disabled={(date) => {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  return date < today;
                }}
                className="rounded-md border w-full" // Add w-full
              />
              {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
            </div>
            </div>

          <Button onClick={checkAvailability} className="w-full bg-[#663399] hover:bg-[#663399]" disabled={isLoading}>
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
  );
};

export default DateCheckModal;
