import React from 'react';
import DetailsModal from './DetailsModal';

const DonationModal = ({ onSubmitSuccess }: { onSubmitSuccess: () => void }) => {
  const service="Donation";
  const date = new Date();
  return (
    <div> 
      <DetailsModal service={service} date={date} onSubmitSuccess={onSubmitSuccess} />
    </div>
  );
};

export default DonationModal


