"use client"
import React from 'react';
import ServiceCard from '../../components/ServiceCard';
import DonationModal from '../../components/modals/DonationModal';
import ThirumanjanamModal from '../../components/modals/ThirumanjanamModal';
import AbisekamModal from '../../components/modals/AbisekamModal';

const ServicesPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Our Services</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <ServiceCard
          title="Donation"
          imageSrc="/images/donation.jpg"
          description="Support our temple with your generous donations."
          modalComponent={<DonationModal />}
        />
        <ServiceCard
          title="Thirumanjanam"
          imageSrc="/images/thirumanjanam.jpg"
          description="Participate in the sacred bathing ritual of the deity."
          modalComponent={<ThirumanjanamModal />}
        />
        <ServiceCard
          title="Abisekam"
          imageSrc="/images/abisekam.jpg"
          description="Take part in the divine anointment ceremony."
          modalComponent={<AbisekamModal />}
        />
      </div>
    </div>
  );
};

export default ServicesPage;

