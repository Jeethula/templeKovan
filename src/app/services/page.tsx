import React from 'react';
import ServiceCard from '../../components/ServiceCard';
import { PiHandsPrayingBold } from 'react-icons/pi';
import prisma from '@/utils/prisma';
import { Suspense } from 'react';

async function getServices() {
  'use server'
  const services = await prisma.serviceAdd.findMany({
    where: {
      AND: [
        { isActive: true },
        { name: { not: 'Contribution' } },
        { isSeva: true },
      ],
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
      isSeva: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  
  return services;
}

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <div className="px-4 lg:px-8 py-3 lg:py-6 min-w-screen min-h-screen mx-auto bg-[#fdf0f4]">
      <div className="lg:max-w-7xl mx-auto">
        <div className="bg-white rounded-lg h-fit w-full max-w-[380px] lg:max-w-full p-4 lg:p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4 mx-auto">
          <h1 className='flex gap-x-3 font-semibold text-lg lg:text-2xl text-[#663399] items-center'>
            <PiHandsPrayingBold className="lg:text-2xl" /> Our Seva&apos;s
          </h1>
        </div>

        <Suspense fallback={<div>Loading...</div>}>
          {services.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl">
              <p>No sevas found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {services.map((service) => (
                <ServiceCard
                  key={service.id}
                  id={service.id}
                  title={service.name}
                  imageSrc={service.image||''}
                  description={service.description||''}
                  minAmount={service.minAmount||0}
                  maxCount={service.maxCount||0}
                />
              ))}
            </div>
          )}
        </Suspense>
      </div>
    </div>
  );
}

