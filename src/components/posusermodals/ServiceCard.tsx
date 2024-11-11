import Image from "next/image";
import { useState } from "react";
import DateCheckModal from "./DateCheckModal";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import DetailsModal from "./DetailsModal";

interface ServiceCardProps {
  id: string;
  title: string;
  imageSrc: string;
  userId: string;
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
  userId,
  maxCount
}) => {
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [isDateCheckModalOpen, setIsDateCheckModalOpen] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const handleBook = () => {
    setIsServiceModalOpen(false); // Close the service modal first
    if (maxCount) {
      setIsDateCheckModalOpen(true); // Open date check modal for services with maxCount
    } else {
      setShowDetailsModal(true); // Directly open details modal for services without maxCount
    }
  };

  return (
    <>
      <div
        className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-transform hover:scale-105 w-full"
        onClick={() => setIsServiceModalOpen(true)}
      >
        <div className="relative h-32">
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
        <DialogContent className="sm:max-w-[425px]">
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
                className="mt-6 w-full bg-[rgb(102,51,153)] text-white py-3 px-6 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                onClick={handleBook}
              >
                Book Now
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Date Check Modal */}
      <DateCheckModal
        title={title}
        id={id}
        userId={userId}
        minAmount={minAmount||0}
        open={isDateCheckModalOpen}
        onClose={() => setIsDateCheckModalOpen(false)}
      />

      {/* Direct Details Modal for services without maxCount */}
      <Dialog 
        open={showDetailsModal} 
        onOpenChange={(open) => !open && setShowDetailsModal(false)}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DetailsModal
            serviceName={title}
            date={new Date()} 
            userId={userId}
            minAmount={minAmount||0}
            nameOfTheServiceId={id}
            onSubmitSuccess={() => setShowDetailsModal(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ServiceCard;