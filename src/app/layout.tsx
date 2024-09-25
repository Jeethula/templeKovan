import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Theme } from "@radix-ui/themes";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "@/components/Navbar";
import AuthWrapper from "../app/context/AuthWrapper";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins} antialiased bg-[#fdf0f4]`}>
        <Theme>
          <AuthProvider>
            <AuthWrapper>
              <Navbar />
              {children}
            </AuthWrapper>
          </AuthProvider>
        </Theme>
      </body>
    </html>
  );
}
