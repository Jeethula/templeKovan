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
      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-3 sm:mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="flex items-center gap-2 text-lg font-semibold text-[#663399]">
            <PiHandsPrayingBold className="text-xl" />
            <span>Special Event&apos;s</span>
          </h1>
          
          <div className="w-full sm:w-96">
            <div className="relative">
              <input
                type="text"
                placeholder="Search Events..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full px-4 py-2 pl-10 rounded-lg text-sm border border-gray-200 
                  focus:outline-none focus:border-[#663399] focus:ring-1 focus:ring-[#663399]"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 
                text-gray-400 w-4 h-4" />
            </div>
            {searchTerm && (
              <div className="mt-2 text-sm text-gray-500">
                Found {services.filter(service => 
                  service.name.toLowerCase().includes(searchTerm.toLowerCase())
                ).length} results
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 
                    gap-4 sm:gap-6 md:gap-8 
                    mx-auto max-w-7xl">
        {services
          .filter(service => 
            service.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
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