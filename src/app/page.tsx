"use client";
import React from "react";
import { Spotlight } from "@/components/ui/spotlight-new";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { useAuth } from "@/context/AuthContext";

export default function HomePage() {
  const { user, loading , logout} = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <p>Loading...</p> 
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header Section */}
      <div className="h-[40rem] w-full flex items-center justify-center bg-black/[0.96] relative overflow-hidden">
        <Spotlight />
        <div className="p-6 max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
            {user ? `Welcome, ${user.displayName || "User"}!` : "Effortless Job Applications, Auto-Filled."}
          </h1>
          <p className="mt-4 text-lg text-neutral-300">
            {user ? "Manage and track your applications with ease." : "Manage, Track, and Apply with One Click."}
          </p>

          {user ? (
            <></>
          ) : (
            <a href="/auth/login">
              <button className="mt-6 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded">
                Get Started
              </button>
            </a>
          )}
        </div>
      </div>

      {/* Feature Section */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">Why Use Our Platform?</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="bg-gray-900 p-6">
            <CardHeader>
              <CardTitle>🔄 Auto-Fill Applications</CardTitle>
            </CardHeader>
            <CardContent>
              Save time by letting our platform auto-fill your job applications using stored profile data.
            </CardContent>
          </Card>
          <Card className="bg-gray-900 p-6">
            <CardHeader>
              <CardTitle>📑 Resume & Cover Letter</CardTitle>
            </CardHeader>
            <CardContent>
              AI-powered resume and cover letter generation to match job descriptions perfectly.
            </CardContent>
          </Card>
          <Card className="bg-gray-900 p-6">
            <CardHeader>
              <CardTitle>📊 Track Job Applications</CardTitle>
            </CardHeader>
            <CardContent>
              Keep track of applied jobs, deadlines, interview schedules, and more in one dashboard.
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-800 px-6">
        <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-6 text-center">
          <div>
            <h3 className="text-xl font-semibold">1️⃣ Create Your Profile</h3>
            <p className="text-neutral-300 mt-2">Fill in your details once, including resume, experience, and skills.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold">2️⃣ Apply for Jobs</h3>
            <p className="text-neutral-300 mt-2">Our platform auto-fills job applications for you instantly.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold">3️⃣ Track & Manage</h3>
            <p className="text-neutral-300 mt-2">Monitor your job application progress and interview status.</p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-6 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="space-y-4">
          <AccordionItem value="item-1">
            <AccordionTrigger>How does the auto-fill feature work?</AccordionTrigger>
            <AccordionContent>
              Our platform securely stores your details and automatically fills job application forms for you.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Is my data safe?</AccordionTrigger>
            <AccordionContent>
              Yes, we use encryption and secure authentication to keep your personal information safe.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Can I edit my auto-filled applications?</AccordionTrigger>
            <AccordionContent>
              Absolutely! You can review and edit any application before submitting it.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* Footer Section */}
      <footer className="bg-black py-10 text-center text-gray-400">
        <p>&copy; {new Date().getFullYear()} JobAutoFill. All rights reserved.</p>
        <div className="mt-4 space-x-6">
          <a href="#" className="hover:text-white">Privacy Policy</a>
          <a href="#" className="hover:text-white">Terms of Service</a>
          <a href="#" className="hover:text-white">Contact</a>
        </div>
      </footer>
    </div>
  );
}
