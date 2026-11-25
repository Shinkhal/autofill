import { Building } from 'lucide-react';
import JobCard from './JobCard'
import { JobApplication } from './page';

interface JobListProps {
  jobs: JobApplication[];
  onEditJob: (job: JobApplication) => void;
  onDeleteJob: (id: string) => void;
}

export default function JobList({ jobs, onEditJob, onDeleteJob }: JobListProps) {
  if (jobs.length === 0) {
    return (
      <div className="text-center py-12">
        <Building className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
        <p className="text-gray-500 dark:text-gray-400">No job applications found</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {jobs.map((job) => (
        <JobCard
          key={job._id}
          job={job}
          onEdit={() => onEditJob(job)}
          onDelete={() => onDeleteJob(job._id)}
        />
      ))}
    </div>
  );
}