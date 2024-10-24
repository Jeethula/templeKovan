"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../Firebase/Firebase';
import OtpLogin from './OtpLogin';
import { FcGoogle } from "react-icons/fc";
import { FaPhoneAlt } from 'react-icons/fa';
import { Button } from './ui/button';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("initial"); // Removed TypeScript syntax
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
    } catch (error) {
      console.error('Error signing in with Google', error);
      setLoading(false);
    }
  };

  const handlePhoneSignIn = () => {
    setStep("otp");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-lg p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">Welcome Back!</h1>
        {step === "initial" && (
          <div className="space-y-4">
            <Button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center px-4 py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-300"
            >
              {loading ? 'Signing in...' : 'Sign in with Google'}
              <FcGoogle size={24} className="ml-2" />
            </Button>

            <Button
              onClick={handlePhoneSignIn}
              className="w-full flex items-center justify-center px-4 py-3 font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 transition duration-300"
            >
              Sign in with Phone Number <FaPhoneAlt size={24} className="ml-2" />
            </Button>
          </div>
        )}
        {step === "otp" && (
          <div className="mt-6">
            <h2 className="text-center text-gray-700 mb-4">Enter Your Phone Number</h2>
            <OtpLogin />
            <Button
              onClick={() => setStep("initial")}
              className="mt-4 w-full flex items-center justify-center px-4 py-3 font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition duration-300"
            >
              Back to Sign in with Google
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
