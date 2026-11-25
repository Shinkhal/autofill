"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
export default function ProtectedRoute({children}:{children:React.ReactNode}) {
  const {user,loading}=useAuth(); const router=useRouter();
  useEffect(()=>{if(!loading&&!user)router.replace("/auth/login");},[user,loading,router]);
  if(loading||!user)return <main className="shell"><p role="status">Checking your session…</p></main>;
  return <>{children}</>;
}
