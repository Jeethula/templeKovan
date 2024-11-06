"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../app/context/AuthContext';
import { useState, useEffect } from 'react';
import { FaBars, FaHome, FaUser, FaBlog, FaCog, FaSignOutAlt, FaTimes } from 'react-icons/fa';
import TranslateComponent from './TranslateComponent';

const Navbar = () => {
  const pathname = usePathname();
  const { role, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    setIsOpen(false);
    await signOut();
  };

  const mainNav = [
    { name: 'Home', path: '/', icon: <FaHome className="text-lg" /> },
    { name: 'Profile', path: '/profile', icon: <FaUser className="text-lg" /> },
    { name: 'Blog', path: '/blog', icon: <FaBlog className="text-lg" /> },
  ];

  const menuItems = [
    { name: 'Services', path: '/services', icon: <FaCog className="text-lg" /> },
    { name: 'Add Profile', path: '/add', icon: <FaUser className="text-lg" /> },
    ...(role.includes('Admin') ? [{ name: 'User Management', path: '/userManagement', icon: <FaUser className="text-lg" /> }] : []),
    ...(role.includes('approver') ? [
      { name: 'Service Management', path: '/serviceManagement', icon: <FaCog className="text-lg" /> },
      { name: 'Service Limit', path: '/servicelimit', icon: <FaCog className="text-lg" /> }
    ] : []),
    ...(role.includes('posuser') ? [{ name: 'POS User', path: '/posuser', icon: <FaCog className="text-lg" /> }] : []),
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 
        ${scrolled ? 'bg-[#663399] shadow-md' : 'bg-[#663399]'}`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-full hover:bg-[#663399]/80 transition-colors duration-200"
            >
              {isOpen ? 
                <FaTimes className="text-xl text-white" /> : 
                <FaBars className="text-xl text-white" />
              }
            </button>

            <div className="flex-shrink-0">
              <span className="text-2xl font-bold text-white">
                Sri Renuka Akkama Temple
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setIsOpen(false)} />
      )}

      {/* Mobile Menu Drawer - changed to left side */}
      <div className={`fixed top-0 left-0 h-full w-80 bg-[#fdf0f4] z-50 shadow-2xl transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* User Profile Section */}
          <div className="p-6 bg-[#663399]">
            <div className="text-white">
              <div className="text-xl font-semibold mb-2">Welcome</div>
              <div className="text-sm opacity-90">Your Temple Account</div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="flex-1 overflow-y-auto py-4">
            <div className="px-4 py-2">
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Main Menu
              </div>
              {mainNav.map((item, index) => (
                <Link
                  key={index}
                  href={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg mb-1
                    ${pathname === item.path ? 
                      'bg-[#663399]/10 text-[#663399] font-medium' : 
                      'text-gray-700 hover:bg-[#663399]/10'}`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>

            {menuItems.length > 0 && (
              <div className="px-4 py-2 border-t border-[#663399]/20">
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Additional Features
                </div>
                {menuItems.map((item, index) => (
                  <Link
                    key={index}
                    href={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg mb-1
                      ${pathname === item.path ? 
                        'bg-[#663399]/10 text-[#663399] font-medium' : 
                        'text-gray-700 hover:bg-[#663399]/10'}`}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                ))}
              </div>
            )}

            {/* Translation Component */}
            <div className="px-8 py-4 border-t border-[#663399]/20">
              <TranslateComponent />
            </div>
          </div>

          {/* Sign Out Button */}
          <button
            onClick={handleSignOut}
            className="flex items-center justify-center space-x-2 w-full p-4 bg-red-50 text-red-600 hover:bg-red-100 transition-colors duration-200"
          >
            <FaSignOutAlt />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Content Spacer */}
      <div className="h-16" />
    </>
  );
};

export default Navbar;
