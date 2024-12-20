"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent,DialogTitle } from "@/components/ui/dialog";
import DetailsModal from "../../components/posusermodals/DetailsModal";
import { LucideUsers2 } from "lucide-react";

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

const SkeletonUserCard = () => (
  <div className="p-4 border-b border-gray-100 flex items-center space-x-4 animate-pulse">
    <div className="flex-shrink-0">
      <div className="w-12 h-12 rounded-full bg-gray-200" />
    </div>
    <div className="flex-grow">
      <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
      <div className="h-3 bg-gray-200 rounded w-1/4" />
    </div>
  </div>
);

const UserDetailsModal = ({ user, showDetailsModal, setShowDetailsModal, goToService,goToEvents }: {
  user: User;
  showDetailsModal: boolean;
  setShowDetailsModal: (show: boolean) => void;
  goToService: (userId: string) => void;
  goToEvents: (userId: string) => void;
}) => {
  const [showContributionModal, setShowContributionModal] = useState(false);

  if (!user.personalInfo) return null;

  return (
    <>
      <Dialog 
        open={showDetailsModal} 
        onOpenChange={(open) => !open && setShowDetailsModal(false)}
      >
        <DialogContent className="sm:max-w-[500px]">
          <div className="p-2 sm:p-3">
        <DialogTitle className="text-xl font-semibold mb-4 text-gray-900">User Details</DialogTitle>
        <div className="space-y-3">
          <div className="grid grid-cols-1 gap-3">
            <div className="border-b border-gray-100 pb-2">
          <p className="text-sm text-gray-500">Full Name</p>
          <p className="text-gray-900 break-words">
            {user.personalInfo.salutation} {user.personalInfo.firstName} {user.personalInfo.lastName}
          </p>
            </div>
            <div className="border-b border-gray-100 pb-2">
          <p className="text-sm text-gray-500">Phone</p>
          <p className="text-gray-900">{user.phone}</p>
            </div>
            <div className="border-b border-gray-100 pb-2">
          <p className="text-sm text-gray-500">Email</p>
          <p className="text-gray-900 break-words">{user.email}</p>
            </div>
            <div className="border-b border-gray-100 pb-2">
          <p className="text-sm text-gray-500">Address</p>
          <p className="text-gray-900 break-words">
            {user.personalInfo.address1}
            {user.personalInfo.address2 && <>, {user.personalInfo.address2}</>}
            {`, ${user.personalInfo.city}, ${user.personalInfo.state}`}
            {`, ${user.personalInfo.country} - ${user.personalInfo.pincode}`}
          </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
            <div className="w-full sm:w-1/3">
          <button
            className="w-full bg-[#663399] text-white font-medium py-2 px-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm text-sm"
            onClick={() => setShowContributionModal(true)}
          >
            Contribution
          </button>
            </div>
            <div className="flex w-full gap-2 sm:w-2/3">
              <button
          className="w-full bg-[#663399] text-white font-medium py-2 px-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm text-sm"
          onClick={() => goToService(user.id)}
              >
          Services
              </button>
              <button
          className="w-full bg-[#663399] text-white font-medium py-2 px-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm text-sm"
          onClick={() => goToEvents(user.id)}
              >
          Events
              </button>
            </div>
          </div>
        </div>
          </div>
        </DialogContent>
      </Dialog>

      {showContributionModal && (
        <Dialog 
          open={showContributionModal} 
          onOpenChange={(open) => !open && setShowContributionModal(false)}
        >
          <DialogContent className="sm:max-w-[500px]">
            <DetailsModal
              serviceName={"Contribution"}
              date={new Date()}
              userId={user.id}
              nameOfTheServiceId={"cm39vec3p0000ooi3pkdquuov"}
              minAmount={0}
              onSubmitSuccess={() => {
                setShowContributionModal(false);
                setShowDetailsModal(false);
              }}
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

const PosUserPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
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
      setIsLoading(true);
      try {
        const res = await fetch(`/api/services/posuser/?posUserId=${userId}`);
        if (!res.ok) {
          throw new Error("Failed to fetch users.");
        }
        const data = await res.json();
        setUsers(data.users);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setIsLoading(false);
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
    setShowDetailsModal(true);
  };

  const goToService = (userId: string) => {
    router.push(`/posuser/services/${userId}`);
  };

  const goToEvents = (userId: string) => {
    router.push(`/posuser/specialevents/${userId}`);
  };

  return (
    <div className="min-h-screen bg-[#fdf0f4] py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col gap-y-2 bg-white p-4 mb-5 rounded-lg">
        <h1 className="text-xl flex gap-x-2 items-center font-semibold text-[#663399] ">
         <LucideUsers2 size={20} /> POS 
        </h1>
        <div className="relative mb-3">
          <input
            type="text"
            placeholder="Search users by name, email, or phone number..."
            className="w-full p-2 pl-12 border border-gray-300 rounded-lg 
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none
                     bg-white shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={isLoading}
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
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 mb-6 rounded-lg">
            <p>{error}</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
              [...Array(5)].map((_, i) => <SkeletonUserCard key={i} />)
            ) : filteredUsers.length === 0 ? (
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

        {selectedUser && (
          <UserDetailsModal 
            user={selectedUser}
            showDetailsModal={showDetailsModal}
            setShowDetailsModal={setShowDetailsModal}
            goToService={goToService}
            goToEvents={goToEvents}
          />
        )}
      </div>
    </div>
  );
};

export default PosUserPage;
