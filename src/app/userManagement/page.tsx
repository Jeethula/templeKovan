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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from 'react-hot-toast';
import { Pencil } from 'lucide-react';

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
  role?: string[];
  Phone?: string;
  [key: string]: string | string[] | undefined;
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

// Add the UserEditModal component
const UserEditModal = ({ user, isOpen, onClose }: { 
  user: PersonalInfo | null; 
  isOpen: boolean; 
  onClose: () => void;
}) => {
  const [formData, setFormData] = useState<PersonalInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: user?.userid }),
      });
      const data = await response.json();
      if (data.status === 200) {
        // Combine user and personal info data
        setFormData({
          ...data.details,
          email: data.details.user.email,
          Phone: data.details.user.phone
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  const validateField = async (field: string, value: string) => {
    if (field === 'email' || field === 'Phone') {
      try {
        const response = await fetch('/api/validate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            field, 
            value, 
            userId: user?.userid // exclude current user from validation
          }),
        });
        const data = await response.json();
        
        if (!data.isValid) {
          setErrors(prev => ({
            ...prev,
            [field]: `This ${field.toLowerCase()} is already in use`
          }));
          return false;
        }
      } catch (error) {
        console.error('Validation error:', error);
      }
    }
    setErrors(prev => ({ ...prev, [field]: '' }));
    return true;
  };

  const handleInputChange = async (field: string, value: string) => {
    setFormData(prev => prev ? { ...prev, [field]: value } : null);
    await validateField(field, value);
  };

  const handleSubmit = async () => {
    if (!formData) return;

    // Validate email and phone before submission
    const isEmailValid = await validateField('email', formData.email || '');
    const isPhoneValid = await validateField('Phone', formData.Phone || '');

    if (!isEmailValid || !isPhoneValid) {
      return; // Don't submit if validation fails
    }

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.userid,
          ...formData
        }),
      });

      if (!response.ok) throw new Error('Failed to update profile');

      const data = await response.json();
      if (data.status === 200) {
        toast.success('Profile updated successfully');
        onClose();
      } else {
        throw new Error(data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update profile');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[#663399]">Edit User Profile</DialogTitle>
        </DialogHeader>
        
        {loading ? (
          <SkeletonModal />
        ) : formData ? (
          <div className="space-y-6">
            {/* Personal Information Fields */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-700">Personal Information</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { key: 'firstName', label: 'First Name' },
                  { key: 'lastName', label: 'Last Name' },
                  { key: 'email', label: 'Email' },
                  { key: 'Phone', label: 'Phone' },
                ].map(({ key, label }) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      {label}
                    </label>
                    <input
                      type="text"
                      value={formData[key] || ''}
                      onChange={(e) => handleInputChange(key, e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-[#663399] 
                        ${errors[key] ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors[key] && (
                      <p className="mt-1 text-sm text-red-500">{errors[key]}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Address Fields */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-700">Address Information</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { key: 'address1', label: 'Address Line 1' },
                  { key: 'address2', label: 'Address Line 2' },
                  { key: 'city', label: 'City' },
                  { key: 'state', label: 'State' },
                  { key: 'pincode', label: 'Pincode' },
                  { key: 'country', label: 'Country' },
                ].map(({ key, label }) => (
                  <div key={key} className={key === 'address1' || key === 'address2' ? 'col-span-2' : ''}>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      {label}
                    </label>
                    <input
                      type="text"
                      value={formData[key] || ''}
                      onChange={(e) => handleInputChange(key, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md 
                        focus:outline-none focus:ring-1 focus:ring-[#663399]"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 
                  rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 
                  focus:ring-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 text-sm font-medium text-white bg-[#663399] 
                  rounded-md hover:bg-[#663399]/90 focus:outline-none focus:ring-2 
                  focus:ring-[#663399]"
              >
                Update Profile
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center text-red-500">Profile not found</div>
        )}
      </DialogContent>
    </Dialog>
  );
};

const UserCard: React.FC<{ user: PersonalInfo; onEdit: () => void }> = ({ user, onEdit }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all border border-gray-100">
      <div className="space-y-4">
        {/* Header with avatar and name */}
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-14 h-14 bg-gradient-to-br from-[#663399] to-[#8B5FBF] rounded-xl 
              flex items-center justify-center text-white text-lg font-bold shadow-sm"
            >
              {toTitleCase(user.firstName)[0]}{toTitleCase(user.lastName)[0]}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 text-base leading-6 break-words">
                  {`${toTitleCase(user.firstName)} ${toTitleCase(user.lastName)}`}
                </h3>
                <p className="text-sm text-gray-500 mt-0.5 break-words">
                  {user.role?.join(', ')}
                </p>
              </div>
              <button
                onClick={onEdit}
                className="flex-shrink-0 p-2 text-[#663399] hover:bg-[#663399]/10 
                  rounded-lg transition-colors"
                title="Edit profile"
              >
                <Pencil className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Rest of the card remains unchanged */}
        <div className="space-y-3 pt-2">
          {/* Contact Info */}
          <div className="space-y-2.5">
            {user.Phone && (
              <div className="flex items-center gap-3 text-gray-600 group">
                <div className="flex-shrink-0 p-2 bg-gray-50 rounded-lg 
                  group-hover:bg-[#663399]/10 transition-colors"
                >
                  <MdPhone className="text-[#663399] w-4 h-4" />
                </div>
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <a href={`tel:${user.Phone}`} 
                    className="text-sm hover:text-[#663399] transition-colors truncate">
                    {user.Phone}
                  </a>
                  <a
                    href={`https://wa.me/${user.Phone?.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 p-1 text-green-500 hover:text-green-600 
                      hover:bg-green-50 rounded transition-colors"
                  >
                    <IoLogoWhatsapp className="w-4 h-4" />
                  </a>
                </div>
              </div>
            )}

            {user.email && (
              <div className="flex items-center gap-3 text-gray-600 group">
                <div className="flex-shrink-0 p-2 bg-gray-50 rounded-lg 
                  group-hover:bg-[#663399]/10 transition-colors"
                >
                  <MdEmail className="text-[#663399] w-4 h-4" />
                </div>
                <a href={`mailto:${user.email}`} 
                  className="text-sm truncate hover:text-[#663399] transition-colors flex-1">
                  {user.email}
                </a>
              </div>
            )}
          </div>

          {/* Address */}
          <div className="flex items-start gap-3 text-gray-600 group pt-1">
            <div className="flex-shrink-0 p-2 bg-gray-50 rounded-lg 
              group-hover:bg-[#663399]/10 transition-colors"
            >
              <HiLocationMarker className="text-[#663399] w-4 h-4" />
            </div>
            <div className="text-sm space-y-1 min-w-0 flex-1">
              {user.address1 && (
                <div className="text-gray-600 truncate">
                  {toTitleCase(user.address1)}
                </div>
              )}
              <div className="text-gray-500 truncate">
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
  );
};

const SkeletonCard = () => (
  <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all border border-gray-100">
    <div className="space-y-4">
      {/* Header with avatar and name */}
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 bg-gray-200 rounded-xl animate-pulse" />
        <div className="flex-1">
          <div className="h-5 w-2/3 bg-gray-200 rounded animate-pulse mb-2" />
          <div className="h-4 w-1/3 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse" />
      </div>

      {/* Contact Info Skeleton */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse" />
          <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse" />
          <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>

      {/* Address Skeleton */}
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-4/5 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    </div>
  </div>
);

const SkeletonModal = () => (
  <div className="space-y-6">
    {/* Personal Information Skeleton */}
    <div className="space-y-4">
      <div className="h-5 w-1/4 bg-gray-200 rounded animate-pulse" />
      <div className="grid grid-cols-2 gap-4">
        {Array(4).fill(0).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 w-1/3 bg-gray-200 rounded animate-pulse" />
            <div className="h-10 w-full bg-gray-200 rounded-md animate-pulse" />
          </div>
        ))}
      </div>
    </div>

    {/* Address Information Skeleton */}
    <div className="space-y-4">
      <div className="h-5 w-1/4 bg-gray-200 rounded animate-pulse" />
      <div className="grid grid-cols-2 gap-4">
        {Array(6).fill(0).map((_, i) => (
          <div key={i} className={`space-y-2 ${i < 2 ? 'col-span-2' : ''}`}>
            <div className="h-4 w-1/3 bg-gray-200 rounded animate-pulse" />
            <div className="h-10 w-full bg-gray-200 rounded-md animate-pulse" />
          </div>
        ))}
      </div>
    </div>

    {/* Action Buttons Skeleton */}
    <div className="flex justify-end gap-3 pt-4">
      <div className="w-20 h-9 bg-gray-200 rounded-md animate-pulse" />
      <div className="w-32 h-9 bg-gray-200 rounded-md animate-pulse" />
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
  const [selectedUser, setSelectedUser] = useState<PersonalInfo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/profile');
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
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
      console.error('Error:', error);
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
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

  // Handle edit click
  const handleEditClick = (user: PersonalInfo) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  // Handle modal close with data refresh
  const handleModalClose = async () => {
    await fetchData(); // Refresh data first
    setIsModalOpen(false);
    setSelectedUser(null);
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {isLoading ? (
            Array(8).fill(0).map((_, index) => <SkeletonCard key={index} />)
          ) : currentUsers.length > 0 ? (
            currentUsers.map((user) => (
              <UserCard
                key={user.userid}
                user={user}
                onEdit={() => handleEditClick(user)}
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

        {/* Edit Modal */}
        <UserEditModal
          user={selectedUser}
          isOpen={isModalOpen}
          onClose={handleModalClose} // Use the new handler
        />

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

