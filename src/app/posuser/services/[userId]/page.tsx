"use client"
import React from 'react';
import ServiceCard from '../../../../components/ServiceCard';
import DonationModal from '../../../../components/posusermodals/DonationModal';
import ThirumanjanamModal from '../../../../components/posusermodals/ThirumanjanamModal';
import AbisekamModal from '../../../../components/posusermodals/AbisekamModal';

interface ServicesPageProps {
  params: {
    userId: string;
  };
}

const ServicesPage: React.FC<ServicesPageProps> = ({ params }) => {
  
  const { userId } = params;
  console.log(userId);
  return (
    <div className="container mx-auto px-4 py-8 bg-[#fdf0f4]">
      <h1 className="text-3xl font-bold mb-8 text-center">Our Services</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <ServiceCard
          title="Donation"
          imageSrc="/images/donation.jpg"
          description="Support our temple with your generous donations."
          modalComponent={<DonationModal userId={userId} />}
        />
        <ServiceCard
          title="Thirumanjanam"
          imageSrc="/images/thirumanjanam.jpg"
          description="Participate in the sacred bathing ritual of the deity."
          modalComponent={<ThirumanjanamModal userId={userId}  />}
        />
        <ServiceCard
          title="Abisekam"
          imageSrc="/images/abisekam.jpg"
          description="Take part in the divine anointment ceremony."
          modalComponent={<AbisekamModal userId={userId}  />}
        />
      </div>
    </div>
  );
};

export default ServicesPage;