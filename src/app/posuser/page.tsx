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
    console.log(sessionData);

    if (!sessionData.role || !sessionData.role.includes('posuser')) {
      router.push('/unAuthorized');
    }

    const fetchUsers = async () => {
      try {
        const res = await fetch(`/api/services/posuser/?posUserId=${userId}`);
        if (!res.ok) {
          throw new Error("Failed to fetch users.");
        }
        const data = await res.json();
        console.log(data);
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
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">POS User Search</h1>

      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Search users by name or email or phone number..."
          className="w-full p-3 border border-gray-300 rounded shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          <p>{error}</p>
        </div>
      )}

      <div className="mt-4 max-h-96 overflow-y-auto border border-gray-300 rounded shadow-lg">
        {filteredUsers.length === 0 ? (
          <p className="text-center p-4 text-gray-600">No users found.</p>
        ) : (
          filteredUsers.map((user) => (
            <div
              key={user.id}
              className="p-4 border-b cursor-pointer hover:bg-gray-100 flex items-center"
              onClick={() => handleUserClick(user)}
            >
              <div>
                {user.personalInfo ? (
                  <>
                    <p className="font-semibold">
                      {user.personalInfo.firstName} {user.personalInfo.lastName}
                    </p>
                    <p className="text-gray-600">{user.email}</p>
                  </>
                ) : (
                  <p className="text-gray-600">No personal info available</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {selectedUser && selectedUser.personalInfo && (
        <div className="mt-6 p-6 bg-white border border-gray-200 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">User Details</h2>
          <p><strong>Name:</strong> {selectedUser.personalInfo.salutation} {selectedUser.personalInfo.firstName} {selectedUser.personalInfo.lastName}</p>
          <p><strong>Phone:</strong> {selectedUser.phone}</p>
          <p><strong>Email:</strong> {selectedUser.email}</p>
          <p><strong>Address:</strong> {selectedUser.personalInfo.address1}, {selectedUser.personalInfo.address2 && `${selectedUser.personalInfo.address2},`} {selectedUser.personalInfo.city}, {selectedUser.personalInfo.state}, {selectedUser.personalInfo.country} - {selectedUser.personalInfo.pincode}</p>

          <button
            className="mt-6 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors"
            onClick={() => goToService(selectedUser.id)}
          >
            Go to Service
          </button>
        </div>
      )}
    </div>
  );
};

export default PosUserPage;