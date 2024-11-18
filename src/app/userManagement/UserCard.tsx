import React, { FC, memo } from 'react';
import { PersonalInfo } from "./types";
import { Edit2, Mail, Phone, MapPin, Users } from 'lucide-react';
import { FaWhatsapp } from "react-icons/fa";
// Helper function to capitalize first letter
const capitalizeFirst = (str: string): string => {
  return str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : '';
};

interface UserCardProps {
  user: PersonalInfo;
  onEdit: () => void;
  isLoading?: boolean;
}

export const UserCard: FC<UserCardProps> = memo(({ user, onEdit, isLoading = false }) => {
  if (isLoading) {
    return <UserCardSkeleton />;
  }
  
  const formattedUser = {
    ...user,
    firstName: user.firstName,
    lastName: (user.lastName),
    city: user.city ? capitalizeFirst(user.city) : '',
    state:user.state ? capitalizeFirst(user.state):'',
    address1: user.address1 ? capitalizeFirst(user.address1):'',
    address2: user.address2 ? capitalizeFirst(user.address2) : '',
  };

  const addressLines = [
    formattedUser.address1,
    formattedUser.address2,
    formattedUser.city && `${formattedUser.city},`,
    formattedUser.state,
    formattedUser.pincode
  ].filter(Boolean);

  return (
    <article className="bg-white border border-gray-200 rounded-lg p-5 hover:border-[#663399]/30 transition-all duration-300">
      <div className="flex justify-between items-start mb-4 relative">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {formattedUser.firstName} {formattedUser.lastName}
          </h3>
          {formattedUser.email && (
            <a href={`mailto:${formattedUser.email}`} 
               className="text-sm text-gray-500 hover:text-[#663399] transition-colors inline-flex items-center gap-2 mt-1">
              <Mail size={14} />
              {formattedUser.email.toLowerCase()}
            </a>
          )}
        </div>
        <button
          onClick={onEdit}
          aria-label={`Edit ${formattedUser.firstName}'s details`}
          className="text-gray-400 hover:text-[#663399] transition-colors p-2 rounded-md hover:bg-[#663399]/5"
        >
          <Edit2 size={18} />
        </button>
      </div>

      <div className="space-y-3 mb-4">
        {formattedUser.Phone && (
          <div className="flex items-center gap-2 text-gray-600">
            <div className="w-8 h-8 rounded-full bg-[#663399]/5 flex items-center justify-center">
              <Phone size={14} className="text-[#663399]" />
            </div>
            <div className="flex items-center gap-3">
              <a href={`tel:${formattedUser.Phone}`} 
                 className="text-sm hover:text-[#663399] transition-colors">
                {formattedUser.Phone}
              </a>
              <a href={`https://wa.me/${formattedUser.Phone.replace(/\D/g, '')}`}
                 target="_blank"
                 rel="noopener noreferrer"
                 className="text-sm hover:text-[#25D366] transition-colors"
                 title="Chat on WhatsApp">
                <FaWhatsapp size={16} className="text-[#25D366]" />
              </a>
            </div>
          </div>
        )}
        
        {addressLines.length > 0 && (
          <div className="flex gap-2">
            <div className="w-8 h-8 rounded-full bg-[#663399]/5 flex items-center justify-center flex-shrink-0">
              <MapPin size={14} className="text-[#663399]" />
            </div>
            <address className="not-italic space-y-1 text-gray-600">
              {addressLines.map((line, index) => (
                <div key={index} className="text-sm">{line}</div>
              ))}
            </address>
          </div>
        )}
      </div>

      {formattedUser.relationships && formattedUser.relationships.length > 0 && (
        <div className="pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-[#663399]/5 flex items-center justify-center">
              <Users size={14} className="text-[#663399]" />
            </div>
            <h4 className="text-sm font-medium text-gray-700">Family Members</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {formattedUser.relationships.map((relation, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs
                         bg-gray-50 text-gray-700 border border-gray-200
                         hover:border-[#663399]/20 hover:bg-[#663399]/5 
                         transition-all duration-200"
              >
                {capitalizeFirst(relation.firstName ?? '')}
                <span className="ml-1 text-gray-500">({capitalizeFirst(relation.relation ?? '')})</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </article>
  );
});

const UserCardSkeleton = () => (
  <div className="bg-white border border-gray-200 rounded-lg p-5 animate-pulse">
    <div className="flex justify-between mb-4">
      <div className="space-y-2">
        <div className="h-5 w-40 bg-gray-200 rounded"></div>
        <div className="h-4 w-32 bg-gray-200 rounded"></div>
      </div>
      <div className="h-8 w-8 bg-gray-200 rounded-md"></div>
    </div>
    <div className="space-y-3 mb-4">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
        <div className="h-4 w-24 bg-gray-200 rounded"></div>
      </div>
      <div className="flex gap-2">
        <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
        <div className="space-y-1 flex-1">
          <div className="h-4 w-full bg-gray-200 rounded"></div>
          <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
    <div className="pt-4 border-t border-gray-100">
      <div className="flex gap-2 mb-3">
        <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
        <div className="h-4 w-32 bg-gray-200 rounded"></div>
      </div>
      <div className="flex gap-2">
        <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
        <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
      </div>
    </div>
  </div>
);

UserCard.displayName = 'UserCard';