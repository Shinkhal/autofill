'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Search, MapPin, Briefcase, Filter, X, Home, Clock, Building2 } from 'lucide-react';
import { JobSearchFilters } from '@/types/jobTypes';

interface Props {
  onSearch: (filters: JobSearchFilters) => void;
}


const JobFilters: React.FC<Props> = ({ onSearch }) => {
  const [filters, setFilters] = useState<JobSearchFilters>({
    query: '',
    location: '',
    work_from_home: false,
    employment_types: '',
    job_requirements: '',
    company_types: '',
    radius: 25
  });

  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(filters);
  };

  const handleClear = () => {
    const clearedFilters: JobSearchFilters = {
      query: '',
      location: '',
      work_from_home: false,
      employment_types: '',
      job_requirements: '',
      company_types: '',
      radius: 25
    };
    setFilters(clearedFilters);
    onSearch(clearedFilters);
  };

  const updateFilter = (key: keyof JobSearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const hasActiveFilters = () => {
    return filters.query || filters.location || filters.work_from_home ||
           filters.employment_types || filters.job_requirements || filters.company_types;
  };

  const popularSearches = [
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'Data Scientist',
    'Product Manager',
    'UX Designer',
    'DevOps Engineer',
    'Mobile Developer',
    'Machine Learning Engineer',
    'Software Architect'
  ];

  const popularLocations = [
    'Mumbai',
    'Bangalore',
    'Delhi',
    'Hyderabad',
    'Chennai',
    'Pune',
    'Kolkata',
    'Gurgaon',
    'Remote'
  ];

  const employmentTypes = [
    { value: 'FULLTIME', label: 'Full Time' },
    { value: 'PARTTIME', label: 'Part Time' },
    { value: 'CONTRACTOR', label: 'Contract' },
    { value: 'INTERN', label: 'Internship' }
  ];

  const experienceLevels = [
    { value: 'no_experience', label: 'Entry Level' },
    { value: 'under_3_years_experience', label: 'Junior (1-3 years)' },
    { value: 'more_than_3_years_experience', label: 'Mid Level (3+ years)' },
    { value: 'senior_level', label: 'Senior Level (5+ years)' }
  ];

  const companyTypes = [
    { value: 'startup', label: 'Startup' },
    { value: 'mid_size', label: 'Mid Size' },
    { value: 'large', label: 'Large Company' },
    { value: 'enterprise', label: 'Enterprise' }
  ];

  return (
    <Card className="mb-8 shadow-sm border-0     ">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="p-2 bg-slate-100 rounded-lg dark:bg-slate-900/30">
                <Search className="h-6 w-6 text-slate-600" />
              </div>
              Find Your Dream Job
            </CardTitle>
            <CardDescription className="text-base">
              Discover opportunities from top companies across India
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {hasActiveFilters() && (
              <div className="px-2 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium">
                {Object.values(filters).filter(v => v && v !== '' && v !== 25).length} filters
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-muted-foreground"
            >
              <Filter className="h-4 w-4 mr-2" />
              {isExpanded ? 'Simple' : 'Advanced'}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Basic Search */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="job-query" className="text-sm font-medium flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Job Title or Keywords
              </Label>
              <Input
                id="job-query"
                type="text"
                placeholder="e.g. Frontend Developer, React, Python"
                value={filters.query}
                onChange={(e) => updateFilter('query', e.target.value)}
                className="h-12 text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="text-sm font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Location
              </Label>
              <Input
                id="location"
                type="text"
                placeholder="e.g. Mumbai, Bangalore, Remote"
                value={filters.location}
                onChange={(e) => updateFilter('location', e.target.value)}
                className="h-12 text-base"
              />
            </div>
          </div>

          {/* Remote Work Toggle */}
          <div className="flex items-center justify-between p-4      rounded-lg border">
            <div className="flex items-center gap-3">
              <Home className="h-5 w-5 text-slate-600" />
              <div>
                <Label className="text-sm font-medium">Remote Work Only</Label>
                <p className="text-xs text-muted-foreground">Show only remote job opportunities</p>
              </div>
            </div>
            <Switch
              checked={filters.work_from_home}
              onCheckedChange={(checked) => updateFilter('work_from_home', checked)}
            />
          </div>

          {/* Advanced Filters */}
          {isExpanded && (
            <div className="space-y-4 pt-4 border-t">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Employment Type */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Employment Type
                  </Label>
                  <Select
                    value={filters.employment_types || undefined}
                    onValueChange={(value) => updateFilter('employment_types', value || '')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Any type" />
                    </SelectTrigger>
                    <SelectContent>
                      {employmentTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Experience Level */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    Experience Level
                  </Label>
                  <Select
                    value={filters.job_requirements || undefined}
                    onValueChange={(value) => updateFilter('job_requirements', value || '')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Any level" />
                    </SelectTrigger>
                    <SelectContent>
                      {experienceLevels.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Company Type */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Company Type
                  </Label>
                  <Select
                    value={filters.company_types || undefined}
                    onValueChange={(value) => updateFilter('company_types', value || '')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Any size" />
                    </SelectTrigger>
                    <SelectContent>
                      {companyTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Search Radius */}
              <div className="space-y-3">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Search Radius: {filters.radius} km
                </Label>
                <Slider
                  value={[filters.radius]}
                  onValueChange={(value) => updateFilter('radius', value[0])}
                  max={100}
                  min={5}
                  step={5}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>5 km</span>
                  <span>100 km</span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              type="submit"
              size="lg"
              className="flex-1 bg-slate-800 hover:bg-slate-700 text-white shadow-sm hover:shadow-sm transition-all duration-200"
            >
              <Search className="mr-2 h-5 w-5" />
              Search Jobs
            </Button>
            {hasActiveFilters() && (
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={handleClear}
                className="sm:w-auto"
              >
                <X className="mr-2 h-4 w-4" />
                Clear All
              </Button>
            )}
          </div>
        </form>

        {/* Quick Suggestions */}
        {isExpanded && (
          <div className="space-y-4 pt-4 border-t">
            <div>
              <Label className="text-sm font-medium text-muted-foreground mb-3 block">
                Popular Job Searches
              </Label>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((search) => (
                  <Button
                    key={search}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      updateFilter('query', search);
                      onSearch({ ...filters, query: search });
                    }}
                    className="text-xs hover:bg-slate-50 hover:border-slate-300 dark:hover:bg-slate-900/20"
                  >
                    {search}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-muted-foreground mb-3 block">
                Popular Locations in India
              </Label>
              <div className="flex flex-wrap gap-2">
                {popularLocations.map((loc) => (
                  <Button
                    key={loc}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      updateFilter('location', loc);
                      onSearch({ ...filters, location: loc });
                    }}
                    className="text-xs hover:bg-slate-50 hover:border-slate-300 dark:hover:bg-slate-900/20"
                  >
                    {loc}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default JobFilters;
