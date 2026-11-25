"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Layers, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
export default function Navbar(){
  const {user,loading,logout}=useAuth(); const path=usePathname();const router=useRouter();const [error,setError]=useState("");
  return <header className="nav"><div className="nav-inner"><Link className="brand" href="/"><span className="brand-icon"><Layers size={18}/></span> autofill<span className="brand-dot">.</span></Link>
  {user?<nav aria-label="Workspace">{[["/dashboard","Overview"],["/profile","Profile"],["/resumes","Resumes"],["/jobs","Find jobs"],["/tracker","Applications"],["/answers","Answers"],["/ats","ATS review"],["/settings","Settings"]].map(([href,label])=><Link key={href} href={href} aria-current={path===href?"page":undefined}>{label}</Link>)}</nav>:<nav aria-label="Main"><Link href="/#how">How it works</Link></nav>}
  <div className="nav-actions">{!loading&&(user?<button className="btn outline" onClick={async()=>{try{await logout();router.replace("/auth/login");}catch{setError("Could not sign out. Retry.");}}}><LogOut size={15}/> Sign out</button>:<Link className="btn" href="/auth/login">Sign in <span aria-hidden>↗</span></Link>)}</div></div>{error&&<p role="alert" className="error">{error}</p>}</header>
}
