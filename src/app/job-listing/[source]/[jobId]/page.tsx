"use client";

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {MapPin, Building, Calendar, DollarSign, Briefcase, ExternalLink, AlertCircle, Globe, Users, Award, Share2} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { JobDetails } from '@/types/jobTypes';
import { fetchJobDetails } from '@/api';
import { toast } from 'react-toastify';

// In-memory cache
const jobCache = new Map<string, { data: JobDetails; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000;

const JobDetailsPage = () => {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [job, setJob] = useState<JobDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const source = params.source as string;
  const jobId = params.jobId as string;
  const cacheKey = useMemo(() => `${source}-${jobId}`, [source, jobId]);

  const getCachedJob = useCallback((key: string): JobDetails | null => {
    const cached = jobCache.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) return cached.data;
    if (cached) jobCache.delete(key);
    return null;
  }, []);

  const setCachedJob = useCallback((key: string, data: JobDetails) => {
    jobCache.set(key, { data, timestamp: Date.now() });
  }, []);

  const loadJobDetails = useCallback(async () => {
    if (!source || !jobId) return;
    setLoading(true);
    setError('');
    const cachedJob = getCachedJob(cacheKey);
    if (cachedJob) {
      setJob(cachedJob);
      setLoading(false);
      return;
    }
    try {
      const jobData = await fetchJobDetails(source, jobId);
      setJob(jobData);
      setCachedJob(cacheKey, jobData);
    } catch (err: any) {
      console.error('Error fetching job details:', err);
      setError(err.message || 'Failed to load job details.');
    } finally {
      setLoading(false);
    }
  }, [source, jobId, cacheKey, getCachedJob, setCachedJob]);

  useEffect(() => {
    if (!user) {
      router.push('/');
      return;
    }
    if (source && jobId) loadJobDetails();
  }, [source, jobId, user, loadJobDetails, router]);

  const formattedDate = useMemo(() => {
    if (!job?.postedDate) return '';
    try {
      return new Date(job.postedDate).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return job.postedDate;
    }
  }, [job?.postedDate]);

  const formattedSalary = useMemo(() => {
    if (!job) return null;
    if (job.salary && job.salary !== 'null') return job.salary;
    const currency = job.salaryCurrency || '$';
    const period = job.salaryPeriod || 'year';
    if (job.salaryMin && job.salaryMax)
      return `${currency}${job.salaryMin.toLocaleString()} - ${currency}${job.salaryMax.toLocaleString()}/${period}`;
    if (job.salaryMin)
      return `${currency}${job.salaryMin.toLocaleString()}+/${period}`;
    return null;
  }, [job]);

  const getEmploymentTypeColor = useCallback((type: string) => {
    switch (type?.toLowerCase()) {
      case 'fulltime':
      case 'full-time':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
      case 'parttime':
      case 'part-time':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300';
      case 'contract':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300';
      case 'intern':
      case 'internship':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300';
    }
  }, []);

  const handleApply = useCallback(() => {
    if (job?.applyLink) window.open(job.applyLink, '_blank');
  }, [job?.applyLink]);

  const handleShare = useCallback(async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${job?.role} at ${job?.company}`,
          text: `Check out this job opportunity: ${job?.role} at ${job?.company}`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Job link copied to clipboard!');
      }
    } catch (err) {
      console.log('Error sharing:', err);
    }
  }, [job]);

  const handleBrowseJobs = () => router.push('/job-listing');

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Skeleton className="h-10 w-32 mb-4" />
        <Card>
          <CardHeader>
            <div className="flex items-start gap-4">
              <Skeleton className="w-16 h-16 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-6 w-1/2" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        
        <Card className="p-8 text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Job Not Found</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={handleBrowseJobs}>Browse Other Jobs</Button>
        </Card>
      </div>
    );
  }

  if (!job) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      

      <Card className="mb-6">
        <CardHeader className="pb-6">
          <div className="flex flex-col md:flex-row md:items-start gap-6">
            <div className="flex items-start gap-4 flex-1">
              {job.companyLogo && (
                <img
                  src={job.companyLogo}
                  alt={`${job.company} logo`}
                  className="w-20 h-20 rounded-xl object-contain bg-white p-2 border shadow-sm"
                  onError={(e) => (e.currentTarget.style.display = 'none')}
                />
              )}
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">{job.source}</Badge>
                  {(job.employmentType || job.jobType) && (
                    <Badge variant="outline" className={getEmploymentTypeColor(job.employmentType || job.jobType || '')}>
                      {job.employmentType || job.jobType}
                    </Badge>
                  )}
                  {job.isRemote && (
                    <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Remote</Badge>
                  )}
                </div>
                <CardTitle className="text-3xl font-bold mb-2">{job.role}</CardTitle>
                <CardDescription className="flex items-center gap-2 text-lg">
                  <Building className="h-5 w-5 text-blue-500" />
                  <span className="font-medium">{job.company}</span>
                </CardDescription>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" /> Share
              </Button>
              <Button onClick={handleApply} className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md">
                Apply Now
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Location</p>
                <p className="font-medium">{job.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Posted</p>
                <p className="font-medium">{formattedDate}</p>
              </div>
            </div>
            {formattedSalary && (
              <div className="flex items-center gap-3">
                <DollarSign className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Salary</p>
                  <p className="font-medium text-green-600 dark:text-green-400">{formattedSalary}</p>
                </div>
              </div>
            )}
            {job.category && (
              <div className="flex items-center gap-3">
                <Briefcase className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="font-medium">{job.category}</p>
                </div>
              </div>
            )}
          </div>

          <Separator className="my-6" />

          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Job Description</h3>
            <div className="prose prose-gray dark:prose-invert max-w-none" dangerouslySetInnerHTML={{
              __html: job.description?.replace(/\n/g, '<br>') || ''
            }} />
          </div>

          {job.requirements?.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Requirements</h3>
              <ul className="space-y-2">
                {job.requirements.map((req, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {job.skills?.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill, index) => (
                  <Badge key={index} variant="outline" className="bg-gray-50 dark:bg-gray-800">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {job.benefits?.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Benefits</h3>
              <ul className="space-y-2">
                {job.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Award className="w-4 h-4 text-green-500 mt-1" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {job.companyDescription && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">About the Company</h3>
              <p className="text-muted-foreground leading-relaxed">
                {job.companyDescription}
              </p>
              {(job.industry || job.companySize) && (
                <div className="flex flex-wrap gap-6 mt-4">
                  {job.industry && (
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">Industry: <span className="font-medium">{job.industry}</span></span>
                    </div>
                  )}
                  {job.companySize && (
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-purple-500" />
                      <span className="text-sm">Size: <span className="font-medium">{job.companySize}</span></span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <Separator className="my-6" />

          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Ready to apply?</h3>
            <p className="text-muted-foreground mb-4">Click the button below to apply directly on {job.source}</p>
            <Button onClick={handleApply} size="lg" className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md">
              Apply Now on {job.source}
              <ExternalLink className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default JobDetailsPage;
