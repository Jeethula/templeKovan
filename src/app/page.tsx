"use client";
import Home from '@/components/Home';
import { useAuth } from './context/AuthContext';
import { use, useEffect } from 'react';

export default function HomePage() {

  const { user, loading } = useAuth();

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
    sessionStorage.setItem('user',JSON.stringify(res.user));
  }

  useEffect(() => {
    UserDetails();
  },[])

  return (
    <div>
      <Home />
    </div>

  );
}