"use client";

import { useState } from "react";
import { auth, db, storage } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ProfilePage() {
  const user = auth.currentUser;

  const [profile, setProfile] = useState({
    fullName: "",
    phone: "",
    address: "",
    linkedin: "",
    github: "",
    degree: "",
    institution: "",
    fieldOfStudy: "",
    skills: "",
    jobPreferences: "",
    resumeUrl: "",
  });

  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) {
      toast.error("You need to log in to save your profile!");
      return;
    }

    setLoading(true);

    try {
      let resumeUrl = profile.resumeUrl;

      if (resumeFile) {
        const resumeRef = ref(storage, `resumes/${user.uid}`);
        await uploadBytes(resumeRef, resumeFile);
        resumeUrl = await getDownloadURL(resumeRef);
      }

      const userDoc = doc(db, "users", user.uid);
      await setDoc(userDoc, { ...profile, resumeUrl }, { merge: true });

      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to save profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}>Complete Your Profile</h1>

      <form>
        <label>Full Name</label>
        <input type="text" name="fullName" value={profile.fullName} onChange={handleChange} placeholder="Your Name" />

        <label>Email (read-only)</label>
        <input type="email" value={user?.email || ""} disabled />

        <label>Phone Number</label>
        <input type="text" name="phone" value={profile.phone} onChange={handleChange} placeholder="+1234567890" />

        <label>Address</label>
        <textarea name="address" value={profile.address} onChange={handleChange} placeholder="Your address"></textarea>

        <label>LinkedIn URL</label>
        <input type="text" name="linkedin" value={profile.linkedin} onChange={handleChange} placeholder="LinkedIn profile link" />

        <label>GitHub/Portfolio URL</label>
        <input type="text" name="github" value={profile.github} onChange={handleChange} placeholder="GitHub/Portfolio link" />

        <label>Degree/Qualification</label>
        <input type="text" name="degree" value={profile.degree} onChange={handleChange} placeholder="Your degree" />

        <label>Institution Name</label>
        <input type="text" name="institution" value={profile.institution} onChange={handleChange} placeholder="Your college/university" />

        <label>Field of Study</label>
        <input type="text" name="fieldOfStudy" value={profile.fieldOfStudy} onChange={handleChange} placeholder="E.g. Computer Science" />

        <label>Skills</label>
        <textarea name="skills" value={profile.skills} onChange={handleChange} placeholder="E.g. React, Node.js, Tailwind CSS"></textarea>

        <label>Job Preferences</label>
        <textarea name="jobPreferences" value={profile.jobPreferences} onChange={handleChange} placeholder="Preferred job titles, locations, etc."></textarea>

        <label>Upload Resume (PDF)</label>
        <input type="file" accept=".pdf" onChange={handleFileChange} />

        <button type="button" onClick={handleSaveProfile} disabled={loading}>
          {loading ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </div>
  );
}
