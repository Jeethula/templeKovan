import Image from "next/image";
import { useState } from "react";
import DateCheckModal from "../components/modals/DateCheckModal";
import { useRouter } from 'next/navigation';

interface ServiceCardProps {
  id: string;
  title: string;
  imageSrc: string;
  description: string;
  minAmount?: number;
  maxCount?: number;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  id,
  title,
  imageSrc,
  description,
  minAmount,
  maxCount
}) => {
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDateCheckModalOpen, setIsDateCheckModalOpen] = useState(false);
  const router = useRouter();

  const handleBook = () => {
    if (maxCount) {
      setIsDateCheckModalOpen(true);

    } else {
      router.push(`/services/${id}`);
    }
  };

  return (
    <>
            <div
        className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-transform hover:scale-105 w-full max-w-[380px] mx-auto  "
        onClick={() => setIsModalOpen(true)}
      >
        <div className="relative h-48">
          <Image
            src={imageSrc}
            alt={title}
            layout="fill"
            objectFit="cover"
            className="gradient-mask-b-0"
          />
        </div>
        <h3 className="text-sm font-semibold py-2 px-3 text-center truncate">{title}</h3>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 animate-modal-slide-up">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 z-10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="relative h-64 w-full">
              <Image
                src={imageSrc}
                alt={title}
                layout="fill"
                objectFit="cover"
                className="rounded-t-xl"
              />
            </div>

            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">{title}</h2>
              <p className="text-gray-600 mb-6">{description}</p>

              {(minAmount || maxCount) && (
                <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                  {minAmount && (
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-700">Minimum Amount</span>
                      <span className="text-lg font-semibold text-green-600">₹{minAmount}</span>
                    </div>
                  )}
                  {maxCount && (
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-700">Maximum Participants</span>
                      <span className="text-lg font-semibold text-blue-600">{maxCount}</span>
                    </div>
                  )}
                </div>
              )}

              <button
                className="mt-6 w-full bg-violet-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                onClick={() => handleBook()}

              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      )}
      {isDateCheckModalOpen && (
        <DateCheckModal
          title={title}
          id={id}
          open={isDateCheckModalOpen}
          onClose={() => setIsDateCheckModalOpen(false)}
        />
      )}
    </>
  );
};

export default ServiceCard;
