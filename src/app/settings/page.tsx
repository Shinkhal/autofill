"use client";
import { useState } from "react";
import { Workspace,useData,State } from "@/components/Workspace";
import { api,message,clearToken } from "@/lib/api";
import { useRouter } from "next/navigation";
type Session={_id:string;deviceName:string;client:string;lastUsedAt:string;expiresAt:string};
function Settings(){const router=useRouter();const state=useData<{sessions:Session[];currentSessionId:string}>("/auth/sessions");const [error,setError]=useState(""),[busy,setBusy]=useState(false);
 async function revoke(id?:string){if(!confirm(id?"Revoke this device session?":"Sign out all devices?"))return;setBusy(true);setError("");try{await api(id?"/auth/sessions/"+id:"/auth/logout-all",{method:id?"DELETE":"POST"});if(!id||id===state.data?.currentSessionId){clearToken();window.dispatchEvent(new Event("auth-expired"));router.replace("/auth/login");}else await state.reload();}catch(e){setError(message(e));}finally{setBusy(false);}}
 return <section className="panel stack"><div className="split"><h2>Active sessions</h2><button className="btn outline danger" disabled={busy} onClick={()=>void revoke()}>Sign out all devices</button></div><State {...state}/>{error&&<p className="error" role="alert">{error}</p>}{state.data?.sessions.map(s=><article className="list-item split" key={s._id}><div><strong>{s.deviceName||s.client}</strong>{s._id===state.data?.currentSessionId&&<span className="badge">Current</span>}<p>Last active: {new Date(s.lastUsedAt).toLocaleString()}</p></div><button className="btn outline" disabled={busy} onClick={()=>void revoke(s._id)}>Revoke</button></article>)}</section>
}
export default function Page(){return <Workspace title="Settings" description="Review and manage your signed-in devices."><Settings/></Workspace>}
