"use client"
import React from 'react';
import { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import ServiceCard from '@/components/posusermodals/ServiceCard';
import { PiHandsPrayingBold } from 'react-icons/pi';
import { useRouter } from 'next/navigation';

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

const SkeletonCard = () => (
  <div className="bg-white rounded-xl shadow-md p-4 animate-pulse h-full">
    <div className="w-full h-48 lg:h-64 bg-gray-200 rounded-lg mb-4"></div>
    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
    <div className="space-y-2">
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
    </div>
  </div>
);


const ServicesPage: React.FC<ServicesPageProps> = ({ params }) => {
  const { userId } = params;
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const sessionData = JSON.parse(sessionStorage.getItem('user') || '{}');
    if (!sessionData.role?.includes('Admin')) {
      router.push('/unAuthorized');
    }
    const fetchServices = async () => {
      try {
        const response = await fetch('/api/services/addservices');
        const data = await response.json();
        
        setServices(data.services.filter((service: Service) => service.isActive&&service.isSeva===true&&service.name !== 'Contribution'));
        setFilteredServices(data.services.filter((service: Service) => service.isActive&&service.isSeva===true&&service.name !== 'Contribution'));
      } catch (error) {
        console.error('Error fetching services:', error);
      }
      finally{
        setIsLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    if (term.trim() === '') {
      setFilteredServices(services);
    } else {
      const filtered = services.filter(service => 
        service.name.toLowerCase().includes(term)
      );
      setFilteredServices(filtered);
    }
  };

  return (
    <div className="px-4 lg:px-8 py-3 lg:py-6 min-w-screen min-h-screen mx-auto bg-[#fdf0f4]">
      <div className="lg:max-w-7xl mx-auto">
        {/* Header and Search Section */}
        <div className="bg-white rounded-lg h-fit w-full max-w-[380px] lg:max-w-full p-4 lg:p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4 mx-auto">
          <h1 className='flex gap-x-3 font-semibold text-lg lg:text-2xl text-[#663399] items-center'>
            <PiHandsPrayingBold className="lg:text-2xl" /> Our Seva&apos;s
          </h1>
          <div className="relative mt-2 lg:mt-0 lg:w-1/3">
            <input
              type="text"
              placeholder="Search sevas..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full px-4 py-2 pl-9 rounded-lg text-sm lg:text-base border border-gray-200 focus:outline-none focus:border-[#663399]"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>
        </div>

        {/* Content Section */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
            {[...Array(8)].map((_, index) => <SkeletonCard key={index} />)}
          </div>
        ) : filteredServices.filter(service => service.isSeva).length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-[#663399]/20 w-full max-w-[380px] lg:max-w-[600px] mx-auto">
            <PiHandsPrayingBold className="h-12 w-12 lg:h-16 lg:w-16 text-[#663399]/50 mx-auto mb-4" />
            <h3 className="text-lg lg:text-2xl font-medium text-gray-600 mb-2">No Sevas Available</h3>
            <p className="text-sm lg:text-base text-gray-500 max-w-md mx-auto">
              There are currently no sevas available. Please contact the temple administration for more information.
            </p>
            <p className="text-sm lg:text-base text-[#663399] mt-4">
              Email: admin@temple.com
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
            {filteredServices.filter((service) => service.isSeva).map((service) => (
              <ServiceCard
                key={service.id}
                userId={userId}
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
    </div>
  );
};

export default ServicesPage;