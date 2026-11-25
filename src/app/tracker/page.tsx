'use client';

import { useState, useEffect } from 'react';
import axios from '@/api/axios';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-toastify';
import ProtectedRoute from '@/components/ProtectedRoute';
import JobStats from './JobsStats';
import JobControls from './JobControls';
import JobList from './JobList';
import JobModal from './JobModel';

export interface JobApplication {
  _id: string;
  company: string;
  role: string; // Changed from 'position' to match backend
  status: 'Applied' | 'Interview' | 'Rejected' | 'Offer'; // Updated to match backend enum
  dateApplied: string; // Changed from 'applicationDate' to match backend
  jobLink?: string; // Changed from 'jobUrl' to match backend
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface JobFormData {
  company: string;
  role: string; // Changed from 'position' to match backend
  status: 'Applied' | 'Interview' | 'Rejected' | 'Offer'; // Updated to match backend enum
  dateApplied: string; // Changed from 'applicationDate' to match backend
  jobLink: string; // Changed from 'jobUrl' to match backend
  notes: string;
}

const initialFormData: JobFormData = {
  company: '',
  role: '',
  status: 'Applied',
  dateApplied: '',
  jobLink: '',
  notes: ''
};

export default function JobDashboard() {
  const { user } = useAuth();
  const [token, setToken] = useState<string | null>(null);
  const [jobs, setJobs] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingJob, setEditingJob] = useState<JobApplication | null>(null);
  const [formData, setFormData] = useState<JobFormData>(initialFormData);

  const fetchJobs = async () => {
    if (!token) return;
    
    try {
      const response = await axios.get(`/jobs`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response) {
        setJobs(response.data);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      let response;
      if (editingJob) {
        response = await axios.put(`/jobs/${editingJob._id}`, formData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      } else {
        response = await axios.post('/jobs', formData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }

      if (response) {
        fetchJobs();
        setShowModal(false);
        resetForm();
        toast.success(editingJob ? 'Job updated successfully' : 'Job created successfully');
      }
    } catch (error) {
      console.error('Error saving job:', error);
      toast.error('Failed to save job');
    }
  };

  const handleDelete = async (id: string) => {
    if (!token) return;

    try {
      const response = await axios.delete(`/jobs/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response) {
        fetchJobs();
        toast.success('Job deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting job:', error);
      toast.error('Failed to delete job');
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setEditingJob(null);
  };

  const openModal = (job?: JobApplication) => {
    if (job) {
      setEditingJob(job);
      setFormData({
        company: job.company,
        role: job.role,
        status: job.status,
        dateApplied: job.dateApplied.split('T')[0], // Format date for input
        jobLink: job.jobLink || '',
        notes: job.notes || ''
      });
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  useEffect(() => {
    if (user) {
      const storedToken = localStorage.getItem('token');
      setToken(storedToken);
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      fetchJobs();
    }
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 dark:border-blue-400"></div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Job Applications</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">Track and manage your job applications</p>
          </div>

          <JobStats jobs={jobs} />
          
          <JobControls
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            onAddJob={() => openModal()}
          />

          <JobList
            jobs={filteredJobs}
            onEditJob={openModal}
            onDeleteJob={handleDelete}
          />

          <JobModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSubmit}
            isEditing={!!editingJob}
          />
        </div>
      </div>
    </ProtectedRoute>
  );
}