import mongoose, { Schema, Document } from "mongoose";

interface Education {
  degree: string;
  fieldOfStudy: string;
  institution: string;
  graduationYear: string;
  gpa: string;
  courses: string;
  certifications: string;
}

interface WorkExperience {
  jobTitle: string;
  company: string;
  employmentType: string;
  startDate: string;
  endDate: string;
  isCurrentJob: boolean;
  jobDescription: string;
  achievements: string;
}

interface Project {
  name: string;
  description: string;
  link: string;
}

interface User extends Document {
  email: string;
  password: string;
  profileImage?: string;
  resumeUrl?: string;
  coverLetterUrl?: string;
  personalInfo: {
    fullName: string;
    phone: string;
    dob: string;
    gender: string;
    portfolio: string;
    location: string;
    nationality: string;
    alternatePhone: string;
    alternateEmail: string;
  };
  education: Education[];
  workExperience: WorkExperience[];
  skills: {
    technicalSkills: string[];
    softSkills: string[];
    languages: string[];
    tools: string[];
  };
  jobPreferences: {
    desiredRoles: string;
    workLocation: string;
    jobType: string;
    expectedSalary: string;
    noticePeriod: string;
    relocate: string;
  };
  additionalInfo: {
    linkedin: string;
    github: string;
    projects: Project[];
    volunteerWork: string;
    awards: string;
    publications: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<User>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profileImage: { type: String },
    resumeUrl: { type: String },
    coverLetterUrl: { type: String },
    personalInfo: {
      fullName: { type: String, default: "" },
      phone: { type: String, default: "" },
      dob: { type: String, default: "" },
      gender: { type: String, default: "" },
      portfolio: { type: String, default: "" },
      location: { type: String, default: "" },
      nationality: { type: String, default: "" },
      alternatePhone: { type: String, default: "" },
      alternateEmail: { type: String, default: "" },
    },
    education: [
      {
        degree: { type: String, default: "" },
        fieldOfStudy: { type: String, default: "" },
        institution: { type: String, default: "" },
        graduationYear: { type: String, default: "" },
        gpa: { type: String, default: "" },
        courses: { type: String, default: "" },
        certifications: { type: String, default: "" },
      },
    ],
    workExperience: [
      {
        jobTitle: { type: String, default: "" },
        company: { type: String, default: "" },
        employmentType: { type: String, default: "" },
        startDate: { type: String, default: "" },
        endDate: { type: String, default: "" },
        isCurrentJob: { type: Boolean, default: false },
        jobDescription: { type: String, default: "" },
        achievements: { type: String, default: "" },
      },
    ],
    skills: {
      technicalSkills: [{ type: String }],
      softSkills: [{ type: String }],
      languages: [{ type: String }],
      tools: [{ type: String }],
    },
    jobPreferences: {
      desiredRoles: { type: String, default: "" },
      workLocation: { type: String, default: "" },
      jobType: { type: String, default: "" },
      expectedSalary: { type: String, default: "" },
      noticePeriod: { type: String, default: "" },
      relocate: { type: String, default: "" },
    },
    additionalInfo: {
      linkedin: { type: String, default: "" },
      github: { type: String, default: "" },
      projects: [
        {
          name: { type: String, default: "" },
          description: { type: String, default: "" },
          link: { type: String, default: "" },
        },
      ],
      volunteerWork: { type: String, default: "" },
      awards: { type: String, default: "" },
      publications: { type: String, default: "" },
    },
  },
  { timestamps: true } // This automatically adds createdAt & updatedAt fields
);

export default mongoose.model<User>("User", UserSchema);
