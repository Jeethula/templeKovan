"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function OtpLogin() {
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [error, setError] = useState<string>("");
  const [sessionId, setSessionId] = useState<string>("");
  const router = useRouter();

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(e.target.value);
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtp(e.target.value);
  };

  const handleSendOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("/api/otpverify", {
        phoneNumber: `+91${phoneNumber}`,
        action: "send",
      });

      if (response.data.success) {
        setSessionId(response.data.sessionId);
        setStep("otp");
        console.log("OTP sent successfully");
      } else {
        if (response.data.error === "Phone number not found") {
          setError("Phone number not found");
        } else {
          setError(response.data.error);
        }
      }
    } catch (error) {
      setError("Failed to send OTP. Please try again.");
      console.error(error);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("/api/otpverify", {
        phoneNumber: `91${phoneNumber}`,
        otp,
        action: "verify",
      });

      console.log(response, "response");

      if (response.data.success && response.data.verified) {
        console.log("OTP verified successfully");
        console.log(
          "Attempting to store in sessionStorage:",
          `+91${phoneNumber}`
        );
        try {
          sessionStorage.setItem("phoneNumber", `+91${phoneNumber}`);
          console.log("Successfully stored in sessionStorage");
        } catch (error) {
          console.error("Failed to store in sessionStorage:", error);
        }
        router.replace("/");
      } else {
        throw new Error("Invalid OTP");
      }
    } catch (error) {
      setError("Invalid OTP. Please try again.");
      console.error(error);
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg max-w-md mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">OTP Login</h1>
      {step === "phone" ? (
        <form onSubmit={handleSendOtp} className="space-y-4">
          <input
            type="tel"
            value={phoneNumber}
            onChange={handlePhoneChange}
            placeholder="Enter your Phone Number"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
          >
            Send OTP
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <input
            type="text"
            value={otp}
            onChange={handleOtpChange}
            placeholder="Enter OTP"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
          <button
            type="submit"
            className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700"
          >
            Verify OTP
          </button>
        </form>
      )}
      {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
    </div>
  );
}
