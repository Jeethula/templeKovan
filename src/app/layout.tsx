import { Inter } from "next/font/google";
import "./globals.css";
import { Theme } from "@radix-ui/themes";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "@/components/Navbar";
import AuthWrapper from "../app/context/AuthWrapper";
import { Toaster } from "react-hot-toast";
import Script from "next/script";
import { Suspense } from "react";
import ErrorBoundary from '@/components/ErrorBoundry';
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});
import type { Metadata, Viewport } from "next";

const APP_NAME = "Sri Renuka Akkamma Temple";
const APP_DEFAULT_TITLE = "Sri Renuka Akkamma Temple";
const APP_TITLE_TEMPLATE = "%s - PWA App";
const APP_DESCRIPTION = "Official website of Sri Renuka Akkamma Temple";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
    // startUpImage: [],
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
};

// export const metadata: Metadata = {
//   title: "Sri Renuka Akkamma Temple",
//   description: "Official website of Sri Renuka Akkamma Temple",
//   openGraph: {
//     images: [
//       {
//         url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgaPy9oE_VXsAXb-PTYlTZqPhOw6Ly5KOb5Q&s',
//         width: 1200,
//         height: 630,
//         alt: 'Sri Renuka Akkamma Temple',
//       },
//     ],
//   },
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link 
          rel="icon" 
          href="https://www.alackalbellmetals.com/cdn/shop/files/ALACKAL-BALAJIWALLHANGING.png?v=1720446341" 
        />
        <Script
          type="text/javascript"
          src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        />
      </head>
      <body className={`${inter.className} antialiased bg-[#fdf0f4]`}>
        {/* Desktop Message */}
        {/* <div className="sm:flex fixed inset-0 bg-violet-100 items-center justify-center flex-col p-4 text-center">
          <div className="max-w-md space-y-4">
            <h1 className="text-2xl font-bold text-violet-900">
              Mobile Only Application
            </h1>
            <p className="text-violet-700">
              Please use a mobile device to access this application.
              Our services are optimized for screens smaller than 600px width.
            </p>
            <div className="text-5xl">📱</div>
          </div>
        </div> */}
        <div className="max-w-screen min-w-screen">
          <ErrorBoundary>
            <Theme>
              <Suspense 
                fallback={
                  <div className="flex flex-col justify-center items-center bg-violet-200 w-full h-screen font-semibold text-2xl text-red-600">
                    {/* Loading... */}
                    <div className="flex gap-1 items-center">
                      <span className="animate-bounce delay-0">.</span>
                      <span className="animate-bounce delay-150">.</span>
                      <span className="animate-bounce delay-300">.</span>
                    </div>
                  </div>
                }
              >
                <AuthProvider>
                  <AuthWrapper>
                    <Navbar />
                    {children}
                    <Toaster />
                  </AuthWrapper>
                </AuthProvider>
              </Suspense>
            </Theme>
          </ErrorBoundary>
        </div>
      </body>
    </html>
  );
}
