import React, { useState } from 'react';
import Image from 'next/image';

interface ServiceCardProps {
  title: string;
  imageSrc: string;
  description: string;
  modalComponent: React.ReactNode;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ title, imageSrc, description, modalComponent }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div
        className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-transform hover:scale-105"
        onClick={() => setIsModalOpen(true)}
      >
        <h3 className="text-xl font-semibold p-4 text-center">{title}</h3>
        <div className="relative h-48">
          <Image
            src={imageSrc}
            alt={title}
            layout="fill"
            objectFit="cover"
            className="gradient-mask-b-0"
          />
        </div>
        <p className="p-4 text-center">{description}</p>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg max-w-md w-full">
            <button
              className="float-right text-gray-600 hover:text-gray-800"
              onClick={() => setIsModalOpen(false)}
            >
              &times;
            </button>
            {modalComponent}
          </div>
        </div>
      )}
    </>
  );
};

export default ServiceCard;
