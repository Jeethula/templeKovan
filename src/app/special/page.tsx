import React from 'react';
import ServiceCard from '../../components/ServiceCard';
import { PiHandsPrayingBold } from 'react-icons/pi';
import prisma from '@/utils/prisma';

// interface Service {
//   id: string;
//   name: string;
//   description: string;
//   image: string;
//   targetDate: string | null;
//   targetPrice: number;
//   minAmount: number;
//   maxCount: number;
//   isActive: boolean;
//   isSeva: boolean;
// }

async function getServices() {
  try {
    const services = await prisma.serviceAdd.findMany({
      where: {
        isActive: true,
        name: {
          not: 'Contribution'
        }
      },
      select: {
        id: true,
        name: true,
        description: true,
        image: true,
        targetDate: true,
        targetPrice: true,
        minAmount: true,
        maxCount: true,
        isActive: true,
        isSeva: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    return services;
  } catch (error) {
    console.error('Error fetching services:', error);
    throw new Error('Failed to fetch services');
  }
}

async function ServicesPage() {
  const services = await getServices();
  const filteredServices = services.filter(service => !service.isSeva);

  return (
    <div className="px-4 lg:px-8 py-3 lg:py-6 min-w-screen min-h-screen mx-auto bg-[#fdf0f4]">
      <div className="lg:max-w-7xl mx-auto">
        <div className="bg-white rounded-lg h-fit w-full max-w-[380px] lg:max-w-full p-4 lg:p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4 mx-auto">
          <h1 className='flex gap-x-3 font-semibold text-lg lg:text-2xl text-[#663399] items-center'>
            <PiHandsPrayingBold className="lg:text-2xl" /> Special Event&apos;s
          </h1>
        </div>
      
      {filteredServices.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-[#663399]/20 w-full max-w-[380px] lg:max-w-[600px] mx-auto">
          <PiHandsPrayingBold className="h-12 w-12 lg:h-16 lg:w-16 text-[#663399]/50 mx-auto mb-4" />
          <h3 className="text-lg lg:text-2xl font-medium text-gray-600 mb-2">No Events Available</h3>
          <p className="text-sm lg:text-base text-gray-500 max-w-md mx-auto">
            There are currently no Special Event&apos;s available. Please contact the temple administration for more information.
          </p>
          <p className="text-sm lg:text-base text-[#663399] mt-4">
            Email: admin@temple.com
          </p>
        </div>
      ) : (
        <div className="w-full min-h-screen p-4 md:p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
            {filteredServices.map((service) => (
              <div key={service.id} className="w-full">
                <ServiceCard
                  id={service.id}
                  title={service.name}
                  imageSrc={service.image||''}
                  description={service.description||''}
                  minAmount={service.minAmount||0}
                  maxCount={service.maxCount||0}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
  );
}

export default ServicesPage;