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

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Sri Renuka Akkamma Temple",
  description: "Official website of Sri Renuka Akkamma Temple",
  openGraph: {
    images: [
      {
        url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgaPy9oE_VXsAXb-PTYlTZqPhOw6Ly5KOb5Q&s',
        width: 1200,
        height: 630,
        alt: 'Sri Renuka Akkamma Temple',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="https://www.alackalbellmetals.com/cdn/shop/files/ALACKAL-BALAJIWALLHANGING.png?v=1720446341" />
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
