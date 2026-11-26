'use client';

import Link from 'next/link';
import { Bookmark, Check, MapPin, ArrowUpRight } from 'lucide-react';
import type { Job } from '@/types/jobTypes';

interface JobCardProps {
  job: Job;
  onSave: () => void;
  saving: boolean;
  saved: boolean;
}

export function jobSalary(job: Job) {
  if (job.salary && job.salary !== 'null') return job.salary;
  const currency = job.salaryCurrency || '$';
  const period = job.salaryPeriod || 'year';
  if (job.salaryMin && job.salaryMax) return `${currency}${job.salaryMin.toLocaleString()} – ${currency}${job.salaryMax.toLocaleString()} / ${period}`;
  if (job.salaryMin) return `${currency}${job.salaryMin.toLocaleString()}+ / ${period}`;
  return null;
}

export function jobDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function jobType(value?: string) {
  if (!value) return null;
  return ({ FULLTIME: 'Full time', PARTTIME: 'Part time', CONTRACTOR: 'Contract', INTERN: 'Internship' } as Record<string, string>)[value.toUpperCase()] || value;
}

export default function JobCard({ job, onSave, saving, saved }: JobCardProps) {
  const salary = jobSalary(job);
  const date = jobDate(job.postedDate);
  const type = jobType(job.employmentType || job.jobType);
  const href = `/job-listing/${encodeURIComponent(job.source.toLowerCase())}/${encodeURIComponent(job.jobId)}`;
  return (
    <article className="listing-card">
      <header className="listing-card-top">
        <div className="listing-company">
          {job.companyLogo && <img src={job.companyLogo} alt="" onError={e => { e.currentTarget.style.display = 'none'; }} />}
          <span>{job.company || 'Company not specified'}</span>
        </div>
        <button type="button" className="listing-save" onClick={onSave} disabled={saving || saved || !job.company || !job.role}
          aria-label={saved ? `${job.role} saved to tracker` : `Save ${job.role} to tracker`} aria-pressed={saved}
          title={saved ? 'Saved to tracker' : 'Save to tracker'}>
          {saved ? <Check size={18} /> : <Bookmark size={18} />}
        </button>
      </header>
      <h2 className="listing-title"><Link href={href}>{job.role || 'Untitled role'}<ArrowUpRight size={18} aria-hidden="true" /></Link></h2>
      <p className="listing-location"><MapPin size={14} aria-hidden="true" />{job.location || 'Location not specified'}</p>
      {(type || job.isRemote) && <div className="listing-tags">{type && <span>{type}</span>}{job.isRemote && <span>Remote</span>}</div>}
      <p className="listing-preview">{job.description?.replace(/<[^>]*>/g, '').trim() || 'Open this role to explore the opportunity.'}</p>
      {salary && <p className="listing-salary">{salary}</p>}
      <footer className="listing-card-footer"><span>Via {job.source}</span><span>{saved ? 'Saved to tracker' : date ? `Posted ${date}` : 'Date unavailable'}</span></footer>
    </article>
  );
}
