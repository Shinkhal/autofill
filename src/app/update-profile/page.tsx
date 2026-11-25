"use client";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {  toast } from "react-toastify";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Upload, Plus, Trash2, ChevronLeft, ChevronRight, Save, Loader2 } from "lucide-react";
import SkillInput from "@/components/SkillsInput";
import { useAuth } from "@/context/AuthContext";
import { fetchUserProfile, updateUserProfile } from "@/api";

type Education = {
  degree: string;
  fieldOfStudy: string;
  institution: string;
  startDate: string;
  endDate: string;
  gpa: string;
};

type Experience = {
  jobTitle: string;
  company: string;
  employmentType: string;
  startDate: string;
  endDate: string;
  jobDescription: string;
};

type Project = {
  name: string;
  description: string;
  technologies: string[];
  link: string;
};

type Certification = {
  name: string;
  issuingOrganization: string;
  issueDate: string;
  url: string;
};

export default function ProfilePage() {
  const { user } = useAuth();
  const [loadingSave, setLoadingSave] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const hasLoadedRef = useRef(false);

  // Personal Info (matching schema structure)
  const [personalInfo, setPersonalInfo] = useState({
    phone: "",
    dob: "",
    gender: "",
    nationality: "",
    portfolio: "",
    github: "",
    linkedin: "",
  });

  // Address (matching schema structure)
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: ""
  });

  // Skills (matching schema structure)
  const [skills, setSkills] = useState({
    technicalSkills: [] as string[],
    softSkills: [] as string[],
    languages: [] as string[],
    tools: [] as string[],
  });

  // Education (matching schema structure)
  const [education, setEducation] = useState<Education[]>([{
    degree: "",
    fieldOfStudy: "",
    institution: "",
    startDate: "",
    endDate: "",
    gpa: "",
  }]);

  // Experience (matching schema structure)
  const [experience, setExperience] = useState<Experience[]>([{
    jobTitle: "",
    company: "",
    employmentType: "",
    startDate: "",
    endDate: "",
    jobDescription: "",
  }]);

  // Projects (matching schema structure)
  const [projects, setProjects] = useState<Project[]>([]);

  // Certifications (matching schema structure)
  const [certifications, setCertifications] = useState<Certification[]>([]);

  // Achievements (matching schema structure)
  const [achievements, setAchievements] = useState<string[]>([]);

  // Job Preferences (matching schema structure)
  const [jobPreferences, setJobPreferences] = useState({
    desiredRoles: "",
    workLocation: "",
    jobType: "",
    expectedSalary: "",
    noticePeriod: "",
    relocate: "",
    visaSponsorship: "",
    preferredIndustries: [] as string[],
    travelWillingness: ""
  });

  // Fixed useEffect to prevent multiple API calls
  useEffect(() => {
    if (user && !hasLoadedRef.current && !isDataLoaded) {
      hasLoadedRef.current = true;
      fetchProfileData();
    }
  }, [user, isDataLoaded]);

  // Personal info handlers
  const handlePersonalInfoChange = (field: string, value: string) => {
    setPersonalInfo({ ...personalInfo, [field]: value });
  };

  // Address handlers
  const handleAddressChange = (field: string, value: string) => {
    setAddress({ ...address, [field]: value });
  };

  // Education handlers
  const handleEducationChange = (index: number, field: keyof Education, value: string) => {
    const updated = [...education];
    updated[index] = { ...updated[index], [field]: value };
    setEducation(updated);
  };

  const addEducation = () => {
    setEducation([...education, {
      degree: "",
      fieldOfStudy: "",
      institution: "",
      startDate: "",
      endDate: "",
      gpa: "",
    }]);
  };

  const removeEducation = (index: number) => {
    if (education.length > 1) {
      setEducation(education.filter((_, i) => i !== index));
    } else {
      toast.warn("You must have at least one education entry");
    }
  };

  // Experience handlers
  const handleExperienceChange = (index: number, field: keyof Experience, value: string) => {
    const updated = [...experience];
    updated[index] = { ...updated[index], [field]: value };
    setExperience(updated);
  };

  const addExperience = () => {
    setExperience([...experience, {
      jobTitle: "",
      company: "",
      employmentType: "",
      startDate: "",
      endDate: "",
      jobDescription: "",
    }]);
  };

  const removeExperience = (index: number) => {
    if (experience.length > 1) {
      setExperience(experience.filter((_, i) => i !== index));
    } else {
      toast.warn("You must have at least one experience entry");
    }
  };

  // Project handlers
  const handleProjectChange = (index: number, field: keyof Project, value: string | string[]) => {
    const updated = [...projects];
    updated[index] = { ...updated[index], [field]: value };
    setProjects(updated);
  };

  const addProject = () => {
    setProjects([...projects, { name: "", description: "", technologies: [], link: "" }]);
  };

  const removeProject = (index: number) => {
    setProjects(projects.filter((_, i) => i !== index));
  };

  // Certification handlers
  const handleCertificationChange = (index: number, field: keyof Certification, value: string) => {
    const updated = [...certifications];
    updated[index] = { ...updated[index], [field]: value };
    setCertifications(updated);
  };

  const addCertification = () => {
    setCertifications([...certifications, { name: "", issuingOrganization: "", issueDate: "" , url: "" }]);
  };

  const removeCertification = (index: number) => {
    setCertifications(certifications.filter((_, i) => i !== index));
  };

  // Achievement handlers
  const handleAchievementChange = (index: number, value: string) => {
    const updated = [...achievements];
    updated[index] = value;
    setAchievements(updated);
  };

  const addAchievement = () => {
    setAchievements([...achievements, ""]);
  };

  const removeAchievement = (index: number) => {
    setAchievements(achievements.filter((_, i) => i !== index));
  };

  // Job preferences handlers
  const handleJobPreferenceChange = (field: string, value: string | string[]) => {
    setJobPreferences({ ...jobPreferences, [field]: value });
  };

  // Image upload handler
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = await uploadToCloudinary(file);
      if (imageUrl) {
        setProfileImage(imageUrl);
        toast.success("Profile picture uploaded successfully!");
      }
    }
  };

  // Cloudinary upload function
  const uploadToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "");

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
        { method: "POST", body: formData }
      );
      
      if (!res.ok) throw new Error("Failed to upload file");
      
      const data = await res.json();
      return data.secure_url;
    } catch (error) {
      toast.error("File upload failed.");
      return "";
    }
  };

  // Save profile function (fixed to match your schema)
