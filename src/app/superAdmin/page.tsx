"use client"
import { useState, useEffect } from 'react';
import {  ChevronDown, Check, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import toast from 'react-hot-toast';
import { MdOutlineAdminPanelSettings } from 'react-icons/md';

// Define types
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

type Role = "admin" | "superadmin" | "user" | "posuser" | "blogAdmin"|"approver";

const AVAILABLE_ROLES: Role[] = ["admin", "superadmin", "user", "posuser", "blogAdmin","approver"];

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

  useEffect(() => {
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: editingUser.id,
          roles: selectedRoles
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedUser: UserData = await response.json();
      setUsers(users.map(user => 
        user.id === updatedUser.id ? updatedUser : user
      ));
      setEditingUser(null);
      toast.success("User roles updated successfully");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update roles';
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

  // Filter users based on search query
  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.personalInfo?.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.personalInfo?.lastName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  return (
    <div className="min-h-screen bg-[#fdf0f4]">
      <div className="container mx-auto p-4 max-w-4xl">
        <Card className="mb-6 bg-white shadow-lg border-none">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-x-2 font-bold text-[#663399]">
            <MdOutlineAdminPanelSettings size={25} /> Role Management 
            </CardTitle>
            <p className="text-sm mt-1 text-gray-600">
              Total Users: {filteredUsers.length}
            </p>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-gray-50"
              />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {paginatedUsers.map(user => (
            <Card key={user.id} className="w-full transition-all hover:shadow-md bg-white border-none">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  {/* <User className="h-5 w-5" /> */}
                  <span className="truncate">
                    {user.personalInfo?.firstName} {user.personalInfo?.lastName || '(No Name)'}
                  </span>
                </CardTitle>
                <p className="text-sm text-gray-500 truncate">{user.phone}</p>
              </CardHeader>
              <CardContent>
                {editingUser?.id === user.id ? (
                  <div className="space-y-2">
                    <div className="relative">
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full justify-between"
                        onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                      >
                        <span className="truncate">
                          {selectedRoles.length ? selectedRoles.join(', ') : 'Select roles'}
                        </span>
                        <ChevronDown className="h-4 w-4 flex-shrink-0" />
                      </Button>
                      
                      {showRoleDropdown && (
                        <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
                          {AVAILABLE_ROLES.map(role => (
                            <div
                              key={role}
                              className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
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
                        type="button"
                        className="flex-1 bg-[#663399] text-white"
                        onClick={updateRoles}
                        disabled={selectedRoles.length === 0}
                      >
                        Save
                      </Button>
                      <Button 
                        type="button"
                        variant="outline"
                        className="flex-1"
                        onClick={() => setEditingUser(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {user.role.map(role => (
                        <span
                          key={`${user.id}-${role}`}
                          className="px-2 py-1 text-sm bg-violet-100 rounded-full truncate"
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full bg-[#663399] hover:bg-violet-600 text-white font-semibold"
                      onClick={() => startEditing(user)}
                    >
                      Edit Roles
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {totalPages > 1 && (
          <PaginationControls 
            currentPage={currentPage} 
            totalPages={totalPages} 
            setCurrentPage={setCurrentPage} 
          />
        )}
      </div>
    </div>
  );
}

const PaginationControls = ({ currentPage, totalPages, setCurrentPage }: { 
  currentPage: number; 
  totalPages: number; 
  setCurrentPage: (page: number) => void 
}) => {
  const renderPageNumbers = () => {
    const pages = [];

    // First page
    pages.push(
      <PaginationItem key="1">
        <PaginationLink
          className="hidden md:block hover:bg-white/80"
          isActive={currentPage === 1}
          onClick={() => setCurrentPage(1)}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );

    // Add ellipsis after first page
    if (currentPage > 3) {
      pages.push(
        <PaginationItem key="start-ellipsis">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Current page range
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(currentPage + 1, totalPages - 1); i++) {
      pages.push(
        <PaginationItem key={i}>
          <PaginationLink
            isActive={currentPage === i}
            onClick={() => setCurrentPage(i)}
            className="hover:bg-white/80"
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Add ellipsis before last page
    if (currentPage < totalPages - 2) {
      pages.push(
        <PaginationItem key="end-ellipsis">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Last page
    if (totalPages > 1) {
      pages.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            className="hidden md:block hover:bg-white/80"
            isActive={currentPage === totalPages}
            onClick={() => setCurrentPage(totalPages)}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return pages;
  };

  return (
    <div className="mt-6 flex flex-col items-center gap-2 bg-[#fdf0f4] p-4 rounded-lg">
      <Pagination>
        <PaginationContent className="gap-1 md:gap-2">
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              className={`h-9 px-2 md:px-4 hover:bg-white/80 ${
                currentPage === 1 ? 'pointer-events-none opacity-50' : ''
              }`}
            />
          </PaginationItem>
          
          {renderPageNumbers()}

          <PaginationItem>
            <PaginationNext
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              className={`h-9 px-2 md:px-4 hover:bg-white/80 ${
                currentPage === totalPages ? 'pointer-events-none opacity-50' : ''
              }`}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      <div className="text-sm text-muted-foreground md:hidden">
        Page {currentPage} of {totalPages}
      </div>
    </div>
  );
};