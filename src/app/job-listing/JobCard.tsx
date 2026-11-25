'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { MapPin, Building, Calendar, Eye, DollarSign, Clock, Briefcase } from 'lucide-react';
import { Job } from '@/types/jobTypes';

interface JobCardProps {
  job: Job;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const router = useRouter();

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const formatSalary = () => {
    // Handle different salary formats from different sources
    if (job.salary && job.salary !== 'null' && job.salary !== '') {
      return job.salary;
    }

    if (job.salaryMin && job.salaryMax) {
      const currency = job.salaryCurrency || '$';
      const period = job.salaryPeriod || 'year';
      return `${currency}${job.salaryMin.toLocaleString()} - ${currency}${job.salaryMax.toLocaleString()}/${period}`;
    }

    if (job.salaryMin) {
      const currency = job.salaryCurrency || '$';
      const period = job.salaryPeriod || 'year';
      return `${currency}${job.salaryMin.toLocaleString()}+/${period}`;
    }

    return null;
  };

  const handleViewDetails = () => {
    // Navigate to job details page with source and jobId
    router.push(`/job-listing/${job.source.toLowerCase()}/${job.jobId}`);
  };

  const getEmploymentTypeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'fulltime':
      case 'full-time':
        return 'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-300';
      case 'parttime':
      case 'part-time':
        return 'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-300';
      case 'contract':
        return 'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-300';
      case 'intern':
      case 'internship':
        return 'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const salary = formatSalary();

  return (
    <Card className="group hover:shadow-sm transition-all duration-300 border-l-4 border-l-transparent hover:border-l-slate-500      mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-3">
              {job.companyLogo && (
                <img
                  src={job.companyLogo}
                  alt={`${job.company} logo`}
                  className="w-12 h-12 rounded-lg object-contain bg-white p-1 border"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              )}
              <div className="flex-1">
                <CardTitle className="text-xl font-bold group-hover:text-slate-600 transition-colors duration-200 line-clamp-2">
                  {job.role}
                </CardTitle>
                <CardDescription className="flex items-center gap-2 text-base mt-1">
                  <Building className="h-4 w-4 text-slate-500" />
                  <span className="font-medium">{job.company}</span>
                </CardDescription>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2 ml-3">
            <Badge
              variant="secondary"
              className="bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-900/30 dark:text-slate-300"
            >
              {job.source}
            </Badge>
            {(job.employmentType || job.jobType) && (
              <Badge
                variant="outline"
                className={getEmploymentTypeColor(job.employmentType || job.jobType || '')}
              >
                {job.employmentType || job.jobType}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-slate-500 flex-shrink-0" />
            <span className="font-medium">
              {job.location}
              {job.isRemote && (
                <Badge variant="outline" className="ml-2 text-xs bg-slate-50 text-slate-600 border-slate-200">
                  Remote
                </Badge>
              )}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-slate-500 flex-shrink-0" />
            <span>{formatDate(job.postedDate)}</span>
          </div>

          {salary && (
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-slate-500 flex-shrink-0" />
              <span className="font-medium text-slate-600 dark:text-slate-400">{salary}</span>
            </div>
          )}

          {job.category && (
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-slate-500 flex-shrink-0" />
              <span>{job.category}</span>
            </div>
          )}
        </div>

        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
          {job.description?.replace(/<[^>]*>/g, '').substring(0, 200)}
          {job.description?.length > 200 && '...'}
        </p>

        <Separator className="my-4" />

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>Posted {formatDate(job.postedDate)}</span>
          </div>

          <Button
            onClick={handleViewDetails}
            className="group/btn bg-slate-800 hover:bg-slate-700 text-white shadow-sm hover:shadow-sm transition-all duration-200"
            size="sm"
          >
            View Details
            <Eye className="ml-2 h-4 w-4 group-hover/btn:scale-110 transition-transform duration-200" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobCard;
