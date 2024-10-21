import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

const DateCheckModal = ({ onNext, service, date, setDate }: { onNext: () => void; service: string; date: Date; setDate: (date: Date) => void }) => {
  const [serviceDate, setServiceDate] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Add loading state

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setServiceDate(e.target.value);
    setError('');
  };

  const checkAvailability = async () => {
    if (!serviceDate) {
      setError('Please select a date');
      return;
    }

    setIsLoading(true); // Set loading to true when the request starts
    try {
      console.log(serviceDate, service);
      
      const response = await fetch('/api/services/datecheck', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ serviceDate, nameOfTheService: service.toLowerCase() }),
      });

      const data = await response.json();
      console.log(data);

      if (data.isAvailable) {
        const selectedDate = new Date(serviceDate);
        setDate(selectedDate);
        toast.success("Date is available!");
        onNext(); // Navigate to the next modal
      } else {
        setError('The selected date is not available');
        toast.error("Date is not available");
      }
    } catch (error) {
      console.error('Error checking date availability:', error);
      setError('An error occurred while checking date availability');
      toast.error('An error occurred while checking date availability');
    } finally {
      setIsLoading(false); // Set loading to false once the request completes
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-5">{service}</h1>
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

        <Button
          onClick={checkAvailability}
          className="w-full"
          disabled={isLoading} // Disable button when loading
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
            "Check Availability"
          )}
        </Button>
      </div>
    </div>
  );
};

export default DateCheckModal;
