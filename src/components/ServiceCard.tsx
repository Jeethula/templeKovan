import Image from "next/image";
import { useState } from "react";
import DateCheckModal from "../components/modals/DateCheckModal";
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent } from "@/components/ui/dialog";

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
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [isDateCheckModalOpen, setIsDateCheckModalOpen] = useState(false);
  const router = useRouter();

  const handleBook = () => {
    setIsServiceModalOpen(false); // Close the service modal first
    if (maxCount) {
      setIsDateCheckModalOpen(true);
    } else {
      router.push(`/services/${id}`);
    }
  };

  return (
    <>
      <div
        className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-transform hover:scale-105 w-full max-w-[380px] mx-auto"
        onClick={() => setIsServiceModalOpen(true)}
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

      {/* Service Details Modal */}
      <Dialog open={isServiceModalOpen} onOpenChange={setIsServiceModalOpen}>
        <DialogContent className="sm:max-w-[425px] md:max-w-[525px] lg:max-w-[625px]">
          <div className="relative">
            <div className="relative h-64 w-full">
              <Image
                src={imageSrc}
                alt={title}
                layout="fill"
                objectFit="cover"
                className="rounded-t-xl"
              />
            </div>

            <div className="mt-4">
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
                className="mt-6 w-full bg-[#663399] text-white py-3 px-6 rounded-lg font-medium hover:bg-[#6a32a5] transition-colors"
                onClick={handleBook}
              >
                Book Now
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

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
