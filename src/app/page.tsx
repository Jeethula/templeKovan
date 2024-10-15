"use client";
import { useAuth } from './context/AuthContext';
import { useEffect } from 'react';
import Image from 'next/image';
import { FaOm } from 'react-icons/fa';

export default function HomePage() {

  const { user } = useAuth();

 const UserDetails = async () => {
    const data = await fetch('/api/auth',{
      method:'POST',
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify({
        email:user?.email
    })
    })
    const res = await data.json();
    console.log(res,"from page");
    sessionStorage.setItem('user',JSON.stringify(res.user));
  }

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        await UserDetails();
        const userFromStorage = sessionStorage.getItem('user');
        if (!userFromStorage) {
          console.log("User not found in session storage");
          window.location.href = '/';
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
        window.location.href = '/';
      }
    };

    fetchUserDetails();
  }, []);

  return (
    <div className='bg-[#fdf0f4] w-full h-full min-w-screen min-h-screen flex flex-col items-center justify-center'>
      {/* {sessionStorage.getItem('user') !== null && <Home />} */}
      <h1 className='text-2xl font-semibold text-red-600 flex items-center gap-x-3  text-center'><FaOm />Om Namo Narayanaya</h1>
      <Image
      src="https://i.pinimg.com/564x/7b/1b/a2/7b1ba2acc23dad08b6a3e793b95e1482.jpg"
    alt="image"
    width={500}
    height={400}
    className=' aspect-auto mb-5 p-5 rounded-xl'
  />    
  </div>

  );
}