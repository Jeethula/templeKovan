import React, { useState } from 'react';
import DateCheckModal from './DateCheckModal';
import DetailsModal from './DetailsModal';

const ThirumanjanamModal = ({ onSubmitSuccess }: { onSubmitSuccess: () => void }) => {
  const [step, setStep] = useState(1); 
  const service="Thirumanjanam";
  const nextStep = () => setStep(2);
  const [date, setDate] = useState<Date>(new Date());
  
  return (
    <div>
      {step === 1 && <DateCheckModal onNext={nextStep} service={service} setDate={setDate} />}
      {step === 2 && <DetailsModal service={service} date={date} onSubmitSuccess={onSubmitSuccess} />}
    </div>
  );
};

export default ThirumanjanamModal;