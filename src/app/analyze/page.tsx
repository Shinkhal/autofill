"use client";

import React, { useState, useEffect } from 'react';
import { Upload, FileText, BarChart3, CheckCircle, AlertCircle, Loader2, TrendingUp } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {LinearGauge} from '@/components/Score';
import { analyzeResumeScore } from '@/api';

// Type definitions
interface AnalysisResult {
  score: number;
  scoring_breakdown?: Record<string, number>;
  suggestions?: string[];
}

interface AuthContextType {
  user: any;
}

interface ApiErrorResponse {
  success: boolean;
  code?: string;
  message?: string;
}

const ResumeAnalyzer = () => {
  const { user }: AuthContextType = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState<string>('');
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string>('');

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const getAuthToken = (): string | null => {
    if (user) {
      return localStorage.getItem('token');
    } else {
      return null;
    }
  };

  const handleFileSelect = (selectedFile: File) => {
    if (!selectedFile) return;
    
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (!allowedTypes.includes(selectedFile.type)) {
      setError('Please select a PDF or DOCX file only.');
      return;
    }
    
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB.');
      return;
    }
    
    setFile(selectedFile);
    setError('');
    setAnalysisResult(null);
  };

  // Enhanced error handling function
  const showError = (message: string) => {
    setError(message);
    // Auto-clear error after 10 seconds
    setTimeout(() => {
      setError('');
    }, 10000);
  };

  // Enhanced error handling for API responses
  const handleApiError = (data: ApiErrorResponse) => {
    if (!data.success && data.code) {
      switch(data.code) {
        case 'INVALID_RESUME_FORMAT':
          showError('Please upload a valid resume document. The file format appears to be corrupted or unsupported.');
          break;
        case 'PDF_EXTRACTION_ERROR':
          showError('Unable to read the PDF file. Please ensure the PDF is not password-protected and try again.');
          break;
        case 'DOCX_EXTRACTION_ERROR':
          showError('Unable to read the Word document. Please ensure the file is not corrupted and try again.');
          break;
        case 'RATE_LIMIT_ERROR':
          showError('Service is currently busy due to high demand. Please wait a few minutes and try again.');
          break;
        case 'FILE_TOO_LARGE':
          showError('The uploaded file is too large. Please ensure your resume is under 5MB.');
          break;
        case 'INVALID_JOB_DESCRIPTION':
          showError('The job description appears to be too short or invalid. Please provide a detailed job description.');
          break;
        case 'AI_SERVICE_ERROR':
          showError('Our AI analysis service is temporarily unavailable. Please try again in a few minutes.');
          break;
        case 'AUTHENTICATION_ERROR':
          showError('Session expired. Please refresh the page and log in again.');
          break;
        case 'INSUFFICIENT_CREDITS':
          showError('You have reached your analysis limit. Please upgrade your plan or try again later.');
          break;
        default:
          showError(data.message || 'Something went wrong. Please try again or contact support if the issue persists.');
      }
    } else {
      showError('An unexpected error occurred. Please try again.');
    }
  };

  const analyzeResume = async () => {
    if (!file || !jobDescription.trim()) {
      showError('Please upload a resume and provide a job description.');
      return;
    }
    
    setIsAnalyzing(true);
    setError('');
    
    const formData = new FormData();
    formData.append('resume', file);
    formData.append('jd', jobDescription);
    
    try {
      
      
      const data = await analyzeResumeScore(file, jobDescription);
      
      // Handle API response errors
      if (!data.success) {
        handleApiError(data);
        return;
      }
      
      setAnalysisResult(data.result || data);
      
    } catch (error: any) {
      console.error('Analysis error:', error);
      
      if (error.code === 'ECONNABORTED') {
        showError('Request timed out. The analysis is taking longer than expected. Please try again.');
      } else if (error.response) {
        // Server responded with error status
        const status = error.response.status;
        const data = error.response.data;
        
        if (data && !data.success) {
          handleApiError(data);
        } else {
          switch (status) {
            case 400:
              showError('Invalid request. Please check your file and job description.');
              break;
            case 401:
              showError('Authentication failed. Please log in again.');
              break;
            case 403:
              showError('Access denied. Please check your account permissions.');
              break;
            case 413:
              showError('File too large. Please upload a smaller resume file.');
              break;
            case 429:
              showError('Too many requests. Please wait a moment before trying again.');
              break;
            case 500:
              showError('Server error occurred. Please try again later.');
              break;
            case 502:
            case 503:
            case 504:
              showError('Service temporarily unavailable. Please try again in a few minutes.');
              break;
            default:
              showError(`Server error (${status}). Please try again or contact support.`);
          }
        }
      } else if (error.request) {
        // Network error
        showError('Network connection error. Please check your internet connection and try again.');
      } else {
        // Other error
        showError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              AI-Powered Resume Analyzer
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Upload your resume and job description to get detailed ATS compatibility analysis
            </p>
          </div>

          {/* File Upload and Job Description Area */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Resume Upload */}
            <Card className="border-0 shadow-xl bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                  <Upload className="h-5 w-5" />
                  Upload Resume
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Upload your PDF or DOCX resume file (max 5MB)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                    dragActive
                      ? 'border-blue-400 bg-blue-50 dark:border-blue-500 dark:bg-blue-900/20'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <Upload className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    Drag and drop your PDF or DOCX file here, or click to browse
                  </p>
                  <input
                    type="file"
                    accept=".pdf,.docx"
                    onChange={(e) => {
                      const files = e.target.files;
                      if (files && files[0]) {
                        handleFileSelect(files[0]);
                      }
                    }}
                    className="hidden"
                    id="file-upload"
                  />
                  <Button asChild className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600">
                    <label htmlFor="file-upload" className="cursor-pointer">
                      Choose File
                    </label>
                  </Button>
                </div>

                {file && (
                  <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 text-green-600 dark:text-green-400 mr-2" />
                      <span className="text-green-800 dark:text-green-200 font-medium text-sm">{file.name}</span>
                      <Badge variant="secondary" className="ml-2 text-xs bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-300">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </Badge>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Job Description Input */}
            <Card className="border-0 shadow-xl bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                  <FileText className="h-5 w-5" />
                  Job Description
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Paste the job description you're applying for
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job description here..."
                  className="min-h-[200px] resize-none border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                />
                
                <div className="flex justify-between items-center mt-3">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {jobDescription.length} characters
                  </span>
                  {jobDescription.trim() && (
                    <Badge variant="secondary" className="flex items-center gap-1 bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-300">
                      <CheckCircle className="h-3 w-3" />
                      Ready
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Error Display */}
          {error && (
            <Alert className="mb-8 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
              <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
              <AlertDescription className="text-red-800 dark:text-red-200">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {/* Action Button */}
          {(file || jobDescription.trim()) && (
            <div className="flex justify-center mb-8">
              <Button
                onClick={analyzeResume}
                disabled={isAnalyzing || !file || !jobDescription.trim()}
                size="lg"
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white font-semibold transform hover:scale-105 transition-all duration-200"
              >
                {isAnalyzing ? (
                  <Loader2 className="animate-spin h-5 w-5 mr-2" />
                ) : (
                  <BarChart3 className="h-5 w-5 mr-2" />
                )}
                {isAnalyzing ? 'Analyzing...' : 'Analyze Resume vs Job Description'}
              </Button>
            </div>
          )}

          {/* Analysis Results */}
          {analysisResult && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {/* Score Card with Speedometer */}
              <Card className="border-0 shadow-xl bg-white dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                    <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    ATS Compatibility Score
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    How well your resume matches the job requirements
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <LinearGauge score={analysisResult.score} />

                  {/* Scoring Breakdown */}
                  {analysisResult.scoring_breakdown && (
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Score Breakdown</h3>
                      <div className="space-y-4">
                        {Object.entries(analysisResult.scoring_breakdown).map(([key, value]) => (
                          <div key={key} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                                {key.replace('_', ' ')}
                              </span>
                              <Badge variant="outline" className="bg-gray-50 dark:bg-gray-700">
                                {Number(value)}%
                              </Badge>
                            </div>
                            <Progress 
                              value={Number(value)} 
                              className="h-2 bg-gray-200 dark:bg-gray-700" 
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Suggestions */}
              <Card className="border-0 shadow-xl bg-white dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                    <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                    Improvement Suggestions
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    Actionable recommendations to boost your ATS score
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analysisResult.suggestions?.map((suggestion: string, index: number) => (
                      <div key={index} className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <div className="flex items-start gap-3">
                          <Badge className="flex-shrink-0 w-6 h-6 bg-blue-600 dark:bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </Badge>
                          <p className="text-blue-800 dark:text-blue-200 text-sm leading-relaxed">{suggestion}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Features Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center border-0 shadow-lg bg-white dark:bg-gray-800">
              <CardContent className="pt-6">
                <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Detailed Scoring</h3>
                <p className="text-gray-600 dark:text-gray-300">Get comprehensive ATS compatibility scores with detailed breakdowns</p>
              </CardContent>
            </Card>
            
            <Card className="text-center border-0 shadow-lg bg-white dark:bg-gray-800">
              <CardContent className="pt-6">
                <div className="bg-green-100 dark:bg-green-900/30 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Smart Suggestions</h3>
                <p className="text-gray-600 dark:text-gray-300">Receive actionable recommendations to improve your resume</p>
              </CardContent>
            </Card>
            
            <Card className="text-center border-0 shadow-lg bg-white dark:bg-gray-800">
              <CardContent className="pt-6">
                <div className="bg-purple-100 dark:bg-purple-900/30 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Performance Insights</h3>
                <p className="text-gray-600 dark:text-gray-300">Understand how different aspects of your resume perform</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default ResumeAnalyzer;