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
    <div className="min-w-screen w-full min-h-screen px-4 py-8 bg-[#fdf0f4] h-screen">
      <h1 className="text-3xl font-bold mb-8 text-center">Our Services</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <ServiceCard
          title="Donation"
          imageSrc="https://www.mygoldguide.in/sites/default/files/styles/single_image_story_header_image/public/The%20Sacred%20Daan%20%28donation%29%20of%20Gold.jpg?itok=6Nc--uvy"
          description="Support our temple with your generous donations."
          modalComponent={<DonationModal userId={userId} />}
        />
        <ServiceCard
          title="Thirumanjanam"
          imageSrc="https://i.ytimg.com/vi/OzEJnTs_bqU/maxresdefault.jpg"
          description="Participate in the sacred bathing ritual of the deity."
          modalComponent={<ThirumanjanamModal userId={userId}  />}
        />
        <ServiceCard
          title="Abisekam"
          imageSrc="https://chinnajeeyar.org/wp-content/uploads/2016/11/15032201_10154073675297205_4908543132323661187_n.jpg"
          description="Take part in the divine anointment ceremony."
          modalComponent={<AbisekamModal userId={userId}  />}
        />
      </div>
    </div>
  );
};

export default ServicesPage;