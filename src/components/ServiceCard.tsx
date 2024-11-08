
import Image from "next/image";
interface ServiceCardProps {
  title: string;
  imageSrc: string;
  description: string;
  minAmount?: number;
  maxCount?: number;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  title,
  imageSrc,
  description,
  minAmount,
  maxCount
}) => {

  const handleOnClick = () => {
    
  }

  return (
    <>
      <div
        className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-transform hover:scale-105"
        onClick={()=>handleOnClick()}
      >
        <h3 className="text-xl font-semibold p-4 text-center">{title}</h3>
        <div className="relative h-48">
          <Image
            src={imageSrc}
            alt={title}
            layout="fill"
            objectFit="cover"
            className="gradient-mask-b-0"
          />
        </div>
        <p className="p-4 text-center">{description}</p>
        {(minAmount || maxCount) && (
          <div className="space-y-2 mb-4">
            {minAmount && (
              <div className="flex items-center text-sm text-gray-700">
                <span className="font-medium">Minimum Amount:</span>
                <span className="ml-2">₹{minAmount}</span>
              </div>
            )}
            {maxCount && (
              <div className="flex items-center text-sm text-gray-700">
                <span className="font-medium">Maximum Participants:</span>
                <span className="ml-2">{maxCount}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default ServiceCard;
