"use client"
import React, { useEffect, useState } from 'react';
import ServiceCard from '../../components/ServiceCard';
import { FaPersonPraying } from 'react-icons/fa6';
import { FaPrayingHands } from 'react-icons/fa';

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
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('/api/services/addservices');
        const data = await response.json();
        setServices(data.services.filter((service: Service) => service.isActive));
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <div className="px-4 py-8 min-w-screen w-full min-h-screen bg-[#fdf0f4]">
      <h1 className="text-xl flex gap-x-3 font-semibold mb-4 text-[#663399] justify-center items-center">
        <FaPrayingHands /> Our Seva&apos;s
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {isLoading ? (
          // Show 6 skeleton cards while loading
          [...Array(6)].map((_, index) => <SkeletonCard key={index} />)
        ) : (
          services
            .filter(service => service.isActive && service.name !== 'Contribution')
            .map((service) => (
              <ServiceCard
                key={service.id}
                id={service.id}
                title={service.name}
                imageSrc={service.image}
                description={service.description}
                minAmount={service.minAmount}
                maxCount={service.maxCount}
              />
            ))
        )}
      </div>
    </div>
  );
};

export default ServicesPage;