"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Clock, LucideUserCheck2, RotateCcw } from 'lucide-react';
import { IoCheckmarkDone } from 'react-icons/io5';
import { RxCross1 } from 'react-icons/rx';
import { FaSearch } from 'react-icons/fa';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

type Service = {
    id: string;
    nameOfTheService: {
        name: string;
    };
    price: number;
    paymentMode: string;
    transactionId: string;
    status: string;
    serviceDate: string;
};

const ServiceCard: React.FC<{ service: Service; onClick: () => void }> = ({ service, onClick }) => {
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(date);
  };

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-100 relative group"
    >
      {/* Service Type Banner */}
      <div className="bg-[#663399] px-4 py-2">
        <h3 className="font-medium text-white text-sm">
          {service.nameOfTheService.name}
        </h3>
      </div>

      {/* Main Content */}
      <div className="p-4">
        {/* Price and Status Row */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-1">
            <span className="text-lg font-bold text-gray-800">₹{service.price}</span>
            <span className="text-xs text-gray-500">INR</span>
          </div>
          <span className="flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium"
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

        {/* Details Section */}
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {formatDate(service.serviceDate)}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
            </svg>
            {service.paymentMode === null ? "POS" : service.paymentMode} 
          </div>
          <div>
          </div>
        </div>
      </div>

      {/* Hover Effect */}
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-5 transition-all duration-300" />
    </div>
  );
};

const SkeletonCard = () => {
  return (
    <div className="bg-white rounded-xl overflow-hidden border border-gray-100">
      {/* Skeleton Banner */}
      <div className="bg-gray-200 px-4 py-4 animate-pulse">
        <div className="h-4 w-24 bg-gray-300 rounded" />
      </div>

      {/* Skeleton Content */}
      <div className="p-4 space-y-4">
        {/* Price and Status */}
        <div className="flex justify-between items-center">
          <div className="h-6 w-20 bg-gray-200 rounded animate-pulse" />
          <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
        </div>

        {/* Details */}
        <div className="space-y-2">
          <div className="flex items-center">
            <div className="h-4 w-4 bg-gray-200 rounded-full mr-2 animate-pulse" />
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="flex items-center">
            <div className="h-4 w-4 bg-gray-200 rounded-full mr-2 animate-pulse" />
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
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
  const [uniqueServiceTypes, setUniqueServiceTypes] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20; // Changed to 20 items per page
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const sessionData = JSON.parse(sessionStorage.getItem('user') || '{}');
    if (!sessionData.role.includes('approver') ) {
      router.push('/unAuthorized');
    }
    // const userId = sessionData.id;
    const fetchServices = async () => {
      setIsLoading(true);
      try {
        const sessionData = JSON.parse(sessionStorage.getItem('user') || '{}');
        const userId = sessionData.id;
        const response = await fetch(`/api/services/approver?approverId=${userId}`);
        const data = await response.json();
        if (response.status === 200) {
          setServices(data.services);
          const types = Array.from(new Set(data.services.map((s: Service) => s.nameOfTheService.name))) as string[];
          setUniqueServiceTypes(types);
        }
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchServices();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, serviceTypeFilter, dateFilter]);

  const filteredServices = services.filter((service) => {
    const matchesSearch = service.nameOfTheService.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || service.status === statusFilter;
    const matchesType = !serviceTypeFilter || service.nameOfTheService.name === serviceTypeFilter;
    const matchesDate = !dateFilter || new Date(service.serviceDate).toLocaleDateString().includes(dateFilter);
    return matchesSearch && matchesStatus && matchesType && matchesDate;
  });

  const totalItems = filteredServices.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  const paginatedServices = filteredServices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const PaginationComponent = () => {
    if (totalPages <= 1) return null;

    return (
      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
            />
          </PaginationItem>
          
          {[...Array(totalPages)].map((_, idx) => {
            const pageNumber = idx + 1;
            if (
              pageNumber === 1 ||
              pageNumber === totalPages ||
              (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
            ) {
              return (
                <PaginationItem key={pageNumber}>
                  <PaginationLink
                    onClick={() => setCurrentPage(pageNumber)}
                    isActive={currentPage === pageNumber}
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              );
            } else if (
              (pageNumber === currentPage - 2 && currentPage > 3) ||
              (pageNumber === currentPage + 2 && currentPage < totalPages - 2)
            ) {
              return (
                <PaginationItem key={pageNumber}>
                  <PaginationEllipsis />
                </PaginationItem>
              );
            }
            return null;
          })}

          <PaginationItem>
            <PaginationNext
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };

  return (
    <div className="bg-[#fdf0f4] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-4 space-y-4">

        {/* Rest of your existing filters and content */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="space-y-4">
            {/* Header with Manage Seva and Reset Button */}
            <div className="flex items-center justify-between">
              <h1 className="flex items-center gap-2 text-lg font-semibold text-[#663399]">
                <LucideUserCheck2 className="text-xl" />
                <span>Manage Seva</span>
              </h1>
              
              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('');
                  setServiceTypeFilter('');
                  setDateFilter('');
                }}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors text-[#663399]"
                title="Reset filters"
              >
                <RotateCcw className="w-5 h-5" />
                <span className="text-sm hidden sm:inline">Reset</span>
              </button>
            </div>
            
            {/* Rest of the filters section */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="h-10 bg-gray-200 rounded animate-pulse" />
                <div className="flex gap-x-2">
                  <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
                  <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
                  <div className="h-10 w-28 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {/* Search bar - Full width on mobile */}
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

                {/* Filters with reset button */}
                <div className="flex flex-wrap gap-2 items-center">
                  <div className="flex-1 min-w-[150px]">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg text-sm border border-gray-200 focus:outline-none focus:border-[#663399]"
                    >
                      <option value="">All Status</option>
                      <option value="APPROVED">Approved</option>
                      <option value="PENDING">Pending</option>
                      <option value="REJECTED">Rejected</option>
                    </select>
                  </div>

                  <div className="flex-1 min-w-[150px]">
                    <select
                      value={serviceTypeFilter}
                      onChange={(e) => setServiceTypeFilter(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg text-sm border border-gray-200 focus:outline-none focus:border-[#663399]"
                    >
                      <option value="">All Services</option>
                      {uniqueServiceTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div className="w-full sm:w-auto">
                    <input
                      type="date"
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value)}
                      className="w-full sm:w-[130px] px-3 py-2 rounded-lg text-sm border border-gray-200 focus:outline-none focus:border-[#663399]"
                    />
                  </div>

                  {/* <button
                    onClick={() => {
                      setSearchTerm('');
                      setStatusFilter('');
                      setServiceTypeFilter('');
                      setDateFilter('');
                    }}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    title="Reset filters"
                  >
                    <RotateCcw className="w-5 h-5 text-[#663399]" />
                  </button> */}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Services Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginatedServices.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  onClick={() => router.push(`/serviceManagement/${service.id}`)}
                />
              ))}
            </div>
            
            {/* New Pagination Component */}
            {!isLoading && filteredServices.length > 0 && <PaginationComponent />}
          </>
        )}

        {/* No Results Message */}
        {!isLoading && filteredServices.length === 0 && (
          <div className="text-center py-6">
            <p className="text-gray-500 text-base">No services found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceManagementGrid;
