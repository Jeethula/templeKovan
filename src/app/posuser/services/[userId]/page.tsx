"use client"
import React from 'react';
import { useEffect, useState } from 'react';
import { FaPrayingHands } from 'react-icons/fa';
import ServiceCard from '@/components/posusermodals/ServiceCard';

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
  targetDate: string | null;
  targetPrice: number;
  minAmount: number;
  maxCount: number;
  isActive: boolean;
}

const ServicesPage: React.FC<ServicesPageProps> = ({ params }) => {
  const { userId } = params;
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('/api/services/addservices');
        const data = await response.json();
        console.log(data);
        
        setServices(data.services.filter((service: Service) => service.isActive));
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };

    fetchServices();
  }, []);


  return (
    <div className="px-4 py-8 min-w-screen w-full min-h-screen bg-[#fdf0f4]">
      <h1 className="text-xl flex gap-x-3 font-semibold mb-4 text-[#663399] justify-center items-center"><FaPrayingHands /> Our Seva&apos;s</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services
          .filter(service => service.isActive&&service.name!='Contribution')
          .map((service) => (
            <ServiceCard
              key={service.id}
              userId={userId}
              id={service.id}
              title={service.name}
              imageSrc={service.image}
              description={service.description}
              minAmount={service.minAmount}
              maxCount={service.maxCount}/>
          ))}
      </div>
    </div>
  );
};

export default ServicesPage;