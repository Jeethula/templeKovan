"use client"

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import toast from "react-hot-toast";
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { Download } from 'lucide-react';


interface ServiceDetails {
  description: string
  id: string;
  nameOfTheService: {
    name: string;
  };
  price: number;
  serviceDate: string;
  image: string;
  transactionId: string;
  paymentMode: string;
  status: string;
  User: {
    phone: string;
    email: string;
    personalInfo: {
      firstName: string;
      lastName: string;
      address1: string;
      address2: string;
      city: string;
      state: string;
      country: string;
      pincode: string;
    };
  };
  approvedBy?: {
    phone: string;
    email: string;
    personalInfo: {
      firstName: string;
      lastName: string;
    };
  };
  posUser?:{
    phone: string;
    email: string;
    personalInfo: {
      firstName: string;
      lastName: string;
    };
  }
}

const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#FFF9F0',
  },
  headerSection: {
    marginBottom: 30,
    alignItems: 'center',
  },
  mainTitle: {
    fontSize: 28,
    color: '#8B0000',
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 12,
    color: '#8B4513',
    fontFamily: 'Helvetica',
    textAlign: 'center',
    marginBottom: 20,
  },
  decorativeLine: {
    width: '100%',
    height: 2,
    backgroundColor: '#8B4513',
    marginBottom: 20,
    opacity: 0.3,
  },
  contentContainer: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 25,
    border: '1px solid #D4AF37',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottom: '1px solid #F0E6D6',
  },
  label: {
    width: '40%',
    fontSize: 11,
    color: '#8B4513',
    fontFamily: 'Helvetica-Bold',
  },
  value: {
    width: '60%',
    fontSize: 11,
    color: '#333',
    fontFamily: 'Helvetica',
  },
  footer: {
    marginTop: 30,
    padding: 20,
    borderTop: '2px solid #D4AF37',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 10,
    color: '#8B4513',
    textAlign: 'center',
    fontFamily: 'Helvetica',
    marginBottom: 5,
  },
  blessingText: {
    fontSize: 14,
    color: '#8B0000',
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
    marginTop: 15,
  },
  receiptTitle: {
    fontSize: 16,
    color: '#8B0000',
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  ornament: {
    fontSize: 24,
    color: '#D4AF37',
    textAlign: 'center',
    marginBottom: 10,
  },
});

const MyDocument: React.FC<{ 
  rowData: ServiceDetails; 
  userData: { 
    id: string; 
    email: string; 
    phone: string 
  }; 
  approvedByData:{
    firstName: string;
    lastName: string;
    phoneNumber: string;
  }
}> = ({ rowData, userData, approvedByData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.headerSection}>
        <Text style={styles.mainTitle}>Sri Renuka Akkamma Temple</Text>
        <Text style={styles.subtitle}></Text>
        <View style={styles.decorativeLine} />
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.ornament}>☸</Text>
        <Text style={styles.receiptTitle}>Seva Receipt</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Devotee ID</Text>
          <Text style={styles.value}>{userData.id}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Contact Details</Text>
          <Text style={styles.value}>{userData.phone} | {userData.email}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Seva Name</Text>
          <Text style={styles.value}>{rowData.nameOfTheService.name}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Description</Text>
          <Text style={styles.value}>{rowData.description}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Seva Date</Text>
          <Text style={styles.value}>{new Date(rowData.serviceDate).toLocaleDateString('en-GB')}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Offering Amount</Text>
          <Text style={styles.value}>₹{rowData.price}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Payment Details</Text>
          <Text style={styles.value}>
            {rowData.paymentMode} | Trans. ID: {rowData.transactionId}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Approved By</Text>
          <Text style={styles.value}>{approvedByData?.firstName} {approvedByData?.lastName}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Approver Contact</Text>
          <Text style={styles.value}>{approvedByData?.phoneNumber}</Text>
        </View>

        <View style={[styles.row, { borderBottom: 'none' }]}>
          <Text style={styles.label}>Status</Text>
          <Text style={styles.value}>{rowData.status}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          This is a computer generated receipt. No signature required.
        </Text>
        <Text style={styles.footerText}>
          For any queries, please contact the temple office.
        </Text>
        {/* <Text style={styles.blessingText}>
          
        </Text> */}
      </View>
    </Page>
  </Document>
);

