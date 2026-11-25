export const API_URL = (process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000").replace(/\/$/, "");
export class ApiError extends Error {
  constructor(public status: number, message: string) { super(message); }
}
let token: string | null = null;
let refreshing: Promise<string> | null = null;
export function clearToken() { token = null; }
async function request(path: string, init: RequestInit = {}, access?: string | null) {
  const headers = new Headers(init.headers);
  if (init.body && !(init.body instanceof FormData)) headers.set("Content-Type", "application/json");
  if (access) headers.set("Authorization", "Bearer " + access);
  const response = await fetch(API_URL + path, { ...init, headers, credentials: "include", cache: "no-store" });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new ApiError(response.status, typeof data.message === "string" ? data.message : typeof data.error === "string" ? data.error : "Request failed (" + response.status + ")");
  }
  return response;
}
export function refresh() {
  if (!refreshing) refreshing = request("/auth/refresh", {method:"POST", body:"{}"}).then(async r => {
    const data = await r.json(); token = data.accessToken; return data.accessToken as string;
  }).catch(e => { clearToken(); throw e; }).finally(() => { refreshing = null; });
  return refreshing;
}
export async function exchange(code: string) {
  const response = await request("/auth/exchange", {method:"POST", body:JSON.stringify({code, client:"web", deviceName:"Browser"})});
  token = (await response.json()).accessToken;
}
export async function apiResponse(path: string, init: RequestInit = {}) {
  let previous: string;
  try { previous = token || await refresh(); } catch (e) { if (e instanceof ApiError && e.status === 401) window.dispatchEvent(new Event("auth-expired")); throw e; }
  try { return await request(path, init, previous); }
  catch (e) {
    if (!(e instanceof ApiError) || e.status !== 401) throw e;
    try { return await request(path, init, token && token !== previous ? token : await refresh()); }
    catch (error) {
      if (error instanceof ApiError && error.status === 401) { clearToken(); window.dispatchEvent(new Event("auth-expired")); }
      throw error;
    }
  }
}
export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const r = await apiResponse(path, init);
  return r.status === 204 ? undefined as T : r.json();
}
export function json(method: string, data: unknown): RequestInit { return {method, body: JSON.stringify(data)}; }
export function message(e: unknown) { return e instanceof Error ? e.message : "Something went wrong"; }
export interface User { _id: string; name: string; email: string; image?: string; profile?: Record<string, unknown>; jobPreferences?: Record<string, unknown>; }
