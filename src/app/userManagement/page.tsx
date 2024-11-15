"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaUserCog, FaSearch } from 'react-icons/fa';
import { MdEmail, MdPhone } from 'react-icons/md';
import { HiLocationMarker } from 'react-icons/hi';
import { IoLogoWhatsapp } from 'react-icons/io';
import {
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import LoadingPageUi from '@/components/LoadingPageUi';
import EditableSection from '@/components/EditableSection';
import { toast } from 'react-toastify';

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

const toTitleCase = (str: string) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

type Profile = {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  [key: string]: string | undefined;
};

// Add this type for the save handler
type SaveHandler = (section: string, values: { [key: string]: string }) => Promise<void>;

// Modify the UserProfileDrawer component
const UserProfileDrawer = ({ user, onClose }: { user: PersonalInfo; onClose: () => void }) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: user.userid }),
        });
        const data = await res.json();
        if (data.status === 200) {
          setProfile(data.details);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user.userid]);

  // Add the save handler function
  const handleSave: SaveHandler = async (section, values) => {
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.userid,
          section,
          ...values,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const updatedData = await response.json();
      
      if (updatedData.status === 200) {
        setProfile(prev => prev ? { ...prev, ...values } : null);
        toast.success('Profile updated successfully');
      } else {
        throw new Error(updatedData.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update profile');
    }
  };

  return (
    <DrawerContent className="h-[85vh] overflow-y-auto">
      <DrawerHeader>
        <DrawerTitle className="text-[#663399]">User Profile</DrawerTitle>
      </DrawerHeader>
      <div className="px-4 pb-8">
        {loading ? (
          <LoadingPageUi />
        ) : profile ? (
          <div className="space-y-4">
            <EditableSection
              section="personalInfo"
              fields={['firstName', 'lastName', 'email', 'phone']}
              profile={profile}
              onSave={handleSave}
            />
            <EditableSection
              section="address"
              fields={['address1', 'address2', 'city', 'state', 'pincode', 'country']}
              profile={profile}
              onSave={handleSave}
            />
          </div>
        ) : (
          <div className="text-center text-red-500">Profile not found</div>
        )}
      </div>
    </DrawerContent>
  );
};

