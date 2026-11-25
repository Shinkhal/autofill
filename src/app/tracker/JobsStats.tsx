import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { JobApplication } from './page';

interface JobStatsProps {
  jobs: JobApplication[];
}

export default function JobStats({ jobs }: JobStatsProps) {
  const stats = {
    total: jobs.length,
    applied: jobs.filter(j => j.status === 'Applied').length,
    interview: jobs.filter(j => j.status === 'Interview').length,
    offer: jobs.filter(j => j.status === 'Offer').length,
    rejected: jobs.filter(j => j.status === 'Rejected').length
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Total Applications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
        </CardContent>
      </Card>
      
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Applied
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {stats.applied}
          </p>
        </CardContent>
      </Card>
      
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Interview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
            {stats.interview}
          </p>
        </CardContent>
      </Card>
      
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Offers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {stats.offer}
          </p>
        </CardContent>
      </Card>
      
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Rejected
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">
            {stats.rejected}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}