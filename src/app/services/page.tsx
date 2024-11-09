"use client"
import React, { useEffect, useState } from 'react';
import ServiceCard from '../../components/ServiceCard';

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

const ServicesPage: React.FC = () => {
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
      <h1 className="text-3xl font-bold mb-8 text-center">Our Services</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {services
          .filter(service => service.isActive&&service.name!='Contribution')
          .map((service) => (
            <ServiceCard
              key={service.id}
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