"use client";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../app/context/AuthContext';
import { useState, useEffect } from 'react';
import { FaBars, FaSearch, FaSignOutAlt, FaTimes } from 'react-icons/fa';
import {  BookDown, Calendar, House, LucideUserCheck2, LucideUserCog2, LucideUsers2, Settings, UserRound, UserRoundPlus } from 'lucide-react';
import { CgArrowsExchangeAlt } from "react-icons/cg";
import { RiMoneyRupeeCircleLine } from "react-icons/ri";
import { PiHandsPrayingBold} from 'react-icons/pi';
import { HiOutlineSpeakerphone } from 'react-icons/hi';
import { MdOutlineAdminPanelSettings, MdOutlineEditCalendar, MdOutlineTempleHindu } from 'react-icons/md';

const SearchNav = () => {
  const pathname = usePathname();
  const { role, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  interface SearchResult {
    url: string;
    label: string;
    type: string;
    data: any;
  }
  
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showPopover, setShowPopover] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    
    // Clear results and hide popover if query is empty
    if (!query.trim()) {
      setSearchResults([]);
      setShowPopover(false);
      return;
    }
  
    setIsLoading(true);
    try {
      const response = await fetch(`/api/search?query=${query}`);
      const data = await response.json();
      
      if (data?.results?.length > 0) {
        setSearchResults(data.results);
        setShowPopover(true);
      } else {
        setSearchResults([]);
        setShowPopover(false);
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
      setSearchResults([]);
      setShowPopover(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    setIsOpen(false);
    await signOut();
  };

  const handleAnnouncement = async () => {
    router.push('/blog');
  }

  const mainNav = [
    { name: 'Home', path: '/', icon: <House className="text-lg" /> },
    { name: `Seva`, path: '/services', icon: <PiHandsPrayingBold  size={23} className="text-lg " /> },
    { name: 'Special Events',path:'/special',icon:<MdOutlineTempleHindu className='text-lg' size={23}/>},
    { name: 'Profile', path: '/profile', icon: <UserRound className="text-lg" /> },
    { name: 'Announcements', path: '/blog', icon: <HiOutlineSpeakerphone className="text-lg" size={23} stroke='black' /> },
    {name:'Contribution',path:'/contributions',icon:<RiMoneyRupeeCircleLine className="text-lg" size={23}  />},
  ];

  const menuItems = [
    { name: 'Transactions', path: '/transactions', icon: <CgArrowsExchangeAlt className="text-lg" size={25} /> },
    { name: 'Add Profile', path: '/add', icon: <UserRoundPlus className="text-lg" /> },
    ...(role.includes('Admin') ? [
      { name: 'User Management', path: '/userManagement', icon: <LucideUserCog2  className="text-lg" /> },
      { name: 'Seva Configuration  ', path: '/addSevas', icon: <Settings  className="text-lg" /> },
      { name: 'Special Events Configuration',path:'/specialManage',icon:<MdOutlineEditCalendar className='text-lg' size={23}/>},
      { name: 'Reports', path: '/reports', icon: <BookDown  className="text-lg"  /> },
    ] : []),
    ...(role.includes('superadmin') ? [
      { name: 'Super Admin', path: '/superAdmin', icon: <MdOutlineAdminPanelSettings size={23} className="text-lg" /> },
    ] : []),
    ...(role.includes('approver') ? [
      { name: 'Seva Management', path: '/serviceManagement', icon: <LucideUserCheck2  className="text-lg" /> },
    ] : []),
    ...(role.includes('posuser') ? [{ name: 'POS', path: '/posuser', icon: <LucideUsers2  className="text-lg" /> }] : []),
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

            <div className="relative w-full max-w-md mx-auto">
            <div className="flex items-center">
              <FaSearch className="absolute ml-3 text-gray-500" />
              <input
                type="text"
                className="w-full pl-10 pr-3 py-2 rounded-md"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            {showPopover && searchResults.length > 0 && (
              <div className="absolute w-full bg-white border rounded-md mt-1 z-10 shadow-lg">
                <div className="max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  {searchResults.map((result, index) => (
                    <Link 
                      href={result.url} 
                      key={index} 
                      className="block p-3 hover:bg-gray-100 border-b last:border-b-0"
                      onClick={() => {
                        setShowPopover(false);
                        setSearchQuery('');
                      }}
                    >
                      <div className="text-sm font-medium text-gray-800">
                        {result.label}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {result.type} {index + 1}/{searchResults.length}
                      </div>
                    </Link>
                  ))}
                  {isLoading && (
                    <div className="p-3 text-center text-sm text-gray-500">
                      Searching...
                    </div>
                  )}
                </div>
                <div className="p-2 text-center text-xs text-gray-500 bg-gray-50 border-t">
                  Total results: {searchResults.length}
                </div>
              </div>
            )}
              </div>

            <div className="flex-shrink-0" onClick={handleAnnouncement}>
              <span className="text-2xl font-bold text-white">
              {/* <HiOutlineSpeakerphone /> */}
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
              <div className="text-xl font-semibold mb-2">
                Welcome</div>
              <div className='flex justify-between items-center ' >
               <div className="text-sm opacity-90">Your Temple Account</div> 
                <h2 className='font-normal flex gap-x-2 items-center'><Calendar size={15} /> {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</h2>

              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="flex-1 overflow-y-auto py-4">
            <div className="px-2 py-2"> {/* Reduced from px-4 */}
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Main Menu
              </div>
              {mainNav.map((item, index) => (
                <Link
                  key={index}
                  href={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center space-x-3 px-2 py-3 rounded-lg mb-1 
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
              <div className="px-2 py-2 border-t border-[#663399]/20"> {/* Reduced from px-4 */}
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Additional Features
                </div>
                {menuItems.map((item, index) => (
                  <Link
                    key={index}
                    href={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center space-x-3 px-3 py-3 rounded-lg mb-1
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
              {/* <TranslateComponent /> */}
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

export default SearchNav;
