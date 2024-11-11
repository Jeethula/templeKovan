"use client"
import React, { useEffect, useState } from 'react';
import ServiceCard from '../../components/ServiceCard';
import {  FaSearch } from 'react-icons/fa';
import { PiHandsPrayingBold } from 'react-icons/pi';
import withProfileCheck from '@/components/withProfileCheck';

interface Service {
  id: string;
  name: string;
  description: string;
  image: string;
  targetDate: string | null;
  targetPrice: number;
  minAmount: number;
  maxCount: number;
  isActive: boolean;
  isSeva: boolean;
}

const SkeletonCard = () => (
  <div className="bg-white rounded-xl shadow-md p-4 animate-pulse">
    <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
    <div className="space-y-2">
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
    </div>
  </div>
);

const ServicesPage: React.FC = () => {
  const [allServices, setAllServices] = useState<Service[]>([]); // Original services
  const [filteredServices, setFilteredServices] = useState<Service[]>([]); // Filtered services
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('/api/services/addservices');
        const data = await response.json();
        const activeServices = data.services.filter((service: Service) => 
          service.isActive && service.name !== 'Contribution'
        );
        setAllServices(activeServices);
        setFilteredServices(activeServices);
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    if (term.trim() === '') {
      setFilteredServices(allServices);
    } else {
      const filtered = allServices.filter(service => 
        service.name.toLowerCase().includes(term)
      );
      setFilteredServices(filtered);
    }
  };

  return (
    <div className="px-4 py-3 min-w-screen min-h-screen mx-auto bg-[#fdf0f4]">
      <div className="bg-white rounded-lg h-fit w-full max-w-[380px] p-4 flex flex-col gap-y-2 mb-4  mx-auto">
        <h1 className='flex gap-x-3 font-semibold text-lg text-[#663399] items-center'>
        <PiHandsPrayingBold />  Special Event&apos;s  
        </h1> 
        <div className="relative">
          <input
            type="text"
            placeholder="Search sevas..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full px-4 py-2 pl-9 rounded-lg text-sm border border-gray-200 focus:outline-none focus:border-[#663399]"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        </div>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, index) => <SkeletonCard key={index} />)}
        </div>
      ) : filteredServices.filter(service => !service.isSeva).length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-[#663399]/20 w-full max-w-[380px] mx-auto">
          <PiHandsPrayingBold className="h-12 w-12 text-[#663399]/50 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">No Events Available</h3>
          <p className="text-sm text-gray-500">
            There are currently no Special Event&apos;s available. Please contact the temple administration for more information.
          </p>
          <p className="text-sm text-[#663399] mt-4">
            Email: admin@temple.com
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.filter((service) => !service.isSeva).map((service) => (
            <ServiceCard
              key={service.id}
              id={service.id}
              title={service.name}
              imageSrc={service.image}
              description={service.description}
              minAmount={service.minAmount}
              maxCount={service.maxCount}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default withProfileCheck(ServicesPage);