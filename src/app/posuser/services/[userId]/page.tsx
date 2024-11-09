"use client"
import React from 'react';

interface ServicesPageProps {
  params: {
    userId: string;
  };
}

const ServicesPage: React.FC<ServicesPageProps> = ({ params }) => {
  const { userId } = params;
  return (
    <div className="min-w-screen w-full min-h-screen px-4 py-8 bg-[#fdf0f4] h-screen">
      <h1 className="text-3xl font-bold mb-8 text-center">Our Services</h1>
      
    </div>
  );
};

export default ServicesPage;