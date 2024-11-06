"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../Firebase/Firebase';
import OtpLogin from './OtpLogin';
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
      const response = await fetch('/api/auth', {
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
    } catch (error) {
      console.error('Error signing in with Google', error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#fdf0f4]">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-md border border-[#663399]/20 p-8 sm:p-10">
          <div className="text-center space-y-3 mb-8">
            <h1 className="text-3xl font-bold text-[#663399]">
              Welcome Back
            </h1>
            <p className="text-gray-700">Sign in to continue to Temple</p>
          </div>

          <div className="space-y-6">
            <OtpLogin />

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#663399]/20"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="px-2 bg-white text-gray-600">Or</span>
              </div>
            </div>

            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 h-12 bg-white hover:bg-[#fdf0f4]
                       rounded-xl border-2 border-[#663399]/20 hover:border-[#663399]/30 transition-all duration-200
                       shadow-sm hover:shadow px-4"
            >
              <FcGoogle size={22} />
              <span className="text-gray-700 font-medium">
                {loading ? "Signing in..." : "Continue with Google"}
              </span>
            </button>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-gray-700">
          By continuing, you agree to our{' '}
          <a href="#" className="font-medium text-[#663399] hover:text-[#663399]/80">Terms</a>
          {' '}and{' '}
          <a href="#" className="font-medium text-[#663399] hover:text-[#663399]/80">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
