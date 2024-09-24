"use client";
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

const Navbar = () => {
    const pathname = usePathname();
    const [role, setRole] = useState<string | null>(null);

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
    { name: 'Add Profile', path: '/add' },
    ...(role === "Admin" ? [{ name: 'User Management', path: '/userManagement' }] : [])
  ];
  
    return (
<nav className="flex gap-x-6 text-black bg-gradient-to-r from-yellow-300 to-yellow-400 sticky top-0 z-10 h-fit lg:p-3 w-screen xl:px-56 md:px-24 sm:px-8 px-3">
{nav.map((nav, index) => (
                <Link
                    key={index}
                    href={nav.path}
                    className={`text-lg transition-colors duration-100 ${pathname === (nav.path) ? ' text-red-600 font-semibold' : 'hover:text-gray-600 font-semibold'}`}
                >
                    {nav.name}
                </Link>
            ))}
        </nav>
    )
}

export default Navbar