const MyDocumentForPos: React.FC<{ 
  rowData: ServiceDetails; 
  userData: { 
    id: string; 
    email: string; 
    phone: string 
  }; 
  posUserData:{
    firstName: string;
    lastName: string;
    phoneNumber: string;
  }
}> = ({ rowData, userData, posUserData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.headerSection}>
        <Text style={styles.mainTitle}>Sri Renuka Akkamma Temple</Text>
        <Text style={styles.subtitle}></Text>
        <View style={styles.decorativeLine} />
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.ornament}>☸</Text>
        <Text style={styles.receiptTitle}>Seva Receipt</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Devotee ID</Text>
          <Text style={styles.value}>{userData.id}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Contact Details</Text>
          <Text style={styles.value}>{userData.phone} | {userData.email}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Seva Name</Text>
          <Text style={styles.value}>{rowData.nameOfTheService.name}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Description</Text>
          <Text style={styles.value}>{rowData.description}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Seva Date</Text>
          <Text style={styles.value}>{new Date(rowData.serviceDate).toLocaleDateString('en-GB')}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Offering Amount</Text>
          <Text style={styles.value}>{rowData.price} INR</Text>
        </View>


        <View style={styles.row}>
          <Text style={styles.label}>POS User By</Text>
          <Text style={styles.value}>{posUserData?.firstName} {posUserData?.lastName}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>POS Contact</Text>
          <Text style={styles.value}>{posUserData?.phoneNumber}</Text>
        </View>

        <View style={[styles.row, { borderBottom: 'none' }]}>
          <Text style={styles.label}>Status</Text>
          <Text style={styles.value}>{rowData.status}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          This is a computer generated receipt. No signature required.
        </Text>
        <Text style={styles.footerText}>
          For any queries, please contact the temple office.
        </Text>
        {/* <Text style={styles.blessingText}>
          
        </Text> */}
      </View>
    </Page>
  </Document>
);

