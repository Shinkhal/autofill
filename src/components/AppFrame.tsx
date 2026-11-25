"use client";
import {usePathname} from "next/navigation";
import {useAuth} from "@/context/AuthContext";
export default function AppFrame({children}:{children:React.ReactNode}){
 const path=usePathname();const {user}=useAuth();const authenticated=!!user&&path!=="/"&&!path.startsWith("/auth");
 return <div className={authenticated?"app-frame":"public-frame"}>{children}</div>;
}
