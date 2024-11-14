"use client";
import React, { useState, useRef, useEffect } from "react";
// import { customFetch } from "@/lib/fetch";
import { useRouter } from "next/navigation";
import { useAuth } from "../app/context/AuthContext";
import { User } from "firebase/auth";

const OtpInput = ({
  length,
  value,
  onChange,
}: {
  length: number;
  value: string;
  onChange: (value: string) => void;
}) => {
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (inputs.current[0]) {
      inputs.current[0].focus();
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const newValue = e.target.value;
    if (newValue.length <= 1) {
      const newOtp = value.split("");
      newOtp[index] = newValue;
      onChange(newOtp.join(""));
      if (newValue.length === 1 && index < length - 1) {
        inputs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !value[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex justify-center gap-3">
      {[...Array(length)].map((_, index) => (
        <input
          key={index}
          ref={(el) => {
            inputs.current[index] = el;
          }}
          type="text"
          maxLength={1}
          value={value[index] || ""}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          className="w-12 h-14 text-2xl font-semibold text-center bg-background/50 border-2 border-muted rounded-lg 
                   focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200
                   shadow-sm hover:shadow-md"
        />
      ))}
    </div>
  );
};

export default function OtpLogin() {
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const { setRole, setUser } = useAuth();

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(e.target.value);
  };

  const handleOtpChange = (value: string) => {
    setOtp(value);
  };

  const handleSendOtp = async () => {
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/otpverify", {
        method: "POST",
        body: JSON.stringify({
          phoneNumber: `${phoneNumber}`,
          action: "send",
        }),
      });
      const data = await response.json();

      if (data.success) {
        setStep("otp");
      } else {
        setError(data.error || "Failed to send OTP");
      }
    } catch (error) {
      console.log(error);
      setError("Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/otpverify", {
        method: "POST",
        body: JSON.stringify({
          phoneNumber: `${phoneNumber}`,
          otp,
          action: "verify",
        }),
      });
      const data = await response.json();

      if (data.success && data.verified) {
        console.log("OTP verified successfully");
        const userData: { phoneNumber: string } = {
          phoneNumber: `${phoneNumber}`,
        };
        setRole(data.user.role);
        sessionStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("user", JSON.stringify(data.token));
        setUser(userData as User | null);
        router.push("/");
      } else {
        throw new Error("Invalid OTP");
      }
    } catch (error) {
      setError("Invalid OTP. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {step === "phone" ? (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <div className="relative">
              <input
                value={phoneNumber}
                onChange={handlePhoneChange}
                placeholder="Enter your mobile number"
                className="h-12 pl-14 pr-4 text-base bg-white focus:outline-none border-2 border-orange-200 
                         focus:border-orange-400 focus:ring-2 focus:ring-orange-100 rounded-xl w-full
                         transition-all duration-200"
                maxLength={10}
                type="tel"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 font-medium">
                +91
              </span>
            </div>
          </div>

          <button
            onClick={handleSendOtp}
            disabled={phoneNumber.length !== 10 || loading}
            className="w-full h-12 text-base font-medium bg-orange-600 hover:bg-orange-700 text-white 
                     rounded-xl transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50
                     disabled:cursor-not-allowed"
          >
            {loading ? "Sending..." : "Get OTP"}
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h3 className="text-xl font-semibold text-gray-800">
              Verify Your Number
            </h3>
            <p className="text-sm text-gray-600">
              We&apos;ve sent a 6-digit code to +91 {phoneNumber}
            </p>
          </div>

          <OtpInput length={6} value={otp} onChange={handleOtpChange} />

          <button
            onClick={handleVerifyOtp}
            disabled={otp.length !== 6 || loading}
            className="w-full h-12 text-base font-medium bg-orange-600 hover:bg-orange-700 text-white rounded-xl
                     transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50
                     disabled:cursor-not-allowed"
          >
            {loading ? "Verifying..." : "Verify & Continue"}
          </button>

          <div className="flex items-center justify-center gap-2 text-sm">
            <span className="text-gray-600">Didn&apos;t receive code?</span>
            <button
              onClick={handleSendOtp}
              className="text-orange-600 hover:text-orange-500 font-medium transition-colors"
            >
              Resend OTP
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm text-center">
          {error}
        </div>
      )}
    </div>
  );
}
