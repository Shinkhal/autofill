'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, ArrowUpRight, MapPin } from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { fetchJobDetails } from '@/api';
import { message } from '@/lib/api';
import type { JobDetails } from '@/types/jobTypes';
import { jobDate, jobSalary, jobType } from '../../JobCard';

function Details() {
  const { source, jobId } = useParams<{ source: string; jobId: string }>();
  const [job, setJob] = useState<JobDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    fetchJobDetails(source, jobId).then(data => {
      if (active) setJob(data);
    }).catch(err => {
      if (active) setError(message(err));
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, [source, jobId, attempt]);

  const salary = job && jobSalary(job);
  const date = job && jobDate(job.postedDate);
  const type = job && jobType(job.employmentType || job.jobType);
  const canApply = job?.applyLink && /^https?:\/\//i.test(job.applyLink);
  const facts = job ? [
    ['Employment', type], ['Workplace', job.isRemote ? 'Remote' : null],
    ['Salary', salary], ['Posted', date], ['Category', job.category],
    ['Experience', job.experience], ['Education', job.education],
    ['Industry', job.industry], ['Company size', job.companySize], ['Source', job.source]
  ].filter(([, value]) => value) : [];

  return <main className="shell job-detail-shell">
    <Link href="/job-listing" className="job-back"><ArrowLeft size={16} />All job listings</Link>
    {loading ? <div className="panel job-detail-loading" role="status">Loading job details…</div> : error ? (
      <section className="panel stack" role="alert"><h1>Couldn’t load this job</h1><p>{error}</p><div><button className="btn outline" onClick={() => setAttempt(n => n + 1)}>Try again</button></div></section>
    ) : job && <>
      <header className="job-detail-header">
        <div className="job-detail-heading">
          <div className="listing-company">
            {job.companyLogo && <img src={job.companyLogo} alt="" onError={e => { e.currentTarget.style.display = 'none'; }} />}
            <span>{job.company || 'Company not specified'}</span>
          </div>
          <h1>{job.role || 'Untitled role'}</h1>
          <p className="listing-location"><MapPin size={16} />{job.location || 'Location not specified'}{job.isRemote && <span className="job-remote">Remote</span>}</p>
        </div>
        <div className="job-apply">
          {canApply ? <><a className="btn" href={job.applyLink} target="_blank" rel="noopener noreferrer">Apply for this role<ArrowUpRight size={17} /></a><p>Opens on the employer’s or provider’s site</p></> : <p>Application link unavailable</p>}
        </div>
      </header>
      <div className="job-detail-layout">
        <article className="job-detail-content">
          <section><h2>About the role</h2><p className="job-description">{job.description || 'No description was provided for this role.'}</p></section>
          {Array.isArray(job.requirements) && job.requirements.length > 0 && <section><h2>What you’ll bring</h2><ul>{job.requirements.map((item, i) => <li key={i}>{item}</li>)}</ul></section>}
          {Array.isArray(job.skills) && job.skills.length > 0 && <section><h2>Skills</h2><div className="listing-tags">{job.skills.map((item, i) => <span key={i}>{item}</span>)}</div></section>}
          {Array.isArray(job.benefits) && job.benefits.length > 0 && <section><h2>Benefits</h2><ul>{job.benefits.map((item, i) => <li key={i}>{item}</li>)}</ul></section>}
          {job.companyDescription && <section><h2>About {job.company || 'the company'}</h2><p className="job-description">{job.companyDescription}</p></section>}
        </article>
        <aside className="job-facts"><h2>At a glance</h2><dl>{facts.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl></aside>
      </div>
    </>}
  </main>;
}

export default function JobDetailsPage() {
  return <ProtectedRoute><Details /></ProtectedRoute>;
}
