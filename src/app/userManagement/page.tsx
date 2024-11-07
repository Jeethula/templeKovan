"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Clock } from 'lucide-react';
import { IoCheckmarkDone } from 'react-icons/io5';
import { RxCross1 } from 'react-icons/rx';
import { FaUserCog, FaSearch } from 'react-icons/fa';
import { MdEmail, MdPhone } from 'react-icons/md';
import { HiLocationMarker } from 'react-icons/hi';

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

const UserCard: React.FC<{ user: PersonalInfo; onClick: () => void }> = ({ user, onClick }) => (
  <div 
    onClick={onClick}
    className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer border border-gray-100"
  >
    <div className="flex items-start space-x-3">
      <div className="w-10 h-10 shrink-0 bg-[#663399] rounded-full flex items-center justify-center text-white text-sm font-semibold">
        {user.firstName[0]}{user.lastName[0]}
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="font-semibold text-base text-gray-800 truncate">
          {`${user.firstName} ${user.lastName}`}
        </h3>
        <div className="mt-1 space-y-1.5">
          {user.Phone ? (
            <div className="flex items-center space-x-2 text-gray-600">
              <MdPhone className="text-[#663399] shrink-0 w-4 h-4" />
              <span className="text-sm truncate">{user.Phone}</span>
            </div>
          ) : user.email && (
            <div className="flex items-center space-x-2 text-gray-600">
              <MdEmail className="text-[#663399] shrink-0 w-4 h-4" />
              <span className="text-sm truncate">{user.email}</span>
            </div>
          )}
          <div className="flex space-x-2 text-gray-600">
            <HiLocationMarker className="text-[#663399] shrink-0 w-4 h-4 mt-0.5" />
            <div className="text-sm space-y-0.5 flex-1 min-w-0">
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

const PersonalInfoGrid: React.FC = () => {
  const router = useRouter();
  const [userData, setUserData] = useState<PersonalInfo[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchData = async () => {
    try {
      const res = await fetch('/api/profile', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      
      const combinedData = data.personalInfodetails.map((personal: PersonalInfo) => {
        const userDetail = data.userDetails.find((user: any) => user.id === personal.userid);
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
    }
  };

  useEffect(() => {
    const sessionData = JSON.parse(sessionStorage.getItem('user') || '{}');
    if (!sessionData.role?.includes('Admin')) {
      router.push('/unAuthorized');
    }
    fetchData();
  }, []);

  const filteredUsers = userData.filter(user => {
    const searchValue = searchTerm.toLowerCase();
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    return (
      fullName.includes(searchValue) ||
      user.email?.toLowerCase().includes(searchValue) ||
      user.Phone?.toLowerCase().includes(searchValue)
    );
  });

  return (
    <div className="bg-[#fdf0f4] min-h-screen">
      <div className="max-w-xl mx-auto px-4 py-4 space-y-4">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="space-y-4">
            <h1 className="flex items-center gap-2 text-lg font-semibold text-[#663399]">
              <FaUserCog className="text-xl" />
              <span>Manage Users</span>
            </h1>
            <div className="relative">
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 pl-9 rounded-lg text-sm border border-gray-200 focus:outline-none focus:border-[#663399] transition-all"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 gap-3">
          {filteredUsers.map((user) => (
            <UserCard
              key={user.userid}
              user={user}
              onClick={() => router.push(`userManagement/${user.userid}`)}
            />
          ))}
        </div>

        {/* No Results Message */}
        {filteredUsers.length === 0 && searchTerm && (
          <div className="text-center py-6">
            <p className="text-gray-500 text-base">No users found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalInfoGrid;
