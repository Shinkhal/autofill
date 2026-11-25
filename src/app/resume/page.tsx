"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "@/api/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";
import ProtectedRoute from "@/components/ProtectedRoute";
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Star,
  Users,
  TrendingUp,
  Shield
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function ResumeUploadPage() {
  const {user} = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const router = useRouter();


  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === "application/pdf" || 
          droppedFile.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
          droppedFile.type === "application/msword") {
        setFile(droppedFile);
      } else {
        toast.error("Please upload only PDF or DOCX files");
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return toast.error("Please select a file");
    if (!user) return toast.error("Login First");

    const formData = new FormData();
    formData.append("resume", file);

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.post("/resume/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Resume uploaded successfully! Redirecting to your profile...");
      setTimeout(() => {
        router.push("/profile");
      }, 2000);
    } catch (error: any) {
      const msg =
        error.response?.data?.message ||
        error.response?.data ||
        error.message ||
        "Failed to upload resume";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Header Section */}
        <div className="pt-16 pb-8 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-6">
              <Upload className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Upload Your Resume
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Take the first step towards your dream job. Upload your resume and let our AI-powered system help you stand out from the crowd.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 pb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            
            {/* Upload Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                  Choose Your Resume
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Upload your resume in PDF or DOCX format (Max size: 10MB)
                </p>
              </div>

              {/* Drag & Drop Area */}
              <div
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                  dragActive
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : file
                    ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                    : "border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  id="resume"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileSelect}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                
                <div className="space-y-4">
                  {file ? (
                    <div className="flex items-center justify-center space-x-3">
                      <CheckCircle className="w-8 h-8 text-green-500" />
                      <div className="text-left">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {file.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <FileText className="w-12 h-12 text-gray-400 mx-auto" />
                      <div>
                        <p className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                          Drop your resume here
                        </p>
                        <p className="text-gray-500 dark:text-gray-400">
                          or click to browse files
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* File Info */}
              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    <p className="font-medium mb-1">Supported formats:</p>
                    <ul className="space-y-1">
                      <li>• PDF documents (.pdf)</li>
                      <li>• Microsoft Word (.docx, .doc)</li>
                      <li>• Maximum file size: 10MB</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Upload Button */}
              <Button 
                onClick={handleUpload} 
                disabled={loading || !user || !file} 
                className="w-full mt-6 h-12 text-lg font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Uploading...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Upload className="w-5 h-5" />
                    <span>Upload Resume</span>
                  </div>
                )}
              </Button>

              {!user && (
                <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-red-700 dark:text-red-400 text-center font-medium">
                    You need to be logged in to upload your resume.
                  </p>
                </div>
              )}
            </div>

            {/* Benefits Section */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Why Upload Your Resume?
                </h2>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Star className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                        AI-Powered Analysis
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        Our advanced AI analyzes your resume to identify strengths, gaps, and optimization opportunities.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                        Skill Enhancement
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        Get personalized recommendations to improve your skills and make your profile more attractive to employers.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                        Job Matching
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        Connect with opportunities that match your skills, experience, and career goals perfectly.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Shield className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                        Privacy Protected
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        Your resume is securely stored and encrypted. Only you control who can access your information.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Section */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
                <h3 className="text-lg font-semibold mb-4">Join Thousands of Successful Job Seekers</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">25,000+</div>
                    <div className="text-blue-100 text-sm">Resumes Analyzed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">85%</div>
                    <div className="text-blue-100 text-sm">Success Rate</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}