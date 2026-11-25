import { api, API_URL } from '@/lib/api';
import type { JobSearchFilters, JobDetails, ApiResponse } from '@/types/jobTypes';
export const redirectToGoogleLogin = () => { window.location.href = API_URL + '/auth/google'; };
export const fetchJobsFromApi = (filters: JobSearchFilters) => {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) if (value !== '' && value !== false) params.set(key, String(value));
  return api<ApiResponse>('/api/listjobs?' + params.toString());
};
export const fetchJobDetails = async (source: string, jobId: string): Promise<JobDetails> => {
  const result = await api<{job: JobDetails}>('/api/listjobs/' + encodeURIComponent(source.toLowerCase()) + '/' + encodeURIComponent(jobId));
  return result.job;
};
