"use client"
import React from 'react';
import { useEffect, useState } from 'react';
import {FaSearch } from 'react-icons/fa';
import ServiceCard from '@/components/posusermodals/ServiceCard';
import { PiHandsPrayingBold } from 'react-icons/pi';

interface ServicesPageProps {
  params: {
    userId: string;
  };
}

interface Service {
  id: string;
  name: string;
  description: string;
  image: string;
  userId: string;
  isSeva: boolean;
  targetDate: string | null;
  targetPrice: number;
  minAmount: number;
  maxCount: number;
  isActive: boolean;
}

const ServicesPage: React.FC<ServicesPageProps> = ({ params }) => {
  const { userId } = params;
  const [services, setServices] = useState<Service[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('/api/services/addservices');
        const data = await response.json();
        
        setServices(data.services.filter((service: Service) => service.isActive&&service.isSeva===false&&service.name !== 'Contribution'));
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };

    fetchServices();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
  };

  return (
    <div className="px-2 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 min-w-screen w-full min-h-screen bg-[#fdf0f4]">
      <h1 className="text-lg sm:text-xl md:text-2xl flex gap-x-2 sm:gap-x-3 font-semibold mb-3 sm:mb-4 text-[#663399] justify-center items-center">
      <PiHandsPrayingBold className="lg:text-2xl" /> Special Event&apos;s
      </h1>
      
      <div className="relative mb-3 sm:mb-4 max-w-xl mx-auto">
        <input
          type="text"
          placeholder="Search sevas..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full px-3 sm:px-4 py-2 pl-8 sm:pl-9 rounded-lg text-sm sm:text-base 
                   border border-gray-200 focus:outline-none focus:border-[#663399]
                   shadow-sm"
        />
        <FaSearch className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 
                          text-gray-400 w-3 h-3 sm:w-4 sm:h-4" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 
                    gap-4 sm:gap-6 md:gap-8 
                    mx-auto max-w-7xl">
        {services
          .map((service) => (
            <div key={service.id} className="w-full">
              <ServiceCard
                userId={userId}
                id={service.id}
                title={service.name}
                imageSrc={service.image}
                description={service.description}
                minAmount={service.minAmount}
                maxCount={service.maxCount}
              />
            </div>
          ))}
      </div>
    </div>
  );
};

export default ServicesPage;