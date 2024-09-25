"use client";
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { signOut } from 'firebase/auth';
import { auth } from '../Firebase/Firebase';
import { FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
    const pathname = usePathname();
    const [role, setRole] = useState<string | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleSignOut = async () => {
      try {
        await signOut(auth);
      } catch (error) {
        console.error('Error signing out', error);
      }
    };

  useEffect(() => {
    const user = sessionStorage.getItem("user");
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        setRole(parsedUser.role);
      } catch (error) {
        console.error("Error parsing user from session storage:", error);
      }
    }
  }, []);

  const nav = [
    { name: 'Home', path: '/' },
    { name: 'Profile', path: '/profile' },
    { name: 'Blog', path: '/blog' },
  ];

  const dropdownItems = [
    { name: 'Add Profile', path: '/add' },
    ...(role === "Admin" ? [{ name: 'User Management', path: '/userManagement' }] : [])
  ];
  
    return (
<nav className="flex flex-wrap items-center justify-between text-white bg-[#663399] sticky top-0 z-10 h-fit lg:p-3 w-screen xl:px-56 md:px-24 sm:px-8 px-3 py-1">
  <div className="flex items-center space-x-4">
    <div className="relative md:hidden">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="text-lg transition-colors duration-100 hover:text-orange-400 font-semibold"
      >
        {isDropdownOpen ? <FaTimes /> : <FaBars />}
      </button>
      {isDropdownOpen && (
        <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
          {dropdownItems.map((item, index) => (
            <Link
              key={index}
              href={item.path}
              className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${
                pathname === item.path || pathname.startsWith(item.path + '/')
                  ? 'bg-gray-100'
                  : ''
              }`}
            >
              {item.name}
            </Link>
          ))}
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
    <div className="hidden md:flex items-center space-x-4">
      {dropdownItems.map((item, index) => (
        <Link
          key={index}
          href={item.path}
          className={`text-lg transition-colors duration-100 ${
            pathname === item.path || pathname.startsWith(item.path + '/')
              ? 'text-orange-400 font-semibold'
              : 'hover:text-orange-400 font-semibold'
          }`}
        >
          {item.name}
        </Link>
      ))}
    </div>
  </div>
  <button
    onClick={handleSignOut}
    className="px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600"
  >
    Sign Out
  </button>
</nav>
    )
}

export default Navbar;