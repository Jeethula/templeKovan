import React from 'react';
import DetailsModal from './DetailsModal';

const DonationModal = () => {
  const service="Donation";
  const date = new Date();
  return (
    <div> 
      <DetailsModal service={service} date={date} />
    </div>
  );
};

export default DonationModal


