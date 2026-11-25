"use client";
import {useState} from "react";
import {Workspace,useData,State,Field} from "@/components/Workspace";
import {api,json,message} from "@/lib/api";
const statuses=["Saved","Applied","Interview","Rejected","Offer","Accepted","Withdrawn"];
type Job={_id:string;company:string;role:string;status:string;location?:string;jobLink?:string;notes?:string;source?:string;followUpDate?:string;statusHistory?:{status:string;changedAt:string}[]};
const initial={company:"",role:"",status:"Saved",location:"",jobLink:"",notes:"",source:"",followUpDate:""};
function Tracker(){const state=useData<Job[]>("/api/jobs");const [draft,setDraft]=useState(initial),[edit,setEdit]=useState<string|null>(null),[filter,setFilter]=useState("All"),[error,setError]=useState(""),[busy,setBusy]=useState(false);
 async function perform(fn:()=>Promise<unknown>){setError("");setBusy(true);try{await fn();await state.reload();}catch(e){setError(message(e));}finally{setBusy(false);}}
 return <div className="stack"><form className="panel stack" onSubmit={e=>{e.preventDefault();void perform(async()=>{await api("/api/jobs"+(edit?"/"+edit:""),json(edit?"PUT":"POST",{...draft,followUpDate:draft.followUpDate||null}));setDraft(initial);setEdit(null);});}}><h2>{edit?"Edit application":"Add application"}</h2><div className="fields">{(["company","role","location","source","jobLink","followUpDate","notes"] as const).map(f=><Field key={f} label={{company:"Company",role:"Role",location:"Location",source:"Source",jobLink:"Job URL",followUpDate:"Follow-up date",notes:"Notes"}[f]} value={draft[f]} type={f==="followUpDate"?"date":f==="notes"?"textarea":f==="jobLink"?"url":"text"} required={f==="company"||f==="role"} onChange={v=>setDraft({...draft,[f]:v})}/>)}<label className="field">Status<select value={draft.status} onChange={e=>setDraft({...draft,status:e.target.value})}>{statuses.map(s=><option key={s}>{s}</option>)}</select></label></div><div className="row"><button className="btn" disabled={busy}>{edit?"Save application":"Add application"}</button>{edit&&<button className="btn outline" type="button" onClick={()=>{setEdit(null);setDraft(initial);}}>Cancel</button>}</div></form>{error&&<p className="error" role="alert">{error}</p>}<section className="panel"><div className="split"><h2>Applications</h2><label className="row">Filter <select className="control" value={filter} onChange={e=>setFilter(e.target.value)}><option>All</option>{statuses.map(s=><option key={s}>{s}</option>)}</select></label></div><State {...state}/><div className="table-wrap"><table><thead><tr><th>Company / role</th><th>Status</th><th>Location</th><th>Actions</th></tr></thead><tbody>{state.data?.filter(j=>filter==="All"||j.status===filter).map(j=><tr key={j._id}><td><strong>{j.company}</strong><p>{j.role}</p></td><td><select className="control" aria-label={"Status for "+j.company} disabled={busy} value={j.status} onChange={e=>void perform(()=>api("/api/jobs/"+j._id,json("PUT",{status:e.target.value})))}>{statuses.map(s=><option key={s}>{s}</option>)}</select></td><td>{j.location||"—"}</td><td><div className="row"><button className="btn outline" onClick={()=>{setEdit(j._id);setDraft({company:j.company,role:j.role,status:j.status,location:j.location||"",source:j.source||"",jobLink:j.jobLink||"",notes:j.notes||"",followUpDate:j.followUpDate?.slice(0,10)||""});window.scrollTo({top:0,behavior:"smooth"});}}>Edit</button><button disabled={busy} className="btn outline danger" onClick={()=>{if(confirm("Delete this application?"))void perform(()=>api("/api/jobs/"+j._id,{method:"DELETE"}));}}>Delete</button></div></td></tr>)}</tbody></table></div>{state.data?.filter(j=>filter==="All"||j.status===filter).length===0&&<p className="empty">No applications match this view.</p>}</section></div>}
export default function Page(){return <Workspace title="Applications" description="Keep every opportunity and follow-up in one place."><Tracker/></Workspace>}

export interface JobApplication {
  _id: string;
  company: string;
  role: string; // Changed from 'position' to match backend
  status: 'Applied' | 'Interview' | 'Rejected' | 'Offer'; // Updated to match backend enum
  dateApplied: string; // Changed from 'applicationDate' to match backend
  jobLink?: string; // Changed from 'jobUrl' to match backend
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface JobFormData {
  company: string;
  role: string; // Changed from 'position' to match backend
  status: 'Applied' | 'Interview' | 'Rejected' | 'Offer'; // Updated to match backend enum
  dateApplied: string; // Changed from 'applicationDate' to match backend
  jobLink: string; // Changed from 'jobUrl' to match backend
  notes: string;
}
