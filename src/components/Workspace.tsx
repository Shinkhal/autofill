"use client";
import {useCallback,useEffect,useState} from "react";
import ProtectedRoute from "./ProtectedRoute";
import {api,message} from "@/lib/api";
export function Workspace({title,description,children}:{title:string;description:string;children:React.ReactNode}){
 return <ProtectedRoute><main className="shell"><header className="page-heading"><span className="eyebrow">YOUR WORKSPACE</span><h1>{title}</h1><p>{description}</p></header>{children}</main></ProtectedRoute>;
}
export function useData<T>(path:string){
 const [data,setData]=useState<T|null>(null),[error,setError]=useState(""),[loading,setLoading]=useState(true);
 const reload=useCallback(async()=>{setError("");setLoading(true);try{setData(await api<T>(path));}catch(e){setError(message(e));}finally{setLoading(false);}},[path]);
 useEffect(()=>{void reload();},[reload]);return {data,error,loading,reload};
}
export function State({loading,error,reload}:{loading:boolean;error:string;reload:()=>void}){
 return <>{loading&&<p role="status">Loading…</p>}{error&&<div className="error split" role="alert">{error}<button className="btn outline" onClick={reload}>Retry</button></div>}</>;
}
export function Field({label,value,onChange,type="text",full=false,required=false,disabled=false}:{label:string;value:string;onChange?:(v:string)=>void;type?:string;full?:boolean;required?:boolean;disabled?:boolean}){
 return <label className={"field "+(full?"full":"")}>{label}{type==="textarea"?<textarea value={value} onChange={e=>onChange?.(e.target.value)} required={required}/>:<input type={type} value={value} onChange={e=>onChange?.(e.target.value)} required={required} disabled={disabled}/>}</label>;
}
