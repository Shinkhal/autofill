"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const [recentJobs, setRecentJobs] = useState([
    { id: 1, title: "Software Engineer", company: "Google", status: "Applied" },
    { id: 2, title: "Frontend Developer", company: "Meta", status: "Interview Scheduled" },
    { id: 3, title: "Product Manager", company: "Amazon", status: "Pending Review" },
  ]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
        <Skeleton className="h-8 w-48 mb-4" />
        <Skeleton className="h-4 w-64 mb-2" />
        <Skeleton className="h-4 w-56" />
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 text-slate-900 dark:text-slate-100">
        
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          {/* Gradient Orbs */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-indigo-400 to-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
          </div>
          
          <div className="relative py-24 px-6 max-w-5xl mx-auto text-center">
            <motion.div initial="hidden" animate="visible" variants={containerVariants}>
              <motion.h1
                className="text-5xl md:text-6xl font-bold leading-tight mb-6 bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 dark:from-slate-100 dark:via-indigo-200 dark:to-slate-100 bg-clip-text text-transparent"
                variants={itemVariants}
              >
                Streamline Your Job Search
              </motion.h1>
              <motion.p
                className="text-lg text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto"
                variants={itemVariants}
              >
                Auto-fill applications, generate tailored resumes, and track your progress — all in one place.
              </motion.p>
              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center"
                variants={itemVariants}
              >
                <Button
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  onClick={() => router.push("/job-listing")}
                >
                  Start Applying
                </Button>
                <Button
                  variant="outline"
                  className="border-2 border-slate-300 dark:border-slate-600 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 px-8 py-3 rounded-lg transition-all duration-300 backdrop-blur-sm bg-white/50 dark:bg-slate-800/50"
                  onClick={() => router.push("/tracker")}
                >
                  View Dashboard
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20 px-6 max-w-6xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={containerVariants}>
            <motion.h2 className="text-3xl font-bold text-center mb-4 bg-gradient-to-r from-slate-800 to-indigo-800 dark:from-slate-200 dark:to-indigo-300 bg-clip-text text-transparent" variants={itemVariants}>
              Everything You Need
            </motion.h2>
            <motion.p
              className="text-slate-600 dark:text-slate-400 text-center mb-16 max-w-2xl mx-auto"
              variants={itemVariants}
            >
              Tools designed to accelerate your job search and maximize your success
            </motion.p>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { title: "Smart Auto-Fill", desc: "Instantly populate job applications with your saved profile.", link: "/apply", icon: "⚡", gradient: "from-amber-400 to-orange-500" },
                { title: "AI Resume Builder", desc: "Generate tailored resumes and cover letters optimized for specific roles.", link: "/resume", icon: "🎯", gradient: "from-emerald-400 to-teal-500" },
                { title: "Application Tracking", desc: "Monitor your applications, interviews, and follow-ups in one dashboard.", link: "/dashboard", icon: "📈", gradient: "from-blue-400 to-indigo-500" },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ y: -8, transition: { duration: 0.2 } }}
                  className="cursor-pointer group"
                  onClick={() => router.push(feature.link)}
                >
                  <Card className="h-full border border-slate-200/50 dark:border-slate-700/50 shadow-lg hover:shadow-2xl transition-all duration-300 backdrop-blur-sm bg-white/70 dark:bg-slate-800/70 group-hover:bg-white/90 dark:group-hover:bg-slate-800/90">
                    <CardContent className="p-8 text-center relative">
                      <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 rounded-lg transition-opacity duration-300`}></div>
                      <div className="text-4xl mb-4 relative z-10">{feature.icon}</div>
                      <h3 className="text-xl font-semibold mb-2 relative z-10">{feature.title}</h3>
                      <p className="text-slate-600 dark:text-slate-400 mb-4 relative z-10">{feature.desc}</p>
                      <Button variant="ghost" className="text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 relative z-10">
                        Learn More →
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Recent Applications */}
        <section className="py-20 px-6 max-w-6xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={containerVariants}>
            <motion.h2 className="text-3xl font-bold mb-4 text-center bg-gradient-to-r from-slate-800 to-indigo-800 dark:from-slate-200 dark:to-indigo-300 bg-clip-text text-transparent" variants={itemVariants}>
              Recent Applications
            </motion.h2>
            <motion.p className="text-slate-600 dark:text-slate-400 text-center mb-12" variants={itemVariants}>
              Track your latest job applications and their status
            </motion.p>

            <motion.div variants={itemVariants}>
              <Card className="border border-slate-200/50 dark:border-slate-700/50 shadow-lg backdrop-blur-sm bg-white/70 dark:bg-slate-800/70">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gradient-to-r from-slate-100/50 to-indigo-100/50 dark:from-slate-800/50 dark:to-indigo-900/50">
                        <tr>
                          <th className="px-6 py-3 text-left font-semibold">Position</th>
                          <th className="px-6 py-3 text-left font-semibold">Company</th>
                          <th className="px-6 py-3 text-left font-semibold">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentJobs.map((job, index) => (
                          <tr
                            key={job.id}
                            className={`border-t border-slate-200/30 dark:border-slate-700/30 hover:bg-gradient-to-r hover:from-indigo-50/50 hover:to-purple-50/50 dark:hover:from-indigo-900/20 dark:hover:to-purple-900/20 transition-all duration-200 ${
                              index % 2 === 0 ? "bg-white/40 dark:bg-slate-900/40" : "bg-slate-50/40 dark:bg-slate-800/40"
                            }`}
                          >
                            <td className="px-6 py-4 font-medium">{job.title}</td>
                            <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{job.company}</td>
                            <td className="px-6 py-4">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  job.status === "Applied"
                                    ? "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 dark:from-blue-900/50 dark:to-indigo-900/50 dark:text-blue-300"
                                    : job.status === "Interview Scheduled"
                                    ? "bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 dark:from-emerald-900/50 dark:to-teal-900/50 dark:text-emerald-300"
                                    : "bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700 dark:from-amber-900/50 dark:to-yellow-900/50 dark:text-amber-300"
                                }`}
                              >
                                {job.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div className="text-center mt-8" variants={itemVariants}>
              <Button
                variant="outline"
                className="border border-slate-300 dark:border-slate-600 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 px-6 py-3 rounded-lg backdrop-blur-sm bg-white/50 dark:bg-slate-800/50 hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all duration-300"
                onClick={() => router.push("/dashboard")}
              >
                View All Applications
              </Button>
            </motion.div>
          </motion.div>
        </section>

                {/* CTA */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
              className="bg-blue-600 rounded-2xl p-12 shadow-lg"
            >
              <motion.h2 className="text-3xl md:text-4xl font-bold text-white mb-6" variants={itemVariants}>
                Ready to Transform Your Job Search?
              </motion.h2>
              <motion.p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto" variants={itemVariants}>
                Join thousands of job seekers who streamlined their applications
              </motion.p>
              <motion.div variants={itemVariants}>
                <Button
                  className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg shadow"
                  onClick={() => router.push("/apply")}
                >
                  Get Started Today
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-slate-400 py-12 text-center border-t border-slate-700/50">
          <div className="max-w-6xl mx-auto px-6">
            <p className="mb-6">&copy; {new Date().getFullYear()} JobAutoFill. Empowering your career journey.</p>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              {["Privacy Policy", "Terms of Service", "Contact Support", "Help Center"].map((link, i) => (
                <a key={i} href="#" className="hover:text-indigo-400 transition-colors duration-200">
                  {link}
                </a>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </ProtectedRoute>
  );
}