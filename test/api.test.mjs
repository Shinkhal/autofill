import test from "node:test";
import assert from "node:assert/strict";
import { api, exchange, refresh, clearToken, ApiError, json } from "../src/lib/api.ts";
const original=globalThis.fetch;
test("API client follows web code exchange, bearer and serialized refresh contracts",async()=>{
  const requests=[];
  globalThis.fetch=async(url,init)=>{
    requests.push([url,init]);
    if(url.endsWith("/auth/exchange"))return Response.json({accessToken:"first"});
    if(url.endsWith("/auth/refresh"))return Response.json({accessToken:"rotated"});
    if(url.endsWith("/api/user/me"))return Response.json({name:"Candidate"});
    if(url.endsWith("/api/resume"))return new Response(null,{status:204});
    return Response.json({message:"Not found"},{status:404});
  };
  try{
    await exchange("one-time-code");
    assert.deepEqual(JSON.parse(requests[0][1].body),{code:"one-time-code",client:"web",deviceName:"Browser"});
    assert.equal(requests[0][1].credentials,"include");
    assert.equal((await api("/api/user/me")).name,"Candidate");
    assert.equal(requests[1][1].headers.get("Authorization"),"Bearer first");
    clearToken();
    await Promise.all([refresh(),refresh(),refresh()]);
    assert.equal(requests.filter(([url])=>url.endsWith("/auth/refresh")).length,1);
    const form=new FormData();form.append("resume",new Blob(["PDF"],{type:"application/pdf"}),"resume.pdf");
    assert.equal(await api("/api/resume",{method:"POST",body:form}),undefined);
    assert.equal(requests.at(-1)[1].headers.has("Content-Type"),false);
    assert.equal(requests.at(-1)[1].headers.get("Authorization"),"Bearer rotated");
    await assert.rejects(api("/missing",json("PUT",{})),e=>e instanceof ApiError&&e.status===404);
  }finally{globalThis.fetch=original;clearToken();}
});
