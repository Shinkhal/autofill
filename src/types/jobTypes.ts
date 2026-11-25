// /types/jobTypes.ts

export interface Job {
  jobId: string;
  source: string;
  company: string;
  companyLogo?: string;
  role: string;
  location: string;
  description: string;
  applyLink: string;
  postedDate: string;
  employmentType?: string;
  isRemote?: boolean;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  salaryPeriod?: string;
  salary?: string;
  jobType?: string;
  category?: string;
}

export interface JobSearchFilters {
  query: string;
  location: string;
  work_from_home: boolean;
  employment_types: string;
  job_requirements: string;
  company_types: string;
  radius: number;
}

export interface ApiResponse {
  success: boolean;
  totalJobs: number;
  jobs: Job[];
  sources: {
    jsearch: number;
    jobicy: number;
    remotive: number;
    jooble: number;
  };
}

export interface JobDetails {
  jobId: string;
  source: string;
  company: string;
  companyLogo?: string;
  role: string;
  location: string;
  description: string;
  applyLink: string;
  postedDate: string;
  employmentType?: string;
  isRemote?: boolean;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  salaryPeriod?: string;
  salary?: string;
  jobType?: string;
  category?: string;
  requirements?: string[];
  benefits?: string[];
  companyDescription?: string;
  companySize?: string;
  industry?: string;
  experience?: string;
  education?: string;
  skills?: string[];
}