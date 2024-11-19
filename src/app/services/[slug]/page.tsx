"use client";
import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import DetailsModal from '@/components/modals/DetailsModal';
import { FaDownload, FaCheck } from 'react-icons/fa';
import { IoCopyOutline } from "react-icons/io5";

type PaymentMethod = 'NEFT' | 'UPI' | 'QR';

type Service = {
  id: string,
  name: string,
  description: string,
  image: string,
  targetDate: string | null,
  targetPrice: number,
  minAmount: number,
  maxCount: number,
  isActive: boolean
}

const ServicePage = () => {
  const { slug } = useParams();
  const searchParams = useSearchParams();
  const serviceDate = searchParams.get('date');
  const [service, setService] = useState<Service | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [qrDownloaded, setQrDownloaded] = useState(false);
  const router = useRouter();

  const bankDetails = {
    accountName: "Sri Renuka Akkama Temple",
    accountNumber: "1234567890",
    ifscCode: "SBIN0123456"
  };

  const upiDetails = {
    upiId: "temple@upi"
  };

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (copiedField) {
      timeout = setTimeout(() => {
        setCopiedField(null);
      }, 2000);
    }
    return () => clearTimeout(timeout);
  }, [copiedField]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (qrDownloaded) {
      timeout = setTimeout(() => {
        setQrDownloaded(false);
      }, 2000);
    }
    return () => clearTimeout(timeout);
  }, [qrDownloaded]);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await fetch(`/api/services/getservice?serviceId=${slug}`);
        const data = await response.json();
        setService(data.service);
      } catch (error) {
        console.error('Failed to fetch service:', error);
      }
    };
    fetchService();
  }, [slug]);

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownloadQR = () => {
    const link = document.createElement('a');
    link.href = '/qr-code.png'; // Add your QR code image path here
    link.download = 'temple-donation-qr.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setQrDownloaded(true);
  };

  return (
    <div className="min-h-screen bg-[#fdf0f4] p-4 sm:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-md border border-[#663399]/20 p-6 mb-6">
          {service ? (
            <>
              <div className="space-y-4">
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-fit rounded-lg object-cover"
                  />
                  <div>
                    <h1 className="text-3xl font-bold text-[#663399]">{service.name}</h1>
                    <p className="text-gray-600 mt-1">{service.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                {service.targetPrice && (
                  <div className="bg-[#fdf0f4] p-4 rounded-lg">
                    <span className="text-sm text-gray-600">Target Amount</span>
                    <p className="text-xl font-semibold text-[#663399]">₹{service.targetPrice}</p>
                    </div>
                  )}
                  {service.minAmount && 
                  <div className="bg-[#fdf0f4] p-4 rounded-lg">
                    <span className="text-sm text-gray-600">Minimum Contribution</span>
                    <p className="text-xl font-semibold text-[#663399]">₹{service.minAmount}</p>
                  </div>}
                  {service.targetDate && (
                    <div className="bg-[#fdf0f4] p-4 rounded-lg">
                      <span className="text-sm text-gray-600">Target Date</span>
                      <p className="text-xl font-semibold text-[#663399]">{new Date(service.targetDate).toLocaleDateString('en-GB')}</p>
                    </div>
                  )}
                  {service.maxCount &&(
                  <div className="bg-[#fdf0f4] p-4 rounded-lg">
                    <span className="text-sm text-gray-600">Maximum Participants</span>
                    <p className="text-xl font-semibold text-[#663399]">{service.maxCount}</p>
                  </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex justify-center items-center h-48">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#663399]"></div>
            </div>
          )}
          <h2 className="text-xl font-semibold text-[#663399] mb-2 mt-4">How to Donate</h2>
          <div className="space-y-2">
            {[
              'Select the preferred payment method below.',
              'Pay the amount to the given details.',
              'After successful payment, click Proceed to Next.',
              'Take a screenshot and note the transaction ID.',
              'Once you submit the details, the admin will verify it.'
            ].map((step, index) => (
              <div key={index} className="flex items-start space-x-2">
              <span className="font-medium text-[#663399] min-w-[24px]">{index + 1}.</span>
              <p className="text-gray-700">{step}</p>
              </div>
            ))}
            </div>
        </div>

        {/* Payment Options */}
        <div className="bg-white rounded-2xl shadow-md border border-[#663399]/20 p-6">
          <div className="space-y-4">
            <h1 className='text-2xl font-bold text-[#663399] mb-4'>Choose Payment Method</h1>
            <div className="flex flex-row space-x-3">
              {['NEFT', 'UPI', 'QR'].map((method) => (
                <label key={method} className="flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all duration-200">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method}
                    checked={selectedMethod === method}
                    onChange={() => setSelectedMethod(method as PaymentMethod)}
                    className="text-[#663399] focus:ring-[#663399]"
                  />
                  <span className="font-medium text-gray-700">{method}</span>
                </label>
              ))}
            </div>

            {/* Payment Details */}
            {selectedMethod && (
              <div className="mt-6 p-4 bg-[#fdf0f4] rounded-xl">
                {selectedMethod === 'NEFT' && (
                  <div className="space-y-3">
                    {Object.entries(bankDetails).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center">
                        <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{value}</span>
                          <button
                            onClick={() => copyToClipboard(value, key)}
                            className="p-2 text-[#663399] hover:bg-[#663399]/10 rounded-full"
                          >
                            {copiedField === key ? <FaCheck /> : <IoCopyOutline />}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {selectedMethod === 'UPI' && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">UPI ID:</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{upiDetails.upiId}</span>
                      <button
                        onClick={() => copyToClipboard(upiDetails.upiId, 'upiId')}
                        className="p-2 text-[#663399] hover:bg-[#663399]/10 rounded-full"
                      >
                        {copiedField === 'upiId' ? <FaCheck /> : <IoCopyOutline />}
                      </button>
                    </div>
                  </div>
                )}

                {selectedMethod === 'QR' && (
                  <div className="flex flex-col items-center space-y-4">
                    <img
                      src="/qr-code.png"
                      alt="Donation QR Code"
                      className="w-48 h-48 object-contain"
                    />
                    <button
                      onClick={handleDownloadQR}
                      className="flex items-center space-x-2 text-[#663399] hover:bg-[#663399]/10 px-4 py-2 rounded-lg"
                    >
                      {qrDownloaded ? <FaCheck /> : <FaDownload />}
                      <span>Save QR Code</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            <div className="w-full flex justify-end">
              <button
                onClick={() => setShowModal(true)}
                className="mt-4 h-12 w-24 bg-[#663399] hover:bg-[#663399]/90 text-white font-medium px-2 py-2
                           rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                disabled={!selectedMethod}
              >
                Proceed
              </button>
            </div>

            {showModal && (
              <DetailsModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                nameOfTheServiceId={slug as string}
                serviceName={service?.name||''}
                minAmount={service?.minAmount||0}
                date={serviceDate ? new Date(serviceDate) : null}
                onSubmitSuccess={() => {
                  setShowModal(false);
                  router.push('/transactions');
                }}
                selectedMethod={selectedMethod || 'NEFT'}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicePage;