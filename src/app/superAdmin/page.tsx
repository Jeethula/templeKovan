"use client"
import { useState, useEffect, Fragment } from 'react';
import {  ChevronDown, Check, Search, Phone, Edit, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import toast from 'react-hot-toast';
import { MdOutlineAdminPanelSettings } from 'react-icons/md';
import { useRouter } from 'next/navigation';

interface PersonalInfo {
  firstName?: string;
  lastName?: string;
}

interface UserData {
  id: string;
  email: string;
  role: string[];
  personalInfo?: PersonalInfo;
  phone?: string;
}

type Role = "Admin" | "superadmin" | "user" | "posuser" | "blogAdmin"|"approver";

const AVAILABLE_ROLES: Role[] = ["Admin", "superadmin", "user", "posuser", "blogAdmin","approver"];

// Add this helper function at the top of your component
const capitalizeFirstLetter = (str?: string) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Add this helper function
const formatFullName = (personalInfo?: PersonalInfo): string | null => {
  if (!personalInfo?.firstName && !personalInfo?.lastName) {
    return null;
  }
  
  const firstName = personalInfo.firstName ? capitalizeFirstLetter(personalInfo.firstName) : '';
  const lastName = personalInfo.lastName ? capitalizeFirstLetter(personalInfo.lastName) : '';
  
  return `${firstName} ${lastName}`.trim();
};

export default function RoleManagementPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [selectedRoles, setSelectedRoles] = useState<Role[]>([]);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const router = useRouter();

  useEffect(() => {
    const sessionData = JSON.parse(sessionStorage.getItem('user') || '{}');
    if (!sessionData.role?.includes('superadmin')) {
      router.push('/unAuthorized');
    }
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/roles');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setUsers(data);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch users';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (user: UserData) => {
    setEditingUser(user);
    setSelectedRoles(user.role as Role[]);
    setShowRoleDropdown(false);
  };

  const updateRoles = async () => {
    if (!editingUser) return;

    try {
      const response = await fetch('/api/admin/roles', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          userId: editingUser.id,
          roles: selectedRoles
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (!data) {
        throw new Error('No data received');
      }

      setUsers(users.map(user => 
        user.id === data.id ? data : user
      ));
      setEditingUser(null);
      toast.success("User roles updated successfully");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update roles';
      console.error('Update roles error:', errorMessage);
      toast.error(errorMessage);
    }
  };

  const toggleRole = (role: Role) => {
    setSelectedRoles(current => 
      current.includes(role)
        ? current.filter(r => r !== role)
        : [...current, role]
    );
  };

  // Update the filtering logic
  const filteredUsers = users.filter(user => {
    // First check if user has a name
    const hasName = user.personalInfo?.firstName || user.personalInfo?.lastName;
    if (!hasName) return false;
    
    // Then apply search filter
    return user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.personalInfo?.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.personalInfo?.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Skeleton loading component
  const UserSkeleton = () => (
    <Card className="w-full animate-pulse">
      <CardHeader className="pb-2">
        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mt-2"></div>
      </CardHeader>
      <CardContent>
        <div className="h-8 bg-gray-200 rounded w-full mt-2"></div>
      </CardContent>
    </Card>
  );

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Card className="p-4">
          <CardContent>
            <p className="text-red-500">Error: {error}</p>
            <Button onClick={fetchUsers} className="mt-4">Retry</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto p-4 max-w-4xl">
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <UserSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  // Update the main container styles
  return (
    <div className="min-h-screen bg-[#fdf0f4]">
      <div className="container mx-auto p-2 sm:p-4 max-w-4xl">
        {/* Header Card */}
        <Card className="mb-4 sm:mb-6 bg-white shadow-lg border-none">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl flex items-center gap-x-2 font-bold text-[#663399]">
              <MdOutlineAdminPanelSettings className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="truncate">Role Management</span>
            </CardTitle>
            <p className="text-xs sm:text-sm mt-1 text-gray-600">
              Total Users: {filteredUsers.length}
            </p>
          </CardHeader>
          <CardContent className="p-3 sm:p-6">
            <div className="relative">
              <Search className="absolute left-2 sm:left-3 top-2.5 sm:top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 sm:pl-9 bg-gray-50 text-sm"
              />
            </div>
          </CardContent>
        </Card>

        {/* No users found message */}
        {filteredUsers.length === 0 ? (
          <Card className="w-full bg-white shadow-lg border-none">
            <CardContent className="p-8 flex flex-col items-center justify-center">
              <Search className="h-12 w-12 text-gray-400 mb-4" />
              <p className="text-lg text-gray-600">No users found</p>
              <p className="text-sm text-gray-400 mt-2">Try adjusting your search criteria</p>
            </CardContent>
          </Card>
        ) : (
          // Existing user cards list with modified name display
          <div className="space-y-3 sm:space-y-4">
            {paginatedUsers.map(user => (
              <Card key={user.id} className="w-full transition-all hover:shadow-md bg-white border-none">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex flex-col space-y-2">
                    {/* Header with name and edit icon */}
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-base sm:text-lg font-medium">
                          {formatFullName(user.personalInfo) || user.email}
                        </h3>
                        <div className="flex items-center gap-1 mt-1">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <p className="text-xs sm:text-sm text-gray-500 truncate">{user.phone}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => startEditing(user)}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                        aria-label="Edit roles"
                      >
                        <Edit className="h-4 w-4 text-[#663399]" />
                      </button>
                    </div>

                    {/* Role editing section */}
                    {editingUser?.id === user.id ? (
                      <div className="space-y-2 mt-2">
                        <div className="relative">
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full justify-between text-sm"
                            onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                          >
                            <span className="truncate">
                              {selectedRoles.length ? selectedRoles.join(', ') : 'Select roles'}
                            </span>
                            <ChevronDown className="h-4 w-4 flex-shrink-0 ml-2" />
                          </Button>
                          
                          {showRoleDropdown && (
                            <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-48 overflow-y-auto">
                              {AVAILABLE_ROLES.map(role => (
                                <div
                                  key={role}
                                  className="flex items-center px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                                  onClick={() => toggleRole(role)}
                                >
                                  <div className="flex-1">{role}</div>
                                  {selectedRoles.includes(role) && (
                                    <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex gap-2">
                          <Button 
                            onClick={updateRoles}
                            className="flex-1 bg-[#663399] text-white text-sm"
                            disabled={selectedRoles.length === 0}
                          >
                            Save
                          </Button>
                          <Button 
                            onClick={() => setEditingUser(null)}
                            variant="outline"
                            className="flex-1 text-sm"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {user.role.map(role => (
                          <span
                            key={`${user.id}-${role}`}
                            className="px-2 py-0.5 text-xs sm:text-sm bg-violet-100 rounded-full truncate"
                          >
                            {role}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Simplified Pagination */}
        {totalPages > 1 && (
          <div className="mt-4 flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(page => {
                  if (totalPages <= 5) return true;
                  if (page === 1 || page === totalPages) return true;
                  if (Math.abs(currentPage - page) <= 1) return true;
                  return false;
                })
                .map((page, i, arr) => (
                  <Fragment key={page}>
                    {i > 0 && arr[i - 1] !== page - 1 && (
                      <span className="text-gray-400">...</span>
                    )}
                    <Button
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className={`h-8 w-8 p-0 ${
                        currentPage === page ? "bg-[#663399] text-white" : ""
                      }`}
                    >
                      {page}
                    </Button>
                  </Fragment>
                ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

