"use client";
import { useAuth } from "./AuthContext";
import Login from "../../components/Login";
import OtpLogin from "../../components/OtpLogin";
import { useState } from "react";

export default function AuthWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const [loginMethod, setLoginMethod] = useState<"google" | "otp">("google");

  if (loading) {
    return (
      <div className="bg-[#fdf0f4] w-full h-full min-w-screen min-h-screen flex justify-center items-center">
        <svg
          className="animate-spin -ml-1 mr-3 h-5 w-5 balck"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <div className="text-xl font-bold  text-black ">
          loading...
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div>
        {loginMethod === "google" ? (
            <Login />

        ) : (
          <OtpLogin />
        )}
      </div>
    );
  }

  return <>{children}</>;
}