const ServiceDetailsSkeleton = () => {
  return (
    <div className="min-h-screen bg-[#fdf0f4] pb-6">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header Skeleton */}
        <div className="py-4 flex items-center gap-3">
          <div className="w-20 h-6 bg-gray-200 animate-pulse rounded" />
        </div>

        {/* Main Content Skeleton */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Title Section */}
          <div className="p-8 bg-gradient-to-r from-[#663399]/50 to-[#8B5FBF]/50">
            <div className="space-y-3">
              <div className="w-2/3 h-8 bg-gray-200 animate-pulse rounded" />
              <div className="w-24 h-6 bg-gray-200 animate-pulse rounded-full" />
            </div>
          </div>

          {/* Image Skeleton */}
          <div className="p-4">
            <div className="h-[600px] bg-gray-200 animate-pulse rounded-xl" />
          </div>

          {/* Details Skeleton */}
          <div className="p-6 space-y-6">
            {/* Service Details */}
            <div className="space-y-4">
              <div className="w-40 h-6 bg-gray-200 animate-pulse rounded" />
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex justify-between py-2 border-b border-gray-100">
                  <div className="w-24 h-4 bg-gray-200 animate-pulse rounded" />
                  <div className="w-32 h-4 bg-gray-200 animate-pulse rounded" />
                </div>
              ))}
            </div>

            {/* Personal Info Skeleton */}
            <div className="space-y-4">
              <div className="w-48 h-6 bg-gray-200 animate-pulse rounded" />
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex justify-between py-2 border-b border-gray-100">
                  <div className="w-24 h-4 bg-gray-200 animate-pulse rounded" />
                  <div className="w-32 h-4 bg-gray-200 animate-pulse rounded" />
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons Skeleton */}
          <div className="p-6 bg-[#fdf0f4] flex gap-4">
            <div className="flex-1 h-12 bg-gray-200 animate-pulse rounded-xl" />
            <div className="flex-1 h-12 bg-gray-200 animate-pulse rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
};

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
        body: JSON.stringify({ status, approverId: userId, serviceId}),
      });
      const data = await response.json();
      await fetch('/api/sendEmail', {
        method:'POST',
        headers:{
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({serviceId})
      })
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

  if (loading) return <ServiceDetailsSkeleton />;

  return (
    <div className="min-h-screen bg-[#fdf0f4] pb-6">
      {service ? (
        <div className="max-w-3xl mx-auto">
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
            <div className="p-8 bg-gradient-to-r from-[#663399] to-[#8B5FBF] text-white">
              <div className="flex flex-col gap-3">
                <h1 className="text-3xl font-semibold tracking-tight">
                  {service.nameOfTheService.name}
                </h1>
                <div className="flex items-center gap-2">
                  <span className={`
                  px-4 py-1.5 rounded-full text-sm font-medium
                  ${service.status === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-100' : 
                    service.status === 'REJECTED' ? 'bg-red-500/20 text-red-100' : 
                    'bg-yellow-500/20 text-yellow-100'}
                  `}>
                  {service.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Image Section */}
            <div className="p-4">
              {service.image && (
                <div className="relative h-[600px] w-full rounded-xl overflow-hidden">
                  <Image
                    src={service.image}
                    alt="Service Image"
                    fill
                    style={{ objectFit: 'contain' }}
                    className="rounded-xl"
                  />
                </div>
              )}
              {/* // ) : (
              //   <div className="h-[600px] rounded-xl bg-gray-100 flex items-center justify-center">
              //     <p className="text-gray-500">No Image Available</p>
              //   </div>
              // )} */}
            </div>

            {/* Service Details */}
            <div className="p-6 space-y-6">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-[#663399]">Service Details</h2>
                <div className="grid gap-3 text-gray-700">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span>Service Date</span>
                    <span>{new Date(service.serviceDate).toLocaleDateString('en-GB')}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span>Price</span>
                    <span>₹{service.price.toLocaleString()}</span>
                  </div>

                  {service.approvedBy?(
                    <>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span>Transaction ID</span>
                        <span>{service.transactionId}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span>Payment Mode</span>
                        <span>{service.paymentMode}</span>
                      </div>
                  </>):null}
                  
                  {service.status === "APPROVED" && service.approvedBy? (
                    <>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span>Approved By</span>
                        <span>{service.approvedBy.personalInfo.firstName} {service.approvedBy.personalInfo.lastName}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span>Approver Contact</span>
                        <span>{service.approvedBy.phone}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span>Approver Email</span>
                        <span>{service.approvedBy.email}</span>
                      </div>
                    </>
                  ):service.status==='APPROVED'&&service.posUser?(
                    <>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span>POS User Approved By</span>
                        <span>{service.posUser.personalInfo.firstName} {service.posUser.personalInfo.lastName}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span>POS User Contact</span>
                        <span>{service.posUser.phone}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span>POS Email</span>
                        <span>{service.posUser.email}</span>
                      </div>
                    </>
                  ):null}
                </div>
              </div>

              {/* Personal Information */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-[#663399]">Personal Information</h2>
                <div className="grid gap-3 text-gray-700">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span>Name</span>
                    <span>{service.User.personalInfo.firstName} {service.User.personalInfo.lastName}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span>Phone</span>
                    <span>{service.User.phone}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span>Email</span>
                    <span>{service.User.email}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span>Address</span>
                    <span className="text-right">
                      {service.User.personalInfo.address1}<br />
                      {service.User.personalInfo.address2}<br />
                      {service.User.personalInfo.city}, {service.User.personalInfo.state}<br />
                      {service.User.personalInfo.country} - {service.User.personalInfo.pincode}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {service.status === "PENDING"?(
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
            </div>):service.status==='APPROVED'&&service.approvedBy?(
                                    <div className="mb-4 p-6">
                                    <PDFDownloadLink 
                                      document={
                                        <MyDocument 
                                          rowData={service} 
                                          userData={sessionData}
                                          approvedByData={{
                                            firstName: service.approvedBy.personalInfo.firstName,
                                            lastName: service.approvedBy.personalInfo.lastName,
                                            phoneNumber: service.approvedBy.phone
                                          }}
                                        />
                                      }
                                      fileName="Service_Details.pdf"
                                    >
                                      <button className="w-full flex items-center justify-center gap-1.5 text-purple-700 
                                                     text-xs font-medium bg-purple-50 hover:bg-purple-100 px-3 py-2 
                                                     rounded-full transition-colors duration-200">
                                        <Download className="w-3 h-3" />
                                        Download Receipt
                                      </button>
                                    </PDFDownloadLink>
                                  </div>
            ):
            service.status==='APPROVED'&&service.posUser?(
              <div className="mb-4 p-6">
                                    <PDFDownloadLink 
                                      document={
                                        <MyDocumentForPos
                                          rowData={service} 
                                          userData={sessionData}
                                          posUserData={{
                                            firstName: service.posUser.personalInfo.firstName,
                                            lastName: service.posUser.personalInfo.lastName,
                                            phoneNumber: service.posUser.phone
                                          }}
                                        />
                                      }
                                      fileName="Service_Details.pdf"
                                    >
                                      <button className="w-full flex items-center justify-center gap-1.5 text-purple-700 
                                                     text-xs font-medium bg-purple-50 hover:bg-purple-100 px-3 py-2 
                                                     rounded-full transition-colors duration-200">
                                        <Download className="w-3 h-3" />
                                        Download Receipt
                                      </button>
                                    </PDFDownloadLink>
                                  </div>
            ):null}
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
