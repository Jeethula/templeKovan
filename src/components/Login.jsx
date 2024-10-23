"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../Firebase/Firebase';
import OtpLogin from './OtpLogin'; // Import the OTP login component
import Image from 'next/image';
import { FcGoogle } from "react-icons/fc";
import { FaPhoneAlt } from 'react-icons/fa';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [isOtpLogin, setIsOtpLogin] = useState(false); // Track whether to show OTP login or Google login
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
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="relative w-full max-w-fit p-6 bg-white rounded-lg shadow-lg">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://thumbs.dreamstime.com/b/indian-temple-3396438.jpg?w=768"
            alt="Indian Temple"
            layout="fill"
            objectFit="cover"
            className="rounded-lg opacity-50"
          />
        </div>
        <div className="relative z-10 flex h-full w-full p-5 bg-white rounded-lg flex-col gap-y-3 ">
            <button
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full px-4 py-3 font-semibold text-white bg-blue-600 flex items-center gap-x-2 justify-center rounded hover:bg-blue-700 disabled:bg-blue-400"
              >
                {loading ? 'Signing in...' : 'Sign in with Google'}  <FcGoogle size={20} />
              </button>
              <div className='flex flex-col items-center gap-y-2 text-gray-500 justify-center'>
              <h1>or</h1>
              <div className='w-full h-[1px] '></div>
              <h1 className='flex items-center gap-x-2'>Sign in with Phone number <FaPhoneAlt size={16} /></h1>
              </div>
              <div className='mt-4 w-fit mx-auto'>
                <OtpLogin /> 
              </div>

        </div>
      </div>
    </div>
  );
};

export default Login;