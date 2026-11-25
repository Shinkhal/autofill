import { Edit, Trash2, Building, Calendar, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { JobApplication } from './page'

interface JobCardProps {
  job: JobApplication;
  onEdit: () => void;
  onDelete: () => void;
}

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'Applied': return 'default';
    case 'Interview': return 'secondary';
    case 'Offer': return 'outline';
    case 'Rejected': return 'destructive';
    default: return 'default';
  }
};

export default function JobCard({ job, onEdit, onDelete }: JobCardProps) {
  return (
    <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Building className="h-5 w-5 text-gray-400 dark:text-gray-500" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{job.company}</h3>
              <Badge variant={getStatusVariant(job.status)}>
                {job.status}
              </Badge>
            </div>
            
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-3">{job.role}</p>
            
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {new Date(job.dateApplied).toLocaleDateString()}
              </div>
              {job.jobLink && (
                <a 
                  href={job.jobLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  <ExternalLink className="h-4 w-4" />
                  View Job
                </a>
              )}
            </div>
            
            {job.notes && (
              <p className="text-gray-600 dark:text-gray-400 mt-3 line-clamp-2">{job.notes}</p>
            )}
          </div>
          
          <div className="flex items-center gap-2 ml-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onEdit}
              className="text-gray-400 hover:text-blue-500 dark:text-gray-500 dark:hover:text-blue-400"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-gray-900 dark:text-white">
                    Delete Job Application
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
                    Are you sure you want to delete this job application? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={onDelete}
                    className="bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}