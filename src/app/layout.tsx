import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
export const metadata: Metadata = { title: "Autofill — Your application workspace", description: "Manage your candidate profile, resumes, and job applications." };
export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="en"><body><AuthProvider><Navbar/>{children}</AuthProvider></body></html>;
}
