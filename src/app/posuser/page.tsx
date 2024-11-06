"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface PersonalInfo {
  id: string;
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  avatarUrl?: string;
  salutation?: string;
}

interface User {
  id: string;
  phone: string;
  email: string;
  personalInfo: PersonalInfo | null;
}

const PosUserPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const userSession = JSON.parse(sessionStorage.getItem('user') || '{}');
  const userId = userSession.id;

  useEffect(() => {
    const sessionData = JSON.parse(sessionStorage.getItem('user') || '{}');
    if (!sessionData.role || !sessionData.role.includes('posuser')) {
      router.push('/unAuthorized');
      return;
    }
    const fetchUsers = async () => {
      try {
        const res = await fetch(`/api/services/posuser/?posUserId=${userId}`);
        if (!res.ok) {
          throw new Error("Failed to fetch users.");
        }
        const data = await res.json();
        setUsers(data.users);
      } catch (error) {
        setError((error as Error).message);
      }
    };
    fetchUsers();
  }, [userId, router]);

  const filteredUsers = users.filter((user) => {
    const personalInfo = user.personalInfo;
    if (!personalInfo) return false;
    return (
      `${personalInfo.firstName} ${personalInfo.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
  };

  const goToService = (userId: string) => {
    router.push(`/posuser/services/${userId}`);
  };

  return (
    <div className="min-h-screen bg-[#fdf0f4] py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          POS User Search
        </h1>

        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search users by name, email, or phone number..."
            className="w-full p-4 pl-12 border border-gray-300 rounded-lg 
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none
                     bg-white shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg
            className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 mb-6 rounded-lg">
            <p>{error}</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="max-h-96 overflow-y-auto">
            {filteredUsers.length === 0 ? (
              <p className="text-center p-6 text-gray-600">No users found.</p>
            ) : (
              filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="p-4 border-b border-gray-100 cursor-pointer 
                           hover:bg-gray-50 transition-colors duration-200
                           flex items-center space-x-4"
                  onClick={() => handleUserClick(user)}
                >
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-blue-100 
                                  flex items-center justify-center text-blue-600 font-medium">
                      {user.personalInfo?.firstName?.[0]}
                    </div>
                  </div>
                  <div className="flex-grow">
                    {user.personalInfo ? (
                      <>
                        <p className="font-medium text-gray-900">
                          {user.personalInfo.firstName} {user.personalInfo.lastName}
                        </p>
                        <p className="text-gray-600 text-sm">{user.email}</p>
                      </>
                    ) : (
                      <p className="text-gray-600">No personal info available</p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {selectedUser && selectedUser.personalInfo && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">User Details</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border-b border-gray-100 pb-2">
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="text-gray-900">
                    {selectedUser.personalInfo.salutation} {selectedUser.personalInfo.firstName} {selectedUser.personalInfo.lastName}
                  </p>
                </div>
                <div className="border-b border-gray-100 pb-2">
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="text-gray-900">{selectedUser.phone}</p>
                </div>
                <div className="border-b border-gray-100 pb-2">
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-gray-900">{selectedUser.email}</p>
                </div>
                <div className="border-b border-gray-100 pb-2">
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="text-gray-900">
                    {selectedUser.personalInfo.address1}
                    {selectedUser.personalInfo.address2 && <>, {selectedUser.personalInfo.address2}</>}
                    {`, ${selectedUser.personalInfo.city}, ${selectedUser.personalInfo.state}`}
                    {`, ${selectedUser.personalInfo.country} - ${selectedUser.personalInfo.pincode}`}
                  </p>
                </div>
              </div>
              <button
                className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white 
                         font-medium py-2 px-4 rounded-lg transition-colors 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 
                         focus:ring-offset-2 shadow-sm"
                onClick={() => goToService(selectedUser.id)}
              >
                Go to Service
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PosUserPage;
