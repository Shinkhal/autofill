import Link from "next/link";
import { API_URL } from "@/lib/api";
export default function AuthPanel({signup=false}:{signup?:boolean}){
  return <main className="auth-wrap"><div className="auth-card"><span className="eyebrow">YOUR CAREER WORKSPACE</span><h1>{signup?"Create your account":"Welcome back"}</h1><p>Use your Google account to access your profile and applications.</p><a className="btn wide" href={API_URL+"/auth/google"}>Continue with Google <span>↗</span></a><p className="small">One account for your entire application workspace.</p><Link className="text-link" href="/">← Back to home</Link></div></main>;
}
