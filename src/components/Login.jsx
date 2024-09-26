"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../Firebase/Firebase';
import Image from 'next/image';
import { FcGoogle } from "react-icons/fc";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        handleUserAuth(user);
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleUserAuth = async (user) => {
    try {
      const response = await fetch('/api/auth/google-signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.email,
          phoneNumber: user.phoneNumber,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to authenticate user');
      }

      const userData = await response.json();
      console.log('User data:', userData);

      router.push('/');
    } catch (error) {
      console.error('Error authenticating user:', error);
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithPopup(auth, provider);
      // The useEffect hook will handle the rest
    } catch (error) {
      console.error('Error signing in with Google', error);
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#fdf0f4] p-4">
      <div className="relative w-full max-w-md p-6 h-[500px] bg-white rounded-lg shadow-lg">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://thumbs.dreamstime.com/b/indian-temple-3396438.jpg?w=768"
            alt="Indian Temple"
            layout="fill"
            objectFit="cover"
            className="rounded-lg opacity-50"
          />
        </div> 
        <div className="relative z-10 flex h-full w p-4 flex-col items-center justify-end  gap-y-3">
          {/* <h1 className="mb-4 text-2xl text-center text-yellow-400 font-semibold bg-red-500 w-fit h-fit p-2 rounded-md">Welcome</h1> */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full px-4 py-2 font-semibold text-white bg-[#663399] flex items-center gap-x-2 justify-center rounded hover:bg-[#522a7a] disabled:bg-[#9f86c0]"
          >
            {loading ? 'Signing in...' : 'Sign in with Google'}  <FcGoogle size={20} /> 
          </button>
        </div>

      </div>
    </div>
  );
};

export default Login;