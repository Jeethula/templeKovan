"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../app/context/AuthContext';
import { FaBars, FaSignOutAlt, FaTimes } from 'react-icons/fa';
import TranslateComponent from './TranslateComponent';
import { useState } from 'react';

const Navbar = () => {
  const pathname = usePathname();
  const { role, signOut } = useAuth(); 
  
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
  };


  
  const nav = [
    { name: 'Home', path: '/' },
    { name: 'Profile', path: '/profile' },
    { name: 'Blog', path: '/blog' },
  ];

  const dropdownItems = [
    { name: 'Services', path: '/services' },
    { name: 'Add Profile', path: '/add' },
    ...(role.includes('Admin') ? [{ name: 'User Management', path: '/userManagement' }] : []),
    ...(role.includes('approver') ? [{ name: 'Service Management', path: '/serviceManagement' }] : []),
    ...(role.includes('posuser') ? [{ name: 'POS User', path: '/posuser' }] : []),
    ...(role.includes('approver') ? [{ name: 'Service Limit', path: '/servicelimit' }] : []),
  ];

  return (
    <nav className="top-0 z-10 sticky flex flex-wrap justify-between items-center bg-[#663399] px-3 sm:px-8 md:px-24 xl:px-56 py-1 lg:p-3 max-w-screen h-fit text-white">
      <div className="flex items-center space-x-4">
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="font-semibold text-xl hover:text-orange-400 transition-colors duration-100"
          >
            {isDropdownOpen ? <FaTimes /> : <FaBars />}
          </button>
          {isDropdownOpen && (
            <div className="left-0 z-12 absolute bg-white shadow-lg mt-3 rounded-md w-48">
              {dropdownItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.path}
                  className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${
                    pathname === item.path || pathname.startsWith(item.path + '/')
                      ? 'text-orange-400 font-semibold'
                      : 'hover:bg-gray-200 font-semibold'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <div className='p-3'><TranslateComponent /></div>
            </div>

          )}
        </div>
        {nav.map((navItem, index) => (
          <Link
            key={index}
            href={navItem.path}
            className={`text-lg transition-colors duration-100 ${
              pathname === navItem.path || pathname.startsWith(navItem.path + '/')
                ? 'text-orange-400 font-semibold'
                : 'hover:text-orange-400 font-semibold'
            }`}
          >
            {navItem.name}
          </Link>
        ))}
      </div>
      <button
        onClick={handleSignOut}
        className="flex items-center gap-x-2 bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-white"
      >
        Sign Out <FaSignOutAlt />
      </button>
    </nav>
  );
};

export default Navbar;
