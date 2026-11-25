"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Edit, ExternalLink, Phone, Mail, MapPin, Calendar, Building, FilePlus } from "lucide-react";
import { fetchUserProfile } from "@/api";

interface UserProfile {
  _id: string;
  googleId: string;
  name: string;
  email: string;
  image: string;
  profile: {
    phone?: string;
    dob?: string;
    gender?: string;
    nationality?: string;
    portfolio?: string;
    github?: string;
    linkedin?: string;
    address?: {
      street?: string;
      city?: string;
      state?: string;
      zipCode?: string;
      country?: string;
    };
    skills?: {
      technicalSkills?: string[];
      softSkills?: string[];
      languages?: string[];
      tools?: string[];
    };
    education?: Array<{
      _id?: string;
      degree?: string;
      fieldOfStudy?: string;
      institution?: string;
      startDate?: string;
      endDate?: string;
      gpa?: string;
    }>;
    experience?: Array<{
      _id?: string;
      jobTitle?: string;
      company?: string;
      employmentType?: string;
      startDate?: string;
      endDate?: string;
      jobDescription?: string;
    }>;
    projects?: Array<{
      _id?: string;
      name?: string;
      description?: string;
      technologies?: string[];
      link?: string;
    }>;
    certifications?: Array<{
      _id?: string;
      name?: string;
      issuingOrganization?: string;
      issueDate?: string;
      url?: string;
    }>;
    achievements?: string[];
  };
  jobPreferences?: {
    desiredRoles?: string;
    workLocation?: string;
    jobType?: string;
    expectedSalary?: string;
    noticePeriod?: string;
    relocate?: string;
    visaSponsorship?: string;
    preferredIndustries?: string[];
    travelWillingness?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const userId = user?.id 
        if (!userId) {
          setLoading(false);
          return;
        }
        const data = await fetchUserProfile(userId);
        setProfile(data);
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProfileData();
    }
  }, [user, router]);

  const handleUpdateProfile = () => {
    router.push("/update-profile");
  };

  const handleautofill =() =>{
    router.push("/resume");
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Present";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  };

  const getFullAddress = () => {
    const addr = profile?.profile?.address;
    if (!addr) return "Not filled yet";
    
    const parts = [addr.street, addr.city, addr.state, addr.zipCode, addr.country].filter(Boolean);
    return parts.length > 0 ? parts.join(', ') : "Not filled yet";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="space-y-6">
            <Skeleton className="h-12 w-1/3" />
            <Skeleton className="h-64 w-full rounded-lg" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Skeleton className="h-48 w-full rounded-lg" />
              <Skeleton className="h-48 w-full rounded-lg" />
            </div>
            <Skeleton className="h-96 w-full rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600 mb-4">No profile data available.</p>
          <Button onClick={() => router.push("/complete-profile")}>
            Create Profile
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header with Update Profile Button */}
<div className="flex justify-between items-center mb-8 flex-wrap gap-4">
  <h1 className="text-3xl font-bold text-gray-900 dark:text-neutral-50">
    My Profile
  </h1>
  <div className="flex gap-3">
    <Button onClick={handleUpdateProfile} className="flex items-center gap-2">
      <Edit className="w-4 h-4" />
      Update Profile
    </Button>
    <Button onClick={handleautofill} className="flex items-center gap-2">
      <FilePlus className="w-4 h-4" />
      Auto Fill with Resume
    </Button>
  </div>
</div>


        {/* Profile Header Card */}
        <Card className="mb-8 shadow-sm border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
  <CardContent className="p-6 sm:p-8">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* LEFT COLUMN */}
      <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
        <div className="relative w-[140px] h-[140px] mb-4">
          <Image
            src={profile.image || "/default-avatar.png"}
            alt="Profile Image"
            width={140}
            height={140}
            className="rounded-full border-4 border-white dark:border-neutral-800 shadow-md object-cover"
          />
          <div className="absolute bottom-1 right-1">
            <span className="block w-5 h-5 rounded-full bg-green-500 border-2 border-white dark:border-neutral-900"></span>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {profile.name || "Not filled yet"}
        </h2>
        <p className="text-base text-gray-600 dark:text-gray-300 mt-1">
          {profile.jobPreferences?.desiredRoles || "Not filled yet"}
        </p>
      </div>

      {/* RIGHT COLUMNS */}
      <div className="lg:col-span-2 space-y-6">
        {/* Contact Info */}
        <div>
          <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3">Contact Info</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span>{profile.email || "Not filled yet"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span>{profile.profile?.phone || "Not filled yet"}</span>
            </div>
            <div className="flex items-center gap-2 col-span-full">
              <MapPin className="w-4 h-4" />
              <span className="truncate">{getFullAddress()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4" />
              <span>{profile.profile?.nationality || "Not filled yet"}</span>
            </div>
          </div>
        </div>

        {/* Preferred Industries */}
        <div>
          <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">Preferred Industries</h4>
          <div className="flex flex-wrap gap-2">
            {profile.jobPreferences?.preferredIndustries?.length ? (
              profile.jobPreferences.preferredIndustries.map((industry, index) => (
                <Badge
                  key={index}
                  className="bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-900 dark:text-blue-100 dark:border-blue-700"
                >
                  {industry}
                </Badge>
              ))
            ) : (
              <Badge className="bg-gray-100 text-gray-600 dark:bg-neutral-800 dark:text-gray-400 border border-gray-300 dark:border-neutral-700">
                Not filled yet
              </Badge>
            )}
          </div>
        </div>

        {/* Social Links */}
        <div>
          <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">Social Links</h4>
          <div className="flex flex-wrap gap-4 text-sm">
            {profile.profile?.github ? (
              <a
                href={profile.profile.github.startsWith("http") ? profile.profile.github : `https://${profile.profile.github}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                <ExternalLink className="w-4 h-4" />
                GitHub
              </a>
            ) : (
              <span className="text-gray-500 dark:text-gray-400">GitHub: Not filled yet</span>
            )}
            {profile.profile?.linkedin ? (
              <a
                href={profile.profile.linkedin.startsWith("http") ? profile.profile.linkedin : `https://${profile.profile.linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                <ExternalLink className="w-4 h-4" />
                LinkedIn
              </a>
            ) : (
              <span className="text-gray-500 dark:text-gray-400">LinkedIn: Not filled yet</span>
            )}
            {profile.profile?.portfolio ? (
              <a
                href={profile.profile.portfolio.startsWith("http") ? profile.profile.portfolio : `https://${profile.profile.portfolio}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                <ExternalLink className="w-4 h-4" />
                Portfolio
              </a>
            ) : (
              <span className="text-gray-500 dark:text-gray-400">Portfolio: Not filled yet</span>
            )}
          </div>
        </div>
      </div>
    </div>
  </CardContent>
</Card>


        {/* Skills Section */}
        <Card className="mb-8 shadow-sm border-0 bg-white dark:bg-neutral-900">
  <CardHeader className="pb-4">
    <CardTitle className="text-xl font-semibold text-gray-900 dark:text-neutral-100">
      Skills & Expertise
    </CardTitle>
  </CardHeader>
  <CardContent className="pt-0">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Technical Skills */}
      <div>
        <h4 className="font-medium text-gray-800 dark:text-neutral-200 mb-3">
          Technical Skills
        </h4>
        <div className="flex flex-wrap gap-2">
          {profile.profile?.skills?.technicalSkills?.length ? (
            profile.profile.skills.technicalSkills.map((skill, index) => (
              <Badge
                key={index}
                className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
              >
                {skill}
              </Badge>
            ))
          ) : (
            <Badge className="bg-gray-100 text-gray-600 dark:bg-neutral-800 dark:text-gray-400">
              Not filled yet
            </Badge>
          )}
        </div>
      </div>

      {/* Soft Skills */}
      <div>
        <h4 className="font-medium text-gray-800 dark:text-neutral-200 mb-3">
          Soft Skills
        </h4>
        <div className="flex flex-wrap gap-2">
          {profile.profile?.skills?.softSkills?.length ? (
            profile.profile.skills.softSkills.map((skill, index) => (
              <Badge
                key={index}
                variant="outline"
                className="bg-cyan-200 text-cyan-800 dark:bg-cyan-800 dark:text-cyan-100 border-none"
              >
                {skill}
              </Badge>
            ))
          ) : (
            <Badge
              variant="outline"
              className="border-gray-300 text-gray-600 dark:border-neutral-700 dark:text-gray-400"
            >
              Not filled yet
            </Badge>
          )}
        </div>
      </div>

      {/* Programming Languages */}
      <div>
        <h4 className="font-medium text-gray-800 dark:text-neutral-200 mb-3">
          Programming Languages
        </h4>
        <div className="flex flex-wrap gap-2">
          {profile.profile?.skills?.languages?.length ? (
            profile.profile.skills.languages.map((lang, index) => (
              <Badge
                key={index}
                className="bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100"
              >
                {lang}
              </Badge>
            ))
          ) : (
            <Badge className="bg-gray-100 text-gray-600 dark:bg-neutral-800 dark:text-gray-400">
              Not filled yet
            </Badge>
          )}
        </div>
      </div>

      {/* Tools & Technologies */}
      <div>
        <h4 className="font-medium text-gray-800 dark:text-neutral-200 mb-3">
          Tools & Technologies
        </h4>
        <div className="flex flex-wrap gap-2">
          {profile.profile?.skills?.tools?.length ? (
            profile.profile.skills.tools.map((tool, index) => (
              <Badge
                key={index}
                className="bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100 hover:bg-purple-200 transition-colors"
              >
                {tool}
              </Badge>
            ))
          ) : (
            <Badge className="bg-gray-100 text-gray-600 dark:bg-neutral-800 dark:text-gray-400">
              Not filled yet
            </Badge>
          )}
        </div>
      </div>
    </div>
  </CardContent>
</Card>


        {/* Experience and Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Work Experience */}
          <Card className="shadow-sm border-0 bg-white dark:bg-neutral-900">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold text-gray-900 dark:text-neutral-100 flex items-center gap-2">
                <Building className="w-5 h-5" />
                Work Experience
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {profile.profile?.experience?.length ? (
                <ScrollArea className="h-80">
                  <div className="space-y-8 pr-4">
                    {profile.profile.experience.map((exp, index) => (
                      <div key={exp._id || index} className="relative">
                        {/* Timeline line */}
                        {index !== profile.profile.experience.length - 1 && (
                          <div className="absolute left-2 top-8 w-0.5 h-full bg-blue-200 dark:bg-blue-500"></div>
                        )}
                        
                        {/* Timeline dot */}
                        <div className="absolute left-0 top-2 w-4 h-4 bg-blue-500 dark:bg-blue-800 rounded-full border-2 border-white shadow-sm"></div>
                        
                        {/* Content */}
                        <div className="ml-8 pb-6">
                          <h3 className="font-semibold text-gray-900 dark:text-neutral-100 text-lg mb-1">
                            {exp.jobTitle || "Not filled yet"}
                          </h3>
                          <p className="text-blue-600 font-medium mb-2">
                            {exp.company || "Not filled yet"}
                          </p>
                          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-300 mb-3">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(exp.startDate)} - {formatDate(exp.endDate)}</span>
                            {exp.employmentType && (
                              <>
                                <span>•</span>
                                <Badge variant="secondary" className="text-xs bg-amber-200 dark:bg-amber-600 text-amber-800 dark:text-amber-100">
                                  {exp.employmentType}
                                </Badge>
                              </>
                            )}
                          </div>
                          <p className="text-gray-700 dark:text-neutral-200 text-sm leading-relaxed whitespace-pre-line">
                            {exp.jobDescription || "Not filled yet"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="text-center py-8">
                  <Building className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Not filled yet</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Projects */}
          <Card className="shadow-sm border-0 bg-white dark:bg-neutral-900">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold text-gray-900 dark:text-neutral-100">Projects</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {profile.profile?.projects?.length ? (
                <ScrollArea className="h-80">
                  <div className="space-y-6 pr-4">
                    {profile.profile.projects.map((project, index) => (
                      <div key={project._id || index} className="border border-gray-100 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-semibold text-gray-900 dark:text-neutral-100 text-lg">
                            {project.name || "Not filled yet"}
                          </h3>
                          {project.link && (
                            <a 
                              href={project.link.startsWith('http') ? project.link : `https://${project.link}`}
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 dark:text-amber-600 dark:hover:text-amber-800 transition-colors"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                        <p className="text-gray-700 dark:text-neutral-200 text-sm mb-3 leading-relaxed">
                          {project.description || "Not filled yet"}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {project.technologies?.length ? (
                            project.technologies.map((tech, techIndex) => (
                              <Badge key={techIndex} variant="secondary" className="text-xs bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 p-1.5">
                                {tech}
                              </Badge>
                            ))
                          ) : (
                            <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                              Not filled yet
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <span className="text-gray-400 text-lg">📂</span>
                  </div>
                  <p className="text-gray-500">Not filled yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Education and Certifications Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Education */}
          <Card className="shadow-sm border-0 bg-white dark:bg-neutral-900">
    <CardHeader className="pb-4">
      <CardTitle className="text-xl font-semibold text-gray-900 dark:text-neutral-100">
        Education
      </CardTitle>
    </CardHeader>
    <CardContent className="pt-0">
      {profile.profile?.education?.length ? (
        <div className="space-y-6 relative">
          {profile.profile.education.map((edu, index) => (
            <div key={edu._id || index} className="relative pl-6">
              {/* Timeline vertical line */}
              {index !== profile.profile.education.length - 1 && (
                <div className="absolute left-2.5 top-6 w-0.5 h-full bg-green-200 dark:bg-green-600"></div>
              )}

              {/* Timeline dot */}
              <div className="absolute left-0 top-1.5 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-neutral-900 shadow-sm"></div>

              {/* Content */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-neutral-50 mb-1">
                  {edu.degree || "Not filled yet"}
                  {edu.fieldOfStudy && (
                    <span className="font-normal text-gray-600 dark:text-gray-400">
                      {" "}in {edu.fieldOfStudy}
                    </span>
                  )}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-2">
                  {edu.institution || "Not filled yet"}
                </p>
                <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                  </span>
                  {edu.gpa && (
                    <>
                      <span className="text-black dark:text-white">•</span>
                      <Badge
                        variant="secondary"
                        className="text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-600 dark:text-yellow-100 px-2 py-1"
                      >
                        GPA {edu.gpa}
                      </Badge>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-gray-100 dark:bg-neutral-800 rounded-lg flex items-center justify-center mx-auto mb-3">
            <span className="text-gray-400 text-lg">🎓</span>
          </div>
          <p className="text-gray-500 dark:text-gray-400">Not filled yet</p>
        </div>
      )}
    </CardContent>
  </Card>

          {/* Certifications */}
          <Card className="shadow-sm border-0 bg-white dark:bg-neutral-900">
  <CardHeader className="pb-4">
    <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
      Certifications
    </CardTitle>
  </CardHeader>
  <CardContent className="pt-0">
    {profile.profile?.certifications?.length ? (
      <div className="space-y-4">
        {profile.profile.certifications.map((cert, index) => (
          <div
            key={cert._id || index}
            className="rounded-lg border border-gray-100 dark:border-neutral-700 p-4 bg-gray-50 dark:bg-neutral-800"
          >
            <h3 className="font-semibold text-gray-900 dark:text-neutral-100 mb-1">
              {cert.name || "Not filled yet"}
            </h3>

            {cert.url ? (
              <a
                href={cert.url.startsWith("http") ? cert.url : `https://${cert.url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 dark:text-amber-500 dark:hover:text-amber-400 inline-flex items-center gap-1 mb-2"
              >
                View Certificate <ExternalLink className="w-4 h-4" />
              </a>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 mb-2">Certificate URL not provided</p>
            )}

            <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
              {cert.issuingOrganization || "Not filled yet"}
            </p>

            {cert.issueDate && (
              <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                <Calendar className="w-3 h-3" />
                <span>Issued {formatDate(cert.issueDate)}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    ) : (
      <div className="text-center py-8">
        <div className="w-12 h-12 bg-gray-100 dark:bg-neutral-800 rounded-lg flex items-center justify-center mx-auto mb-3">
          <span className="text-gray-400 text-lg">🏆</span>
        </div>
        <p className="text-gray-500 dark:text-gray-400">Not filled yet</p>
      </div>
    )}
  </CardContent>
</Card>

        </div>

        {/* Achievements */}
        <Card className="shadow-sm border-0 bg-white dark:bg-neutral-900 mb-8">
  <CardHeader className="pb-4">
    <CardTitle className="text-xl font-semibold text-gray-900 dark:text-neutral-100">
      Achievements
    </CardTitle>
  </CardHeader>
  <CardContent className="pt-0">
    {profile.profile?.achievements?.length ? (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {profile.profile.achievements.map((achievement, index) => (
          <div
            key={index}
            className="flex items-start gap-3 p-3 rounded-lg border border-amber-100 dark:border-amber-300 bg-amber-50 dark:bg-amber-100/10"
          >
            <span className="text-amber-600 text-xl">🌟</span>
            <p className="text-gray-800 dark:text-neutral-200 text-sm leading-relaxed">
              {achievement}
            </p>
          </div>
        ))}
      </div>
    ) : (
      <div className="text-center py-8">
        <div className="w-12 h-12 bg-gray-100 dark:bg-neutral-800 rounded-lg flex items-center justify-center mx-auto mb-3">
          <span className="text-gray-400 text-lg">🌟</span>
        </div>
        <p className="text-gray-500 dark:text-gray-400">Not filled yet</p>
      </div>
    )}
  </CardContent>
        </Card>

      </div>
    </div>
  );
}