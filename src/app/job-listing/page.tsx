'use client';

import React, { useEffect, useState, useMemo } from 'react';
import JobCard from '@/app/job-listing/JobCard';
import JobFilters from '@/app/job-listing/JobFilter';
import { useAuth } from '@/context/AuthContext';
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationNext, PaginationLink } from '@/components/ui/pagination';
import { Card } from '@/components/ui/card';
import { Loader2, AlertCircle, FileSearch } from 'lucide-react';
import { fetchJobsFromApi } from '@/api';
import { Job, JobSearchFilters, ApiResponse } from '@/types/jobTypes';

const JobListingsPage = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [totalJobs, setTotalJobs] = useState(0);
  const [sourceCounts, setSourceCounts] = useState({ jsearch: 0, jobicy: 0, remotive: 0, jooble: 0 });
  const { user } = useAuth();

  const [currentPage, setCurrentPage] = useState(1);
  const JOBS_PER_PAGE = 12;
  const JOB_SESSION_KEY = 'job_listings_cache';
  const FILTERS_SESSION_KEY = 'job_filters_cache';

  const fetchJobs = async (filters: JobSearchFilters) => {
    setLoading(true);
    setError('');
    
    try {
      if (user) {
        
        // Build query parameters
        const params = new URLSearchParams();
        if (filters.query) params.append('query', filters.query);
        if (filters.location) params.append('location', filters.location);
        if (filters.work_from_home) params.append('work_from_home', 'true');
        if (filters.employment_types) params.append('employment_types', filters.employment_types);
        if (filters.job_requirements) params.append('job_requirements', filters.job_requirements);
        if (filters.company_types) params.append('company_types', filters.company_types);
        if (filters.radius !== 25) params.append('radius', filters.radius.toString());


        const data: ApiResponse = await fetchJobsFromApi(filters);

        
        if (data.success) {
          setJobs(data.jobs || []);
          setTotalJobs(data.totalJobs || 0);
          setSourceCounts(data.sources || { jsearch: 0, jobicy: 0, remotive: 0, jooble: 0 });
          
          // Cache results
          sessionStorage.setItem(JOB_SESSION_KEY, JSON.stringify(data.jobs));
          sessionStorage.setItem(FILTERS_SESSION_KEY, JSON.stringify(filters));
          
          setCurrentPage(1); // Reset to page 1 on new search
        } else {
          throw new Error('API returned unsuccessful response');
        }
      }
    } catch (err: any) {
      console.error('Error fetching jobs:', err);
      setError(err.response?.data?.message || 'Failed to load jobs. Please try again.');
      setJobs([]);
      setTotalJobs(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Try to load cached data on component mount
    const cachedJobs = sessionStorage.getItem(JOB_SESSION_KEY);
    const cachedFilters = sessionStorage.getItem(FILTERS_SESSION_KEY);
    
    if (cachedJobs && cachedFilters) {
      const jobs = JSON.parse(cachedJobs);
      setJobs(jobs);
      setTotalJobs(jobs.length);
    } else {
      // Load default jobs if no cache
      const defaultFilters: JobSearchFilters = {
        query: 'developer',
        location: '',
        work_from_home: false,
        employment_types: '',
        job_requirements: '',
        company_types: '',
        radius: 25
      };
      fetchJobs(defaultFilters);
    }
  }, []);

  const totalPages = Math.ceil(jobs.length / JOBS_PER_PAGE);

  const paginatedJobs = useMemo(() => {
    const start = (currentPage - 1) * JOBS_PER_PAGE;
    return jobs.slice(start, start + JOBS_PER_PAGE);
  }, [jobs, currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // Scroll to top when page changes
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSearch = (filters: JobSearchFilters) => {
    fetchJobs(filters);
  };

  const renderPaginationLinks = () => {
    const links = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      links.push(
        <PaginationItem key={i}>
          <PaginationLink
            onClick={() => handlePageChange(i)}
            isActive={currentPage === i}
            className="cursor-pointer"
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return links;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 ">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Job Listings</h1>
        <p className="text-muted-foreground">
          Find your next opportunity from {totalJobs.toLocaleString()} available positions
        </p>
      </div>

      {/* Job Filters */}
      <div className="mb-8">
        <JobFilters onSearch={handleSearch} />
      </div>

      {/* Source Statistics */}
      {totalJobs > 0 && (
        <Card className="mb-6 p-4">
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span>Sources:</span>
            {sourceCounts.jsearch > 0 && <span>JSearch: {sourceCounts.jsearch}</span>}
            {sourceCounts.jobicy > 0 && <span>Jobicy: {sourceCounts.jobicy}</span>}
            {sourceCounts.remotive > 0 && <span>Remotive: {sourceCounts.remotive}</span>}
            {sourceCounts.jooble > 0 && <span>Jooble: {sourceCounts.jooble}</span>}
          </div>
        </Card>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Searching for jobs...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <Card className="p-8 text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Something went wrong</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <button
            onClick={() => {
              const cachedFilters = sessionStorage.getItem(FILTERS_SESSION_KEY);
              const filters = cachedFilters ? JSON.parse(cachedFilters) : {
                query: 'developer',
                location: '',
                work_from_home: false,
                employment_types: '',
                job_requirements: '',
                company_types: '',
                radius: 25
              };
              fetchJobs(filters);
            }}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Try Again
          </button>
        </Card>
      )}

      {/* No Jobs Found */}
      {!loading && !error && jobs.length === 0 && (
        <Card className="p-8 text-center">
          <FileSearch className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No jobs found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search filters to find more opportunities.
          </p>
        </Card>
      )}

      {/* Job Listings */}
      {!loading && !error && paginatedJobs.length > 0 && (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
            {paginatedJobs.map((job) => (
              <JobCard
                key={job.jobId}
                job={job}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => handlePageChange(currentPage - 1)}
                      className={`cursor-pointer ${
                        currentPage === 1 ? 'pointer-events-none opacity-50' : ''
                      }`}
                    />
                  </PaginationItem>

                  {renderPaginationLinks()}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => handlePageChange(currentPage + 1)}
                      className={`cursor-pointer ${
                        currentPage === totalPages ? 'pointer-events-none opacity-50' : ''
                      }`}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}

          {/* Page Info */}
          <div className="text-center mt-6 text-sm text-muted-foreground">
            Showing {((currentPage - 1) * JOBS_PER_PAGE) + 1} to{' '}
            {Math.min(currentPage * JOBS_PER_PAGE, jobs.length)} of{' '}
            {jobs.length} jobs
          </div>
        </>
      )}
    </div>
  );
};

export default JobListingsPage;