const UserCard: React.FC<{ user: PersonalInfo; onClick: () => void }> = ({ user, onClick }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <div 
        onClick={() => setIsOpen(true)}
        className="bg-white rounded-xl p-3 shadow-sm hover:shadow-md transition-all 
          active:bg-gray-50 touch-manipulation md:p-4"
      >
        <div className="flex items-center gap-3 md:gap-4"> {/* Changed items-start to items-center */}
          {/* Avatar - adjusted sizing and centering */}
          <div className="self-start w-10 h-10 md:w-12 md:h-12 shrink-0 bg-[#663399] rounded-full 
            flex items-center justify-center text-white text-sm md:text-base font-semibold">
            {toTitleCase(user.firstName)[0]}{toTitleCase(user.lastName)[0]}
          </div>

          {/* Content */}
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-sm md:text-base text-gray-800 truncate">
              {`${toTitleCase(user.firstName)} ${toTitleCase(user.lastName)}`}
            </h3>
            <div className="mt-1 space-y-1.5 md:mt-2 md:space-y-2">
              {user.Phone ? (
                <div className="flex items-center gap-1.5 text-gray-600">
                  <MdPhone className="text-[#663399] shrink-0 w-3.5 h-3.5 md:w-4 md:h-4" />
                  <a href={`tel:${user.Phone}`} 
                    className="text-xs md:text-sm truncate hover:text-[#663399]">
                    {user.Phone}
                  </a>
                  <a href={`https://wa.me/${user.Phone?.replace(/\D/g, '')}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-green-500 hover:text-green-600 touch-manipulation">
                    <IoLogoWhatsapp className="w-3.5 h-3.5 md:w-4 md:h-4" fill='green' />
                  </a>
                </div>
              ) : user.email && (
                <div className="flex items-center gap-1.5 text-gray-600">
                  <MdEmail className="text-[#663399] shrink-0 w-3.5 h-3.5 md:w-4 md:h-4" />
                  <span className="text-xs md:text-sm truncate">{user.email}</span>
                </div>
              )}
              <div className="flex gap-1.5 text-gray-600">
                <HiLocationMarker className="text-[#663399] shrink-0 w-3.5 h-3.5 md:w-4 md:h-4 mt-0.5" />
                <div className="text-xs md:text-sm space-y-0.5 flex-1 min-w-0">
                  <div className="truncate">
                    {[user.address1, user.address2]
                      .filter(Boolean)
                      .map(addr => toTitleCase(addr))
                      .join(', ')}
                  </div>
                  <div className="truncate">
                    {[user.city, user.state, user.pincode]
                      .filter(Boolean)
                      .map(item => toTitleCase(item))
                      .join(', ')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {isOpen && <UserProfileDrawer user={user} onClose={() => setIsOpen(false)} />}
    </Drawer>
  );
};

const SkeletonCard = () => (
  <div className="bg-white rounded-xl p-4 md:p-5 shadow-sm border border-gray-100 animate-pulse">
    <div className="flex items-start space-x-3 md:space-x-4">
      <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-200 rounded-full shrink-0" />
      <div className="flex-1 space-y-3 md:space-y-4">
        <div className="h-4 md:h-5 bg-gray-200 rounded w-3/4" />
        <div className="space-y-2 md:space-y-3">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 md:w-5 md:h-5 bg-gray-200 rounded" />
            <div className="h-3 md:h-4 bg-gray-200 rounded w-1/2" />
          </div>
          <div className="flex space-x-2">
            <div className="w-4 h-4 md:w-5 md:h-5 bg-gray-200 rounded" />
            <div className="space-y-1 md:space-y-2 flex-1">
              <div className="h-3 md:h-4 bg-gray-200 rounded w-full" />
              <div className="h-3 md:h-4 bg-gray-200 rounded w-4/5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const Pagination: React.FC<{
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}> = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const delta = window.innerWidth < 640 ? 1 : 2; // Show fewer pages on mobile
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  return (
    <div>
      <PaginationContent className="flex flex-wrap justify-center gap-1 px-4">
        <PaginationItem>
          <PaginationPrevious
            onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
            className={`
              min-w-[40px] h-10 md:h-9
              ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}
              touch-manipulation
            `}
          />
        </PaginationItem>

        {getPageNumbers().map((pageNum, idx) => (
          <PaginationItem key={idx}>
            {pageNum === '...' ? (
              <span className="px-3 py-2">...</span>
            ) : (
              <PaginationLink
                onClick={() => onPageChange(Number(pageNum))}
                isActive={currentPage === pageNum}
                className="
                  min-w-[40px] h-10 md:h-9
                  hover:bg-gray-100 touch-manipulation
                  text-sm md:text-base
                "
              >
                {pageNum}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
            className={`
              min-w-[40px] h-10 md:h-9
              ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}
              touch-manipulation
            `}
          />
        </PaginationItem>
      </PaginationContent>
    </div>
  );
};

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
    <div className="min-h-screen bg-[#fdf0f4]">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="flex items-center gap-2 text-lg font-semibold text-[#663399]">
              <FaUserCog className="text-xl" />
              <span>Manage Users</span>
            </h1>
            
            <div className="w-full sm:w-96">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full px-4 py-2 pl-10 rounded-lg text-sm border border-gray-200 
                    focus:outline-none focus:border-[#663399] focus:ring-1 focus:ring-[#663399]"
                />
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              </div>
              {searchTerm && (
                <div className="mt-2 text-sm text-gray-500">
                  Found {filteredUsers.length} results
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
          {isLoading ? (
            Array(8).fill(0).map((_, index) => <SkeletonCard key={index} />)
          ) : currentUsers.length > 0 ? (
            currentUsers.map((user) => (
              <UserCard
                key={user.userid}
                user={user}
                onClick={() => router.push(`userManagement/${user.userid}`)}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">
                {searchTerm ? 'No users found matching your search.' : 'No users available.'}
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {!isLoading && filteredUsers.length > itemsPerPage && (
          <div className="flex justify-center py-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalInfoGrid;
