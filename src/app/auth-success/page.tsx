"use client";
import {useEffect,useRef,useState} from "react";
import {useAuth} from "@/context/AuthContext";
import {useRouter} from "next/navigation";
import Link from "next/link";
export default function Page(){
 const {complete}=useAuth();const router=useRouter();const started=useRef(false);const [error,setError]=useState("");
 useEffect(()=>{if(started.current)return;started.current=true;const code=new URLSearchParams(location.hash.slice(1)).get("code");history.replaceState(null,"",location.pathname+location.search);if(!code){setError("No authentication code received.");return;}complete(code).then(()=>router.replace("/dashboard")).catch(()=>setError("Sign-in failed. Please try again."));},[complete,router]);
 return <main className="auth-wrap"><div className="auth-card"><h1>{error?"Unable to sign in":"Signing you in…"}</h1>{error&&<><p role="alert">{error}</p><Link className="btn" href="/auth/login">Try again</Link></>}</div></main>;
}
