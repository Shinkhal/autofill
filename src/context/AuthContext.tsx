"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { api, clearToken, exchange, refresh, User } from "@/lib/api";
const AuthContext = createContext<{user: User|null; loading: boolean; logout:()=>Promise<void>; complete:(code:string)=>Promise<void>}>({user:null,loading:true,logout:async()=>{},complete:async()=>{}});
export function AuthProvider({children}:{children:React.ReactNode}) {
  const [user,setUser] = useState<User|null>(null);
  const [loading,setLoading] = useState(true);
  useEffect(()=>{
    let active = true;
    const expired = () => setUser(null);
    window.addEventListener("auth-expired",expired);
    // The callback owns the initial exchange; do not rotate a previous cookie concurrently.
    if (location.pathname !== "/auth-success") refresh().then(()=>api<User>("/auth/me")).then(u=>{if(active)setUser(u);}).catch(()=>{}).finally(()=>{if(active)setLoading(false);});
    else setLoading(false);
    return ()=>{active=false;window.removeEventListener("auth-expired",expired);};
  },[]);
  async function complete(code:string) { await exchange(code); setUser(await api<User>("/auth/me")); setLoading(false); }
  async function logout(){ await api("/auth/logout",{method:"POST"}); clearToken(); setUser(null); }
  return <AuthContext.Provider value={{user,loading,logout,complete}}>{children}</AuthContext.Provider>;
}
export const useAuth = ()=>useContext(AuthContext);
