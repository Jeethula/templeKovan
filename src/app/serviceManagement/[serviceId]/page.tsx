"use client"

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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

  if (loading) return <div className="flex justify-center items-center h-screen text-lg">Loading...</div>;

  return (
    <div className="container mx-auto p-6 bg-[#fdf0f4] ">
      {service ? (
        <Card className="shadow-lg rounded-xl border border-gray-200 bg-white overflow-hidden">
          <CardHeader className=" p-6">
            <div className="flex justify-start items-center gap-5">
                <Link
              className="hover:underline text-orange-600  flex items-center gap-1"
              href="/serviceManagement"
            >
              <FaArrowLeft className="size-4 " /> Back
              </Link>
              <CardTitle className="text-3xl font-bold text-red-500">{service.nameOfTheService}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="w-full md:w-1/3">
                {service.image ? (
                  <Image
                    src={service.image}
                    alt="Service Image"
                    width={300}
                    height={500}
                    className="rounded-lg shadow-lg object-cover"
                  />
                ) : (
                  <div className="rounded-lg shadow-lg bg-gray-200 w-full h-full flex items-center justify-center">
                    <p className="text-gray-500">No Image Available</p>
                  </div>
                )}
              </div>

              <div className="w-full md:w-2/3">
                <h2 className="text-2xl font-semibold mb-4">Service Details</h2>
                <div className="space-y-2">
                  <p><strong>Service Date:</strong> {new Date(service.serviceDate).toLocaleDateString()}</p>
                  <p><strong>Price:</strong> ₹{service.price.toLocaleString()}</p>
                  <p><strong>Transaction ID:</strong> {service.transactionId}</p>
                  <p><strong>Payment Mode:</strong> {service.paymentMode}</p>
                  <p><strong>Status:</strong> <span className={`px-2 py-1 rounded-full ${service.status === 'Accepted' ? 'bg-green-100 text-green-700' : service.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{service.status}</span></p>
                </div>

                {/* Personal Info */}
                <div className="mt-6 border-t border-gray-200 pt-4">
                  <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div><strong>Name:</strong> {service.personalInfo.firstName} {service.personalInfo.lastName}</div>
                    <div><strong>Phone:</strong> {service.personalInfo.phoneNumber}</div>
                    <div><strong>Address 1:</strong> {service.personalInfo.address1}</div>
                    <div><strong>Address 2:</strong> {service.personalInfo.address2}</div>
                    <div><strong>City:</strong> {service.personalInfo.city}</div>
                    <div><strong>State:</strong> {service.personalInfo.state}</div>
                    <div><strong>Country:</strong> {service.personalInfo.country}</div>
                    <div><strong>Pincode:</strong> {service.personalInfo.pincode}</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="p-6 bg-gray-50 flex justify-end space-x-4">
            <Button onClick={handleAccept} className="bg-green-500 hover:bg-green-600 text-white">Approve</Button>
            <Button onClick={handleReject} className="bg-red-500 hover:bg-red-600 text-white">Reject</Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="flex justify-center items-center h-screen text-lg">
          <p>Service not found</p>
        </div>
      )}
    </div>
  );
};

export default ServiceManagementPage;
