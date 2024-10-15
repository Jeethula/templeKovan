// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Theme } from "@radix-ui/themes";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "@/components/Navbar";
import AuthWrapper from "../app/context/AuthWrapper";
import { Toaster } from "react-hot-toast";
import Script from "next/script";

export const metadata: Metadata = {
  title: "srirenukaakkammatemple",
  description: "srirenukaakkammatemple",
};

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// const poppins = Poppins({
//   subsets: ["latin"],
//   weight: ["400", "500", "600", "700"],
// });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
      </head>
      <body className={`${inter} antialiased bg-[#fdf0f4]`}>
      <Script
          type="text/javascript"
          src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        ></Script>
        <Theme>
          <AuthProvider>
            <AuthWrapper>
              <Navbar />
              {children}
              <Toaster />
            </AuthWrapper>
          </AuthProvider>
        </Theme>
      </body>
    </html>
  );
}