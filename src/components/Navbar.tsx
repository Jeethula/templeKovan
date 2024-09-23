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
        <nav className="flex gap-x-6 text-gray-500 bg-white sticky top-0 z-10 h-fit lg:mt-6 p-3 w-screen xl:px-56 md:px-24 sm:px-8 px-3 ">
            {nav.map((nav, index) => (
                <Link
                    key={index}
                    href={nav.path}
                    className={`text-lg ${pathname === (nav.path) ? 'text-pink-500 font-bold' : 'text-gray-500 font-semibold'}`}
                >
                    {nav.name}
                </Link>
            ))}
        </nav>
    )
}

export default Navbar