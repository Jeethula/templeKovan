"use client"
import React from 'react';
import ServiceCard from '../../components/ServiceCard';
import ThirumanjanamModal from '../../components/modals/ThirumanjanamModal';
import AbisekamModal from '../../components/modals/AbisekamModal';

const ServicesPage: React.FC = () => {
  const handleSubmitSuccess = async () => {
    // Keep this for service submissions
  };

  return (
    <div className="px-4 py-8 min-w-screen w-full min-h-screen bg-[#fdf0f4]">
      <h1 className="text-3xl font-bold mb-8 text-center">Our Services</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* <ServiceCard
          title="Donation"
          imageSrc={`https://www.mygoldguide.in/sites/default/files/styles/single_image_story_header_image/public/The%20Sacred%20Daan%20%28donation%29%20of%20Gold.jpg?itok=6Nc--uvy`}
          description="Support our temple with your generous donations."
          modalComponent={<DonationModal onSubmitSuccess={handleSubmitSuccess} />}
        /> */}
        <ServiceCard
          title="Thirumanjanam"
          imageSrc="https://i.ytimg.com/vi/OzEJnTs_bqU/maxresdefault.jpg"
          description="Participate in the sacred bathing ritual of the deity."
          modalComponent={<ThirumanjanamModal onSubmitSuccess={handleSubmitSuccess} />}
        />
        <ServiceCard
          title="Abisekam"
          imageSrc="https://chinnajeeyar.org/wp-content/uploads/2016/11/15032201_10154073675297205_4908543132323661187_n.jpg"
          description="Take part in the divine anointment ceremony."
          modalComponent={<AbisekamModal onSubmitSuccess={handleSubmitSuccess} />}
        />
      </div>
    </div>
  );
};

export default ServicesPage;