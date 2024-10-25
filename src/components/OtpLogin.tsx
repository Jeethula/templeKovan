"use client";
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuth } from "../app/context/AuthContext";
import { User } from "firebase/auth";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !value[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex justify-center gap-2 mb-4">
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
          className="border-gray-300 border rounded-md focus:ring-2 focus:ring-blue-500 w-12 h-12 text-center focus:outline-none"
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
      const response = await axios.post("/api/otpverify", {
        phoneNumber: `${phoneNumber}`,
        action: "send",
      });



      if (response.data.success) {
        setStep("otp");
      } else {
        setError(response.data.error || "Failed to send OTP");
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
      const response = await axios.post("/api/otpverify", {
        phoneNumber: `${phoneNumber}`,
        otp,
        action: "verify",
      });

      if (response.data.success && response.data.verified) {
        console.log("OTP verified successfully");
        const userData: { phoneNumber: string } = {
          phoneNumber: `${phoneNumber}`,
        };
        setRole(response.data.user.role);
        sessionStorage.setItem("user", JSON.stringify(response.data.user));
        setUser(userData as User | null | string);
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
    <div className="flex flex-col items-center">
      {step === "phone" ? (
        <div className="space-y-4 w-full">
          <Input
            value={phoneNumber}
            onChange={handlePhoneChange}
            placeholder="Enter Phone Number"
            className="border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-center"
          />
          <Button
            onClick={handleSendOtp}
            disabled={phoneNumber.length !== 10 || loading}
            className="bg-blue-500 hover:bg-blue-600 w-full text-white transition duration-300"
          >
            {loading ? "Sending..." : "Send OTP"}
          </Button>
        </div>
      ) : (
        <div className="space-y-4 w-full">
          <OtpInput length={6} value={otp} onChange={handleOtpChange} />
          <Button
            onClick={handleVerifyOtp}
            disabled={otp.length !== 6 || loading}
            className="bg-green-500 hover:bg-green-600 w-full text-white transition duration-300"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </Button>
        </div>
      )}
      {error && <p className="mt-4 text-center text-red-500">{error}</p>}
    </div>
  );
}
