"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Clock } from 'lucide-react';
import { IoCheckmarkDone } from 'react-icons/io5';
import { RxCross1 } from 'react-icons/rx';
import { FaUsersGear, FaDownload } from 'react-icons/fa6';
import { FaSearch } from 'react-icons/fa';
import { PDFDownloadLink } from '@react-pdf/renderer';
import UseApprovedByData from '../../utils/UseApprovedByData';// Move the PDF styles and component to a separate file

type Service = {
    id: string;
    nameOfTheService: string;
    amount: number;
    description: string;
    paymentMode: string;
    transactionId: string;
    approvedBy: string;
    serviceDate: string;
    status: string;
};

const ServiceCard: React.FC<{ service: Service; onClick: () => void; sessionData: any }> = ({ service, onClick, sessionData }) => {
  const approvedByData = UseApprovedByData(service.approvedBy);
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="text-yellow-500" size={16} />;
      case 'REJECTED':
        return <RxCross1 className="text-red-500" size={16} />;
      case 'APPROVED':
        return <IoCheckmarkDone className="text-green-500" size={20} />;
      default:
        return null;
    }
  };

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer border border-gray-100"
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <h3 className="font-semibold text-base text-gray-800">
              {service.nameOfTheService}
            </h3>
            <span className="flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium"
              style={{
                backgroundColor: service.status === 'APPROVED' ? '#e6ffe6' : 
                              service.status === 'REJECTED' ? '#ffe6e6' : '#fff9e6',
                color: service.status === 'APPROVED' ? '#006600' : 
                       service.status === 'REJECTED' ? '#cc0000' : '#997a00'
              }}>
              {getStatusIcon(service.status)}
              <span>{service.status}</span>
            </span>
          </div>
          <div className="mt-2 space-y-1 text-sm text-gray-600">
            <p>Amount: ₹{service.amount}</p>
            <p>Date: {service.serviceDate}</p>
          </div>
        </div>
        {/* <PDFDownloadLink 
          document={<MyDocument rowData={service} userData={sessionData} approvedByData={approvedByData || { firstName: 'Not Approved Yet', lastName: '', phoneNumber: '' }} />}
          fileName="Service_Details.pdf"
          className="text-blue-500 hover:text-blue-700"
        >
          <FaDownload size={18} />
        </PDFDownloadLink> */}
      </div>
    </div>
  );
};

const ServiceManagementGrid: React.FC = () => {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [serviceTypeFilter, setServiceTypeFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const sessionData = JSON.parse(sessionStorage.getItem("user") || "{}");

  useEffect(() => {
    const sessionData = JSON.parse(sessionStorage.getItem('user') || '{}');
    if (!sessionData.role.includes('approver') ) {
      router.push('/unAuthorized');
    }
    const userId = sessionData.id;
    const fetchServices = async () => {
        const response = await fetch(`/api/services/approver?approverId=${userId}`);
        const data = await response.json();
        if (response.status === 200) {
            setServices(data.services.map((service: any) => ({
                id: service.id,
                nameOfTheService: service.nameOfTheService,
                amount: service.amount,
                description: service.description,
                paymentMode: service.paymentMode,
                transactionId: service.transactionId,
                approvedBy: service.approvedBy,
                serviceDate: new Date(service.serviceDate).toLocaleDateString(),
                status: service.status
            })));
        }
    };
    fetchServices();
}, []);

  const filteredServices = services.filter(service => {
    const matchesSearch = (
      service.nameOfTheService.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const matchesStatus = !statusFilter || service.status === statusFilter;
    const matchesType = !serviceTypeFilter || service.nameOfTheService === serviceTypeFilter;
    const matchesDate = !dateFilter || service.serviceDate.includes(dateFilter);

    return matchesSearch && matchesStatus && matchesType && matchesDate;
  });

  return (
    <div className="bg-[#fdf0f4] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-4 space-y-4">
        {/* Header and Filters Section */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="space-y-4">
            <h1 className="flex items-center gap-2 text-lg font-semibold text-[#663399]">
              <FaUsersGear className="text-xl" />
              <span>Manage Services</span>
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search services..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 pl-9 rounded-lg text-sm border border-gray-200 focus:outline-none focus:border-[#663399]"
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 rounded-lg text-sm border border-gray-200 focus:outline-none focus:border-[#663399]"
              >
                <option value="">All Status</option>
                <option value="APPROVED">Approved</option>
                <option value="PENDING">Pending</option>
                <option value="REJECTED">Rejected</option>
              </select>

              <select
                value={serviceTypeFilter}
                onChange={(e) => setServiceTypeFilter(e.target.value)}
                className="w-full px-4 py-2 rounded-lg text-sm border border-gray-200 focus:outline-none focus:border-[#663399]"
              >
                <option value="">All Services</option>
                <option value="abhisekam">Abhisekam</option>
                <option value="donation">Donation</option>
                <option value="thirumanjanam">Thirumanjanam</option>
              </select>

              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full px-4 py-2 rounded-lg text-sm border border-gray-200 focus:outline-none focus:border-[#663399]"
              />
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredServices.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onClick={() => router.push(`/serviceManagement/${service.id}`)}
              sessionData={sessionData}
            />
          ))}
        </div>

        {/* No Results Message */}
        {filteredServices.length === 0 && (
          <div className="text-center py-6">
            <p className="text-gray-500 text-base">No services found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceManagementGrid;
