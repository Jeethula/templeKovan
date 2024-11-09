import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import toast from 'react-hot-toast';

interface DateCheckModalProps {
  title: string;
  id: string;
  open: boolean;
  onClose: () => void;
}

const DateCheckModal: React.FC<DateCheckModalProps> = ({ title, id, open, onClose }) => {
  const [serviceDate, setServiceDate] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  console.log(id);
  console.log(title);
  
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setServiceDate(e.target.value);
    setError('');
  };
   
    

  const checkAvailability = async (): Promise<void> => {
    setIsLoading(true); 
    try {
      const selectedDate = new Date(serviceDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0); 
  
      if (selectedDate < today) {
        setError('The selected date is in the past');
        toast.error('Selected date is not valid');
        setIsLoading(false);
        return;
      }
      const response = await fetch('/api/services/datecheck', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ serviceDate,nameOfTheServiceId: id }),
      });

      const data = await response.json();
      if (data.isAvailable) {
        const selectedDate = new Date(serviceDate)
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
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="relative">
            <Input
              type="date"
              id="serviceDate"
              value={serviceDate}
              onChange={handleDateChange}
              placeholder=" "
              className={`block w-full text-sm bg-transparent rounded-lg border appearance-none focus:outline-none focus:ring-0 peer ${
                error ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            <Label
              htmlFor="serviceDate"
              className="absolute text-sm duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
            >
              Service Date
            </Label>
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
          </div>

          <Button onClick={checkAvailability} className="w-full" disabled={isLoading}>
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
