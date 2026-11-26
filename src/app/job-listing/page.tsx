'use client';

import React, { useEffect, useState, useMemo, useRef } from 'react';
import { Workspace } from '@/components/Workspace';
import { api, json, message } from '@/lib/api';
import JobCard from '@/app/job-listing/JobCard';
import JobFilters from '@/app/job-listing/JobFilter';
import { useAuth } from '@/context/AuthContext';
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationNext, PaginationLink } from '@/components/ui/pagination';
import { Card } from '@/components/ui/card';
import { Loader2, AlertCircle, FileSearch } from 'lucide-react';
import { fetchJobsFromApi } from '@/api';
import { Job, JobSearchFilters, ApiResponse } from '@/types/jobTypes';

const JobListingsPage = () => {
  const requestId = useRef(0);
  const [saved, setSaved] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [filters, setFilters] = useState<JobSearchFilters>({
    query: 'developer', location: '', work_from_home: false,
    employment_types: '', job_requirements: '', company_types: '', radius: 25
  });
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [totalJobs, setTotalJobs] = useState(0);
  const [sourceCounts, setSourceCounts] = useState({ jsearch: 0, jobicy: 0, remotive: 0, jooble: 0 });
  const { user, loading: authLoading } = useAuth();

  const [currentPage, setCurrentPage] = useState(1);
  const JOBS_PER_PAGE = 12;
  const fetchJobs = async (nextFilters: JobSearchFilters) => {
    const id = ++requestId.current;
    setFilters(nextFilters);
    setLoading(true);
    setError('');
    try {
      const data: ApiResponse = await fetchJobsFromApi(nextFilters);
      if (id !== requestId.current) return;
      if (!data.success) throw new Error('Failed to load jobs. Please try again.');
      setJobs(data.jobs || []);
      setTotalJobs(data.totalJobs || 0);
      setSourceCounts(data.sources || { jsearch: 0, jobicy: 0, remotive: 0, jooble: 0 });
      setCurrentPage(1);
    } catch (err) {
      if (id !== requestId.current) return;
      setError(message(err));
      setJobs([]);
      setTotalJobs(0);
    } finally {
      if (id === requestId.current) setLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading || !user) return;
    void fetchJobs(filters);
    return () => { requestId.current += 1; };
  }, [authLoading, user]);

  const saveJob = async (job: Job) => {
    setSaving(true);
    setSaveError('');
    try {
      await api('/api/jobs', json('POST', {
        company: job.company, role: job.role, location: job.location || '',
        source: job.source, jobLink: job.applyLink || '', status: 'Saved'
      }));
      setSaved(previous => [...previous, `${job.source}:${job.jobId}`]);
    } catch (err) {
      setSaveError(message(err));
    } finally {
      setSaving(false);
    }
  };

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
    <Workspace title="Job Listings" description="Find your next opportunity and save jobs to your application tracker.">
      {/* Job Filters */}
      <div className="mb-8">
        <JobFilters onSearch={handleSearch} />
        {saveError && <p className="error" role="alert">{saveError}</p>}
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
            onClick={() => void fetchJobs(filters)}
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
          <div className="job-listing-grid">
            {paginatedJobs.map((job) => (
              <JobCard
                key={`${job.source}:${job.jobId}`}
                job={job}
                onSave={() => void saveJob(job)}
                saving={saving}
                saved={saved.includes(`${job.source}:${job.jobId}`)}
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
    </Workspace>
  );
};

export default JobListingsPage;
