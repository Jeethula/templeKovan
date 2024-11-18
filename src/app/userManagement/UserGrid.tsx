"use client";

import { useState, useCallback } from "react";
import { UserCard } from "./UserCard";
import { UserEditModal } from "./UserEditModal";
import { SearchHeader } from "./SearchHeader";
import { Pagination } from "./Pagination";
import { PersonalInfo } from "./types";

export function UserGrid({ initialUsers }: { initialUsers: PersonalInfo[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<PersonalInfo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const itemsPerPage = 20;

  // Filter users based on search
  const filteredUsers = initialUsers.filter((user) => {
    const searchValue = searchTerm.toLowerCase();
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    const phone = user.Phone?.toLowerCase() || "";
    const email = user.email?.toLowerCase() || "";
    const address = [
      user.address1,
      user.address2,
      user.city,
      user.state,
      user.pincode,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return (
      fullName.includes(searchValue) ||
      phone.includes(searchValue) ||
      email.includes(searchValue) ||
      address.includes(searchValue)
    );
  });

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentUsers = filteredUsers.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleEditClick = (user: PersonalInfo) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  // const handleModalClose = () => {
  //   setIsModalOpen(false);
  //   setSelectedUser(null);
  //   // Optionally refresh the page to get latest data
  //   window.location.reload();
  // };

  const refreshData = useCallback(() => {
    // Add your data refresh logic here
    window.location.reload(); // Or use a more elegant solution like React Query
  }, []);

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <SearchHeader
        searchTerm={searchTerm}
        onSearch={handleSearch}
        resultsCount={filteredUsers.length}
      />

      {filteredUsers.length === 0 ? (
        <div className="text-center py-12 px-4">
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm border border-gray-100 p-8">
            <div className="flex flex-col items-center">
              <svg 
                className="w-16 h-16 text-gray-300 mb-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No users found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search criteria or check the spelling
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
          {currentUsers.map((user) => (
            <UserCard
              key={user.userid}
              user={user}
              onEdit={() => handleEditClick(user)}
            />
          ))}
        </div>
      )}

      {selectedUser && (
        <UserEditModal
          user={selectedUser}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          refreshData={refreshData}
        />
      )}

      {filteredUsers.length > itemsPerPage && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
