"use client";
import React, { useEffect, useState } from "react";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from "firebase/auth";
import { app } from '../Firebase/Firebase';

export default function OtpLogin() {
    const [phoneNumber, setPhoneNumber] = useState<string>("");
    const [otp, setOtp] = useState<string>("");
    const [step, setStep] = useState<'phone' | 'otp'>('phone');
    const [error, setError] = useState<string>("");
    const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
    const [recaptchaVerifier, setRecaptchaVerifier] = useState<RecaptchaVerifier | null>(null);

    const auth = getAuth(app)

    useEffect(() => {
        const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
            size: 'normal',
            callback: () => {},
            'expired-callback': () => {
                setError("reCAPTCHA expired. Please try again.");
            }
        });
        setRecaptchaVerifier(verifier);

        return () => {
            verifier.clear();
        };
    }, [auth]);

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
            if (!recaptchaVerifier) {
                throw new Error("RecaptchaVerifier is not initialized");
            }
            const formattedPhoneNumber = `+91${phoneNumber}`;
            
            const confirmation = await signInWithPhoneNumber(auth, formattedPhoneNumber, recaptchaVerifier);
            setConfirmationResult(confirmation);
            setStep('otp');
            console.log("OTP sent successfully");
        } catch (error) {
            setError("Failed to send OTP. Please try again.");
            console.error(error);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");

        try {
            if (!confirmationResult) {
                throw new Error("ConfirmationResult is not available");
            }
            await confirmationResult.confirm(otp);
            console.log("OTP verified successfully");
        } catch (error) {
            setError("Invalid OTP. Please try again.");
            console.error(error);
        }
    };

    return (
        <div className="p-6 bg-white shadow-md rounded-lg max-w-md mx-auto">
            <h1 className="text-3xl font-bold text-center mb-6">OTP Login</h1>
            {step === 'phone' ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                    <input
                        type="tel"
                        value={phoneNumber}
                        onChange={handlePhoneChange}
                        placeholder="Enter your Phone Number"
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <div id="recaptcha-container" className="mt-2"></div>
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