import React from 'react';
import DetailsModal from './DetailsModal';

const DonationModal = ({userId}:{userId:string}) => {
  const service="Donation";
  const date = new Date();
  return (
    <div> 
      <DetailsModal service={service} date={date} userId={userId} />
    </div>
  );
};

export default DonationModal


