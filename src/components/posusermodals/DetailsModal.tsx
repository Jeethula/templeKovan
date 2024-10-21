import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

interface FormData {
  description: string;
  amount: string;
}

const DetailsModal = ({ service, date, userId }: { service: string; date: Date; userId: string }) => {
  const sessionData = JSON.parse(sessionStorage.getItem("user") || "{}");
  const posUserId: string = sessionData.id;

  const [formData, setFormData] = useState<FormData>({
    description: '',
    amount: '',
  });

  const [errors, setErrors] = useState({
    description: '',
    amount: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  useEffect(() => {
    // Enable the submit button only if all fields are filled
    const isFormValid = Object.values(formData).every(value => value !== '');
    setIsButtonDisabled(!isFormValid);
  }, [formData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value,
    }));
    setErrors(prev => ({ ...prev, [id]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors: typeof errors = {
      description: '',
      amount: '',
    };

    if (!formData.description) newErrors.description = 'Description is required';
    if (!formData.amount) newErrors.amount = 'Amount is required';

    if (Object.keys(newErrors).some(key => newErrors[key as keyof typeof newErrors])) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/services/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          serviceDate: date,
          nameOfTheService: service.toLowerCase(),
          userId,
          posUserId,
        }),
      });

      if (response.ok) {
        toast.success('Form submitted successfully!');
      } else {
        const errorData = await response.json();
        toast.error(`Error: ${errorData.error || 'Something went wrong'}`);
      }
    } catch (error) {
      toast.error('Network error. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-5">{service} Details</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <Textarea
            id="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder=" "
            className={`block px-2.5 pb-2.5 pt-4 w-full text-sm bg-transparent rounded-lg border appearance-none focus:outline-none focus:ring-0 peer ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          <Label
            htmlFor="description"
            className="absolute text-sm duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
          >
            Description
          </Label>
          {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description}</p>}
        </div>

        <div className="relative">
          <Input
            id="amount"
            type="number"
            value={formData.amount}
            onChange={handleInputChange}
            placeholder=" "
            className={`block w-full text-sm bg-transparent rounded-lg border appearance-none focus:outline-none focus:ring-0 peer ${
              errors.amount ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          <Label
            htmlFor="amount"
            className="absolute text-sm duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
          >
            Amount
          </Label>
          {errors.amount && <p className="mt-1 text-xs text-red-500">{errors.amount}</p>}
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isButtonDisabled || isSubmitting}
        >
          {isSubmitting ? (
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
              Submitting...
            </span>
          ) : (
            `Submit ${service}`
          )}
        </Button>
      </form>
    </div>
  );
};

export default DetailsModal;
