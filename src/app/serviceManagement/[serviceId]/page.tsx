"use client"

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import toast from "react-hot-toast";
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';

interface PersonalInfo {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
}

interface ServiceDetails {
  id: string;
  nameOfTheService: string;
  price: number;
  serviceDate: string;
  image: string;
  transactionId: string;
  paymentMode: string;
  status: string;
  personalInfo: PersonalInfo;
}

const ServiceManagementPage = ({ params }: { params: { serviceId: string } }) => {
  const [service, setService] = useState<ServiceDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const sessionData = JSON.parse(sessionStorage.getItem("user") || "{}");
  const userId: string = sessionData.id;
  const router = useRouter();

  const { serviceId } = params;

  useEffect(() => {
    const sessionData = JSON.parse(sessionStorage.getItem('user') || '{}');
    console.log(sessionData);
    
    if (!sessionData.role.includes('approver') ) {
      router.push('/unAuthorized');
    }
    if (serviceId) {
      fetchServiceDetails(serviceId);
    }
  }, [serviceId]);

  const fetchServiceDetails = async (id: string) => {
    try {
      const response = await fetch(`/api/services/${id}`);
      const data = await response.json();
      setService(data.service);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching service details:", error);
      setLoading(false);
    }
  };

  const handleAccept = async () => {
    await updateServiceStatus("APPROVED");
  };

  const handleReject = async () => {
    await updateServiceStatus("REJECTED");
  };

  const updateServiceStatus = async (status: string) => {
    try {
      const response = await fetch('/api/services/approver', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status, approverId: userId, serviceId }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(`Service ${status.toLowerCase()} successfully!`);
        router.push('/serviceManagement');
      } else {
        toast.error(`Error: ${data.error || 'Failed to update service status'}`);
      }
    } catch (error) {
      toast.error(`Error updating status to ${status}: ${error}`);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-[#fdf0f4]">
      <div className="text-[#663399] text-lg">Loading...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fdf0f4] pb-6">
      {service ? (
        <div className="max-w-3xl mx-auto px-4">
          {/* Header */}
          <div className="py-4 flex items-center gap-3">
            <Link
              href="/serviceManagement"
              className="flex items-center gap-2 text-[#663399] hover:text-[#663399]/80 transition-colors"
            >
              <FaArrowLeft className="text-lg" />
              <span>Back</span>
            </Link>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Service Title */}
            <div className="p-6 bg-[#663399] text-white">
              <h1 className="text-2xl font-bold">{service.nameOfTheService}</h1>
              <div className="mt-2 inline-block px-3 py-1 rounded-full bg-white/20 text-sm">
                Status: {service.status}
              </div>
            </div>

            {/* Image Section */}
            <div className="p-4">
              {service.image ? (
                <div className="relative h-[600px] w-full rounded-xl overflow-hidden">
                  <Image
                    src={service.image}
                    alt="Service Image"
                    fill
                    style={{ objectFit: 'contain' }}
                    className="rounded-xl"
                  />
                </div>
              ) : (
                <div className="h-[600px] rounded-xl bg-gray-100 flex items-center justify-center">
                  <p className="text-gray-500">No Image Available</p>
                </div>
              )}
            </div>

            {/* Service Details */}
            <div className="p-6 space-y-6">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-[#663399]">Service Details</h2>
                <div className="grid gap-3 text-gray-700">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span>Service Date</span>
                    <span>{new Date(service.serviceDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span>Price</span>
                    <span>₹{service.price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span>Transaction ID</span>
                    <span>{service.transactionId}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span>Payment Mode</span>
                    <span>{service.paymentMode}</span>
                  </div>
                </div>
              </div>

              {/* Personal Information */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-[#663399]">Personal Information</h2>
                <div className="grid gap-3 text-gray-700">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span>Name</span>
                    <span>{service.personalInfo.firstName} {service.personalInfo.lastName}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span>Phone</span>
                    <span>{service.personalInfo.phoneNumber}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span>Address</span>
                    <span className="text-right">
                      {service.personalInfo.address1}<br />
                      {service.personalInfo.address2}<br />
                      {service.personalInfo.city}, {service.personalInfo.state}<br />
                      {service.personalInfo.country} - {service.personalInfo.pincode}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-6 bg-[#fdf0f4] flex gap-4">
              <Button
                onClick={handleAccept}
                className="flex-1 h-12 bg-[#663399] hover:bg-[#663399]/90 text-white rounded-xl"
              >
                Approve
              </Button>
              <Button
                onClick={handleReject}
                className="flex-1 h-12 bg-red-500 hover:bg-red-600 text-white rounded-xl"
              >
                Reject
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-screen text-[#663399]">
          <p>Service not found</p>
        </div>
      )}
    </div>
  );
};

export default ServiceManagementPage;
