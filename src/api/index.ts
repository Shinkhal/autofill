import axios from './axios'; // token is auto-attached here via interceptor
import { JobSearchFilters, JobDetails } from '@/types/jobTypes';

// -------------------- Auth --------------------

/**
 * Redirects the user to Google login
 */
export const redirectToGoogleLogin = () => {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google`;
  window.location.href = url;
};

// -------------------- User Profile --------------------

/**
 * Fetch user profile by ID
 * @param userId - User's unique identifier
 */
export const fetchUserProfile = async (userId: string) => {
  try {
    const response = await axios.get(`/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch user profile:", error);
    throw error;
  }
};

/**
 * Update user profile by ID
 * @param userId - User's unique identifier
 * @param profileData - Complete profile data to update
 */
export const updateUserProfile = async (userId: string, profileData: any) => {
  try {
    const response = await axios.put(`/user/${userId}`, profileData);
    return response.data;
  } catch (error) {
    console.error("Failed to update user profile:", error);
    throw error;
  }
};

// -------------------- ATS --------------------

/**
 * Analyze resume against job description
 */
export const analyzeResumeScore = async (file: File, jd: string) => {
  const formData = new FormData();
  formData.append('resume', file);
  formData.append('jd', jd);

  const res = await axios.post('/ats/analyze', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    timeout: 60000,
  });

  return res.data;
};

// -------------------- Jobs --------------------

/**
 * Fetch job listings based on search filters
 * @param filters - Search filters
 * @param token - User auth token
 */
export const fetchJobsFromApi = async (filters: JobSearchFilters) => {
  const params = new URLSearchParams();
  if (filters.query) params.append('query', filters.query);
  if (filters.location) params.append('location', filters.location);
  if (filters.work_from_home) params.append('work_from_home', 'true');
  if (filters.employment_types) params.append('employment_types', filters.employment_types);
  if (filters.job_requirements) params.append('job_requirements', filters.job_requirements);
  if (filters.company_types) params.append('company_types', filters.company_types);
  if (filters.radius !== 25) params.append('radius', filters.radius.toString());

  const response = await axios.get(`/listjobs?${params.toString()}`);
  return response.data;
};


export const fetchJobDetails = async (source: string, jobId: string): Promise<JobDetails> => {
  try {
    const response = await axios.get(`/listjobs/${source}/${jobId}`);
    return response.data.job;
  } catch (error: any) {
    console.error('Failed to fetch job details:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch job details');
  }
};