const handleSaveProfile = async () => {
  if (!user?.id) {
    toast.error("Please log in to save your profile.");
    return;
  }

  const profileData = {
    image: profileImage || "",
    profile: {
      ...personalInfo,
      address,
      skills,
      education,
      experience,
      projects,
      certifications,
      achievements,
    },
    jobPreferences,
  };

  setLoadingSave(true);
  try {
    await updateUserProfile(user.id, profileData); // cleaner call
    toast.success("Profile saved successfully!");
  } catch (error) {
    console.error("Save error:", error);
    toast.error("Failed to save profile.");
  } finally {
    setLoadingSave(false);
  }
};


  // Load profile data (fixed to match your schema and prevent multiple calls)


const fetchProfileData = async () => {
  if (!user?.id || isDataLoaded) return;

  setLoadingSave(true);
  try {
    const data = await fetchUserProfile(user.id); // cleaner call

    if (data.profile) {
      setPersonalInfo({
        phone: data.profile.phone || "",
        dob: data.profile.dob || "",
        gender: data.profile.gender || "",
        nationality: data.profile.nationality || "",
        portfolio: data.profile.portfolio || "",
        github: data.profile.github || "",
        linkedin: data.profile.linkedin || "",
      });

      setAddress(data.profile.address || {
        street: "", city: "", state: "", zipCode: "", country: ""
      });

      setSkills(data.profile.skills || {
        technicalSkills: [], softSkills: [], languages: [], tools: []
      });

      setEducation(data.profile.education?.length ? data.profile.education : [{
        degree: "", fieldOfStudy: "", institution: "", startDate: "", endDate: "", gpa: ""
      }]);

      setExperience(data.profile.experience?.length ? data.profile.experience : [{
        jobTitle: "", company: "", employmentType: "", startDate: "", endDate: "", jobDescription: ""
      }]);

      setProjects(data.profile.projects || []);
      setCertifications(data.profile.certifications || []);
      setAchievements(data.profile.achievements || []);
    }

    if (data.jobPreferences) {
      setJobPreferences(data.jobPreferences);
    }

    setProfileImage(data.image || null);
    setIsDataLoaded(true);
    toast.success("Profile data loaded successfully!");

  } catch (error) {
    console.error("Error fetching profile data:", error);
    toast.error("Failed to load profile data. Please try again.");
  } finally {
    setLoadingSave(false);
  }
};


  return (
  <ProtectedRoute>
    <div className=" min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-800 dark:to-gray-900">
      
      {/* Header */}
      <div className="sticky top-0 z-10 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                My Profile
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">Manage your professional information</p>
            </div>
            <Button 
              onClick={handleSaveProfile} 
              disabled={loadingSave}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {loadingSave ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save Changes
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Profile Overview */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Profile Card */}
            <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 border-0 shadow-xl">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="relative group">
                    <Avatar className="h-24 w-24 ring-4 ring-blue-100 dark:ring-blue-900 transition-all duration-200 group-hover:ring-blue-200 dark:group-hover:ring-blue-800">
                      <AvatarImage src={profileImage || "/avatar-placeholder.png"} alt="Profile" />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xl">
                        {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                      </AvatarFallback>
                    </Avatar>
                    <label htmlFor="profile-upload" className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-full">
                      <Upload className="h-6 w-6 text-white" />
                    </label>
                    <input
                      id="profile-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{user?.name || "Your Name"}</h3>
                    <p className="text-gray-600 dark:text-gray-400">{user?.email}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 border-0 shadow-xl">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Profile Completion</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Personal Info</span>
                    <span className="text-blue-600">85%</span>
                  </div>
                  <Progress value={85} className="h-2" />
                  <div className="grid grid-cols-2 gap-4 pt-4 text-center">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/50 dark:to-blue-800/50 rounded-lg p-3">
                      <div className="text-xl font-bold text-blue-600">{experience.length}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Experience</div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/50 dark:to-purple-800/50 rounded-lg p-3">
                      <div className="text-xl font-bold text-purple-600">{projects.length}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Projects</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Personal Information */}
            <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 border-0 shadow-xl">
              <CardHeader className="pb-4">
                <h2 className="text-xl font-semibold flex items-center">
                  <div className="h-2 w-2 bg-blue-500 rounded-full mr-3"></div>
                  Personal Information
                </h2>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Phone</Label>
                    <Input 
                      value={personalInfo.phone}
                      onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
                      className="mt-1 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Date of Birth</Label>
                    <Input 
                      type="date"
                      value={personalInfo.dob}
                      onChange={(e) => handlePersonalInfoChange('dob', e.target.value)}
                      className="mt-1 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Gender</Label>
                    <select
                      value={personalInfo.gender}
                      onChange={(e) => handlePersonalInfoChange('gender', e.target.value)}
                      className="mt-1 w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-100"
                    >
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Non-binary">Non-binary</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Nationality</Label>
                    <Input 
                      value={personalInfo.nationality}
                      onChange={(e) => handlePersonalInfoChange('nationality', e.target.value)}
                      className="mt-1 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Portfolio URL</Label>
                    <Input 
                      value={personalInfo.portfolio}
                      onChange={(e) => handlePersonalInfoChange('portfolio', e.target.value)}
                      className="mt-1 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://yourportfolio.com"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">LinkedIn</Label>
                      <Input 
                        value={personalInfo.linkedin}
                        onChange={(e) => handlePersonalInfoChange('linkedin', e.target.value)}
                        className="mt-1 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="linkedin.com/in/yourprofile"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">GitHub</Label>
                      <Input 
                        value={personalInfo.github}
                        onChange={(e) => handlePersonalInfoChange('github', e.target.value)}
                        className="mt-1 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="github.com/yourusername"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Address */}
            <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 border-0 shadow-xl">
              <CardHeader className="pb-4">
                <h2 className="text-xl font-semibold flex items-center">
                  <div className="h-2 w-2 bg-green-500 rounded-full mr-3"></div>
                  Address
                </h2>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Street Address</Label>
                    <Input 
                      value={address.street}
                      onChange={(e) => handleAddressChange('street', e.target.value)}
                      className="mt-1 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">City</Label>
                    <Input 
                      value={address.city}
                      onChange={(e) => handleAddressChange('city', e.target.value)}
                      className="mt-1 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">State</Label>
                    <Input 
                      value={address.state}
                      onChange={(e) => handleAddressChange('state', e.target.value)}
                      className="mt-1 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">ZIP Code</Label>
                    <Input 
                      value={address.zipCode}
                      onChange={(e) => handleAddressChange('zipCode', e.target.value)}
                      className="mt-1 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Country</Label>
                    <Input 
                      value={address.country}
                      onChange={(e) => handleAddressChange('country', e.target.value)}
                      className="mt-1 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Skills */}
            <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 border-0 shadow-xl">
              <CardHeader className="pb-4">
                <h2 className="text-xl font-semibold flex items-center">
                  <div className="h-2 w-2 bg-purple-500 rounded-full mr-3"></div>
                  Skills
                </h2>
              </CardHeader>
                        
              <CardContent className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                  {/* Programming Languages */}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-indigo-500">💻</span>
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Programming Languages
                      </Label>
                    </div>
                    <SkillInput
                      skills={skills.languages}
                      onChange={(newSkills) => setSkills({ ...skills, languages: newSkills })}
                      placeholder="JavaScript, Python, TypeScript..."
                    />
                  </div>
                        
                  {/* Tools */}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-emerald-500">🛠️</span>
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Tools
                      </Label>
                    </div>
                    <SkillInput
                      skills={skills.tools}
                      onChange={(newSkills) => setSkills({ ...skills, tools: newSkills })}
                      placeholder="Git, Docker, Figma..."
                    />
                  </div>
                        
                  {/* Technical Skills */}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-pink-500">🧠</span>
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Technical Skills
                      </Label>
                    </div>
                    <SkillInput
                      skills={skills.technicalSkills}
                      onChange={(newSkills) => setSkills({ ...skills, technicalSkills: newSkills })}
                      placeholder="REST APIs, Databases, Cloud..."
                    />
                  </div>
                        
                  {/* Soft Skills */}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-yellow-500">💬</span>
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Soft Skills
                      </Label>
                    </div>
                    <SkillInput
                      skills={skills.softSkills}
                      onChange={(newSkills) => setSkills({ ...skills, softSkills: newSkills })}
                      placeholder="Leadership, Time Management..."
                    />
                  </div>
                        
                </div>
              </CardContent>
            </Card>


            {/* Experience */}
            {/* Work Experience */}
<Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg">
  <CardHeader className="pb-4 flex flex-row items-center justify-between border-b border-gray-200 dark:border-gray-700">
    <h2 className="text-lg font-medium text-gray-900 dark:text-white">
      Work Experience
    </h2>
    <Button onClick={addExperience} variant="outline" size="sm">
      <Plus className="h-4 w-4 mr-2" /> Add
    </Button>
  </CardHeader>
  <CardContent className="space-y-4 pt-6">
    {experience.map((exp, index) => (
      <div key={index} className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm relative group">
        <div className="space-y-4 pr-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              placeholder="Job Title"
              value={exp.jobTitle}
              onChange={(e) => handleExperienceChange(index, 'jobTitle', e.target.value)}
            />
            <Input 
              placeholder="Company"
              value={exp.company}
              onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              value={exp.employmentType}
              onChange={(e) => handleExperienceChange(index, 'employmentType', e.target.value)}
              className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 focus:border-transparent text-gray-900 dark:text-gray-100"
            >
              <option value="">Employment Type</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Freelance">Freelance</option>
              <option value="Internship">Internship</option>
            </select>
            <Input 
              type="date"
              placeholder="Start Date"
              value={exp.startDate}
              onChange={(e) => handleExperienceChange(index, 'startDate', e.target.value)}
            />
            <Input 
              type="date"
              placeholder="End Date"
              value={exp.endDate}
              onChange={(e) => handleExperienceChange(index, 'endDate', e.target.value)}
            />
          </div>
          <Textarea 
            placeholder="Job Description"
            value={exp.jobDescription}
            onChange={(e) => handleExperienceChange(index, 'jobDescription', e.target.value)}
            className="min-h-[100px]"
          />
        </div>
        {experience.length > 1 && (
          <Button
            onClick={() => removeExperience(index)}
            variant="ghost"
            size="sm"
            className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 h-8 w-8 p-0"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    ))}
  </CardContent>
</Card>

{/* Education */}
<Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg">
  <CardHeader className="pb-4 flex flex-row items-center justify-between border-b border-gray-200 dark:border-gray-700">
    <h2 className="text-lg font-medium text-gray-900 dark:text-white">
      Education
    </h2>
    <Button onClick={addEducation} variant="outline" size="sm">
      <Plus className="h-4 w-4 mr-2" /> Add
    </Button>
  </CardHeader>
  <CardContent className="space-y-4 pt-6">
    {education.map((edu, index) => (
      <div key={index} className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm relative group">
        <div className="space-y-4 pr-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              placeholder="Degree"
              value={edu.degree}
              onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
            />
            <Input 
              placeholder="Field of Study"
              value={edu.fieldOfStudy}
              onChange={(e) => handleEducationChange(index, 'fieldOfStudy', e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              placeholder="Institution"
              value={edu.institution}
              onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
            />
            <Input 
              placeholder="GPA (Optional)"
              value={edu.gpa}
              onChange={(e) => handleEducationChange(index, 'gpa', e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              type="date"
              placeholder="Start Date"
              value={edu.startDate}
              onChange={(e) => handleEducationChange(index, 'startDate', e.target.value)}
            />
            <Input 
              type="date"
              placeholder="End Date"
              value={edu.endDate}
              onChange={(e) => handleEducationChange(index, 'endDate', e.target.value)}
            />
          </div>
        </div>
        {education.length > 1 && (
          <Button
            onClick={() => removeEducation(index)}
            variant="ghost"
            size="sm"
            className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 h-8 w-8 p-0"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    ))}
  </CardContent>
</Card>

{/* Projects */}
<Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg">
  <CardHeader className="pb-4 flex flex-row items-center justify-between border-b border-gray-200 dark:border-gray-700">
    <h2 className="text-lg font-medium text-gray-900 dark:text-white">
      Projects
    </h2>
    <Button onClick={addProject} variant="outline" size="sm">
      <Plus className="h-4 w-4 mr-2" /> Add
    </Button>
  </CardHeader>
  <CardContent className="space-y-4 pt-6">
    {projects.length === 0 ? (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <p>No projects added yet. Click "Add" to get started.</p>
      </div>
    ) : (
      projects.map((project, index) => (
        <div key={index} className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm relative group">
          <div className="space-y-4 pr-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input 
                placeholder="Project Name"
                value={project.name}
                onChange={(e) => handleProjectChange(index, 'name', e.target.value)}
              />
              <Input 
                placeholder="Project Link (Optional)"
                value={project.link}
                onChange={(e) => handleProjectChange(index, 'link', e.target.value)}
              />
            </div>
            <Textarea 
              placeholder="Project Description"
              value={project.description}
              onChange={(e) => handleProjectChange(index, 'description', e.target.value)}
              className="min-h-[80px]"
            />
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Technologies Used</Label>
              <SkillInput
                skills={project.technologies}
                onChange={(newTech) => handleProjectChange(index, 'technologies', newTech)}
                placeholder="React, Node.js, MongoDB..."
              />
            </div>
          </div>
          <Button
            onClick={() => removeProject(index)}
            variant="ghost"
            size="sm"
            className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 h-8 w-8 p-0"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))
    )}
  </CardContent>
</Card>

{/* Certifications */}
<Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg">
  <CardHeader className="pb-4 flex flex-row items-center justify-between border-b border-gray-200 dark:border-gray-700">
    <h2 className="text-lg font-medium text-gray-900 dark:text-white">
      Certifications
    </h2>
    <Button onClick={addCertification} variant="outline" size="sm">
      <Plus className="h-4 w-4 mr-2" /> Add
    </Button>
  </CardHeader>
  <CardContent className="space-y-4 pt-6">
    {certifications.length === 0 ? (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <p>No certifications added yet. Click "Add" to get started.</p>
      </div>
    ) : (
      certifications.map((cert, index) => (
        <div key={index} className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm relative group">
          <div className="space-y-4 pr-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input 
                placeholder="Certification Name"
                value={cert.name}
                onChange={(e) => handleCertificationChange(index, 'name', e.target.value)}
              />
              <Input 
                placeholder="Issuing Organization"
                value={cert.issuingOrganization}
                onChange={(e) => handleCertificationChange(index, 'issuingOrganization', e.target.value)}
              />
            </div>
            <Input
              type="text"
              placeholder="Certification URL"
              value={cert.url}
              onChange={(e) => handleCertificationChange(index, 'url', e.target.value)}
            />
            <Input 
              type="date"
              placeholder="Issue Date"
              value={cert.issueDate}
              onChange={(e) => handleCertificationChange(index, 'issueDate', e.target.value)}
            />
          </div>
          <Button
            onClick={() => removeCertification(index)}
            variant="ghost"
            size="sm"
            className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 h-8 w-8 p-0"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))
    )}
  </CardContent>
</Card>

            {/* Achievements */}
            <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700 shadow-md">
  <CardHeader className="pb-4 flex flex-row items-center justify-between">
    <h2 className="text-xl font-semibold flex items-center">
      <div className="h-2 w-2 bg-gray-400 dark:bg-gray-500 rounded-full mr-3"></div>
      Achievements
    </h2>
    <Button onClick={addAchievement} variant="outline" size="sm">
      <Plus className="h-4 w-4 mr-2" /> Add
    </Button>
  </CardHeader>
  <CardContent className="space-y-4">
    {achievements.length === 0 ? (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <p>No achievements added yet. Click "Add" to get started.</p>
      </div>
    ) : (
      achievements.map((achievement, index) => (
        <div
          key={index}
          className="p-3 rounded-md bg-gray-50 dark:bg-gray-700/40 border border-gray-200 dark:border-gray-600"
        >
          <div className="flex gap-3">
            <Textarea
              placeholder="Describe your achievement..."
              value={achievement}
              onChange={(e) => handleAchievementChange(index, e.target.value)}
              className="flex-1 min-h-[60px] resize-none"
            />
            <Button
              onClick={() => removeAchievement(index)}
              variant="ghost"
              size="sm"
              className="self-start text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/20"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))
    )}
  </CardContent>
</Card>

            {/* Job Preferences */}
            <Card className="bg-white/90 dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700 shadow-sm">
  <CardHeader className="pb-4">
    <h2 className="text-xl font-semibold flex items-center">
      <div className="h-2 w-2 bg-red-500 rounded-full mr-3"></div>
      Job Preferences
    </h2>
  </CardHeader>

  <CardContent className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Desired Roles</Label>
        <Input
          value={jobPreferences.desiredRoles}
          onChange={(e) => handleJobPreferenceChange('desiredRoles', e.target.value)}
          className="mt-1"
          placeholder="Software Engineer, Product Manager..."
        />
      </div>

      <div>
        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Work Location</Label>
        <select
          value={jobPreferences.workLocation}
          onChange={(e) => handleJobPreferenceChange('workLocation', e.target.value)}
          className="mt-1 w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900 dark:text-gray-100"
        >
          <option value="">Select preference</option>
          <option value="Remote">Remote</option>
          <option value="On-site">On-site</option>
          <option value="Hybrid">Hybrid</option>
        </select>
      </div>

      <div>
        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Job Type</Label>
        <select
          value={jobPreferences.jobType}
          onChange={(e) => handleJobPreferenceChange('jobType', e.target.value)}
          className="mt-1 w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900 dark:text-gray-100"
        >
          <option value="">Select job type</option>
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Contract">Contract</option>
          <option value="Freelance">Freelance</option>
        </select>
      </div>

      <div>
        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Expected Salary</Label>
        <Input
          value={jobPreferences.expectedSalary}
          onChange={(e) => handleJobPreferenceChange('expectedSalary', e.target.value)}
          className="mt-1"
          placeholder="$80,000 - $120,000"
        />
      </div>

      <div>
        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Notice Period</Label>
        <Input
          value={jobPreferences.noticePeriod}
          onChange={(e) => handleJobPreferenceChange('noticePeriod', e.target.value)}
          className="mt-1"
          placeholder="2 weeks, 1 month..."
        />
      </div>

      <div>
        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Travel Willingness</Label>
        <select
          value={jobPreferences.travelWillingness}
          onChange={(e) => handleJobPreferenceChange('travelWillingness', e.target.value)}
          className="mt-1 w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900 dark:text-gray-100"
        >
          <option value="">Select willingness</option>
          <option value="No travel">No travel</option>
          <option value="Occasional travel">Occasional travel</option>
          <option value="Frequent travel">Frequent travel</option>
        </select>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Willing to Relocate?</Label>
        <ToggleGroup
          type="single"
          value={jobPreferences.relocate}
          onValueChange={(value) => handleJobPreferenceChange('relocate', value)}
          className="gap-2"
        >
          <ToggleGroupItem value="Yes" className="px-4 py-2 text-sm">Yes</ToggleGroupItem>
          <ToggleGroupItem value="No" className="px-4 py-2 text-sm">No</ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div>
        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Need Visa Sponsorship?</Label>
        <ToggleGroup
          type="single"
          value={jobPreferences.visaSponsorship}
          onValueChange={(value) => handleJobPreferenceChange('visaSponsorship', value)}
          className="gap-2"
        >
          <ToggleGroupItem value="Yes" className="px-4 py-2 text-sm">Yes</ToggleGroupItem>
          <ToggleGroupItem value="No" className="px-4 py-2 text-sm">No</ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>

    <div>
      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Preferred Industries</Label>
      <SkillInput
        skills={jobPreferences.preferredIndustries}
        onChange={(newIndustries) => handleJobPreferenceChange('preferredIndustries', newIndustries)}
        placeholder="Technology, Healthcare, Finance..."
      />
    </div>
  </CardContent>
</Card>

          </div>
        </div>
      </div>
    </div>
  </ProtectedRoute>
  );
}