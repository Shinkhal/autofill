"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Layers, LogOut, LayoutDashboard, UserRound, FileText, Search, BriefcaseBusiness, MessagesSquare, ScanText, Settings, ChevronDown, Menu, X, ArrowUpRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
const groups: {label:string;items:readonly (readonly [string,string,typeof Layers])[]}[]=[
 {label:"WORKSPACE",items:[["/dashboard","Overview",LayoutDashboard],["/jobs","Find jobs",Search],["/tracker","Applications",BriefcaseBusiness]]},
 {label:"YOUR PROFILE",items:[["/profile","Candidate profile",UserRound],["/resumes","Resumes",FileText],["/answers","Answer bank",MessagesSquare],["/ats","Resume review",ScanText]]},
 {label:"ACCOUNT",items:[["/settings","Settings",Settings]]}
] as const;
export default function Navbar(){
 const {user,loading,logout}=useAuth(); const path=usePathname();const router=useRouter();const [error,setError]=useState(""),[open,setOpen]=useState(false);
 const active=(href:string)=>path===href||href==="/jobs"&&path.startsWith("/job-listing");
 const isApp=!!user&&path!=="/"&&!path.startsWith("/auth");
 async function signout(){try{await logout();router.replace("/auth/login");}catch{setError("Could not sign out. Retry.");}}
 const brand=<Link className="brand" href={user?"/dashboard":"/"}><span className="brand-icon"><Layers size={19}/></span>autofill<span className="brand-dot">.</span></Link>;
 if(!isApp)return <header className="marketing-nav"><div className="marketing-nav-inner">{brand}<nav className="marketing-links" aria-label="Main navigation"><Link href="/#features">Features</Link><Link href="/#how">How it works</Link><Link href="/#faq">FAQ</Link></nav><div className="row">{!loading&&(user?<Link className="btn" href="/dashboard">Open workspace <ArrowUpRight size={15}/></Link>:<><Link className="public-signin" href="/auth/login">Sign in</Link><Link className="btn" href="/auth/signup">Get started <ArrowUpRight size={15}/></Link></>)}</div></div></header>;
 return <><header className="app-topbar"><div className="row"><button className="mobile-menu icon-button" aria-label={open?"Close menu":"Open menu"} aria-expanded={open} onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button><span className="topbar-label">Workspace</span><span className="breadcrumb-slash">/</span><strong>{groups.flatMap(g=>g.items).find(([href])=>active(href))?.[1]||"Workspace"}</strong></div><Link className="account-pill" href="/settings"><span className="account-avatar">{user.name?.slice(0,1).toUpperCase()||"U"}</span><span>{user.name}</span><ChevronDown size={14}/></Link></header>
 {open&&<button className="sidebar-overlay" aria-label="Close navigation" onClick={()=>setOpen(false)}/>}
 <aside className={"app-sidebar "+(open?"is-open":"")}><div className="sidebar-brand">{brand}</div><div className="workspace-switch"><span className="workspace-symbol"><BriefcaseBusiness size={17}/></span><div><strong>Personal workspace</strong><p>Job search</p></div></div><nav aria-label="Workspace navigation">{groups.map(g=><section className="nav-group" key={g.label}><p>{g.label}</p>{g.items.map(([href,label,Icon])=><Link key={href} href={href} onClick={()=>setOpen(false)} aria-current={active(href)?"page":undefined}><Icon size={18}/>{label}</Link>)}</section>)}</nav><div className="sidebar-bottom"><div className="small sidebar-note">Your career, organized.<br/>One workspace. Every application.</div><button className="sidebar-logout" onClick={signout}><LogOut size={17}/> Sign out</button>{error&&<p className="error" role="alert">{error}</p>}</div></aside></>;
}
