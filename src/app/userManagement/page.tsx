"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaUserCog, FaSearch } from 'react-icons/fa';
import { MdEmail, MdPhone } from 'react-icons/md';
import { HiLocationMarker } from 'react-icons/hi';
import { IoLogoWhatsapp } from 'react-icons/io';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type PersonalInfo = {
  userid: string;
  firstName: string;
  lastName: string;
  city: string;
  createdAt: string;
  isApproved: string;
  address1: string;
  address2: string;
  pincode: string;
  state: string;
  country: string;
  comments: string;
  avatarUrl: string;
  email?: string;
  role?: string;
  Phone?: string;
  [key: string]: string | undefined;
};

type UserDetail = {
  id: string;
  email?: string;
  role?: string;
  phone?: string;
};

const UserCard: React.FC<{ user: PersonalInfo; onClick: () => void }> = ({ user, onClick }) => (
  <div 
    onClick={onClick}
    className="bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-all active:bg-gray-50 touch-manipulation"
  >
    <div className="flex items-start gap-2">
      <div className="w-8 h-8 shrink-0 bg-[#663399] rounded-full flex items-center justify-center text-white text-xs font-semibold">
        {user.firstName[0]}{user.lastName[0]}
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="font-semibold text-sm text-gray-800 truncate">
          {`${user.firstName} ${user.lastName}`}
        </h3>
        <div className="mt-1 space-y-1">
          {user.Phone ? (
            <div className="flex items-center gap-1.5 text-gray-600">
              <MdPhone className="text-[#663399] shrink-0 w-3.5 h-3.5" />
              <a href={`tel:${user.Phone}`} className="text-xs truncate hover:text-[#663399]">
                {user.Phone}
              </a>
              <a 
                href={`https://wa.me/${user.Phone?.replace(/\D/g, '')}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-green-500 hover:text-green-600 touch-manipulation"
              >
                <IoLogoWhatsapp className="w-3.5 h-3.5" fill='green' />
              </a>
            </div>
          ) : user.email && (
            <div className="flex items-center gap-1.5 text-gray-600">
              <MdEmail className="text-[#663399] shrink-0 w-3.5 h-3.5" />
              <span className="text-xs truncate">{user.email}</span>
            </div>
          )}
          <div className="flex gap-1.5 text-gray-600">
            <HiLocationMarker className="text-[#663399] shrink-0 w-3.5 h-3.5 mt-0.5" />
            <div className="text-xs space-y-0.5 flex-1 min-w-0">
              <div className="truncate">
                {[user.address1, user.address2].filter(Boolean).join(', ')}
              </div>
              <div className="truncate">
                {[user.city, user.state, user.pincode].filter(Boolean).join(', ')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const SkeletonCard = () => (
  <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 animate-pulse">
    <div className="flex items-start space-x-3">
      <div className="w-10 h-10 bg-gray-200 rounded-full shrink-0" />
      <div className="flex-1 space-y-3">
        {/* Name */}
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        
        {/* Contact Info */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-200 rounded" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
          </div>
          
          {/* Address */}
          <div className="flex space-x-2">
            <div className="w-4 h-4 bg-gray-200 rounded" />
            <div className="space-y-1 flex-1">
              <div className="h-3 bg-gray-200 rounded w-full" />
              <div className="h-3 bg-gray-200 rounded w-4/5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const PersonalInfoGrid: React.FC = () => {
  const router = useRouter();
  const [userData, setUserData] = useState<PersonalInfo[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20; // Changed from 15 to 20

  const fetchData = async () => {
    try {
      setIsLoading(true); // Add this line
      const res = await fetch('/api/profile', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      
      const combinedData = data.personalInfodetails.map((personal: PersonalInfo) => {
        const userDetail = data.userDetails.find((user:UserDetail) => user.id === personal.userid);
        return {
          ...personal,
          email: userDetail?.email,
          role: userDetail?.role,
          Phone: userDetail?.phone
        };
      });
      setUserData(combinedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false); // Add this line
    }
  };

  useEffect(() => {
    const sessionData = JSON.parse(sessionStorage.getItem('user') || '{}');
    if (!sessionData.role?.includes('Admin')) {
      router.push('/unAuthorized');
    }
    fetchData();
  }, []);

  // Handle search input with page reset
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Apply search filter to all data first
  const filteredUsers = userData.filter(user => {
    const searchValue = searchTerm.toLowerCase();
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    const phone = user.Phone?.toLowerCase() || '';
    const email = user.email?.toLowerCase() || '';
    const address = [
      user.address1,
      user.address2,
      user.city,
      user.state,
      user.pincode
    ].filter(Boolean).join(' ').toLowerCase();

    return (
      fullName.includes(searchValue) ||
      phone.includes(searchValue) ||
      email.includes(searchValue) ||
      address.includes(searchValue)
    );
  });

  // Then apply pagination to filtered results
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-[#fdf0f4] min-h-screen">
      <div className="max-w-sm mx-auto px-3 py-3 space-y-3">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm p-3">
          <div className="space-y-3">
            <h1 className="flex items-center gap-2 text-base font-semibold text-[#663399]">
              <FaUserCog className="text-lg" />
              <span>Manage Users</span>
            </h1>
            <div className="relative">
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full px-3 py-2 pl-8 rounded-lg text-sm border border-gray-200 focus:outline-none focus:border-[#663399]"
              />
              <FaSearch className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
            </div>
            {searchTerm && (
              <div className="text-xs text-gray-500">
                Found {filteredUsers.length} results
              </div>
            )}
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 gap-2">
          {isLoading ? (
            [...Array(3)].map((_, index) => (
              <SkeletonCard key={index} />
            ))
          ) : currentUsers.length > 0 ? (
            currentUsers.map((user) => (
              <UserCard
                key={user.userid}
                user={user}
                onClick={() => router.push(`userManagement/${user.userid}`)}
              />
            ))
          ) : searchTerm ? (
            <div className="text-center py-6">
              <p className="text-gray-500 text-base">No users found matching your search.</p>
            </div>
          ) : null}
        </div>

        {/* Mobile-optimized Pagination */}
        {!isLoading && filteredUsers.length > itemsPerPage && (
          <Pagination className="py-3">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => handlePageChange(currentPage - 1)}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>

              {/* First page */}
              <PaginationItem>
                <PaginationLink 
                  onClick={() => handlePageChange(1)}
                  isActive={currentPage === 1}
                >
                  1
                </PaginationLink>
              </PaginationItem>

              {/* Show dots if there are many pages before current page */}
              {currentPage > 3 && <PaginationItem>...</PaginationItem>}

              {/* Current page and surrounding pages */}
              {Array.from({length: 3}, (_, i) => currentPage - 1 + i)
                .filter(page => page > 1 && page < totalPages)
                .map(page => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => handlePageChange(page)}
                      isActive={currentPage === page}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}

              {/* Show dots if there are many pages after current page */}
              {currentPage < totalPages - 2 && <PaginationItem>...</PaginationItem>}

              {/* Last page */}
              {totalPages > 1 && (
                <PaginationItem>
                  <PaginationLink
                    onClick={() => handlePageChange(totalPages)}
                    isActive={currentPage === totalPages}
                  >
                    {totalPages}
                  </PaginationLink>
                </PaginationItem>
              )}

              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(currentPage + 1)}
                  className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
};

export default PersonalInfoGrid;
