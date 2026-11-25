'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Spotlight } from '@/components/ui/spotlight-new';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { motion } from 'framer-motion';
import { redirectToGoogleLogin } from '@/api';

export default function HomePage() {
  const { theme } = useTheme();
  const router = useRouter();
  const [year, setYear] = useState(new Date().getFullYear());
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser(payload);
      } catch (e) {
        console.error('Invalid token');
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#f5f7fa] dark:bg-[#0d1117] text-gray-900 dark:text-white">
      {/* Hero Section */}
      <div className="relative h-[38rem] w-full flex items-center justify-center overflow-hidden">
        <Spotlight />
        <div className="p-6 max-w-4xl mx-auto text-center relative z-10">
          <motion.h1
            className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-gray-800 dark:from-white to-gray-500 dark:to-gray-400"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {user ? `Welcome ${user.name}!` : 'Effortless Job Applications, Auto-Filled.'}
          </motion.h1>
          <motion.p
            className="mt-4 text-lg text-gray-600 dark:text-gray-300"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            {user
              ? 'Track and manage your job applications effortlessly.'
              : 'Apply faster, track applications, and land your dream job.'}
          </motion.p>

          {!user && (
            <motion.a
              onClick={() => redirectToGoogleLogin()}
              className="inline-block mt-6 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
            >
              Sign up with Google
            </motion.a>
          )}
        </div>
      </div>

      {/* Features Section */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-10">Why Choose JobAutoFill?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: '🔄', title: 'Auto-Fill Applications', desc: 'Save time with AI-powered form filling.' },
            { icon: '📑', title: 'AI Resume & Cover Letter', desc: 'Generate professional resumes instantly.' },
            { icon: '📊', title: 'Job Tracking Dashboard', desc: 'Monitor applications & interview progress.' },
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white dark:bg-gray-900 shadow-lg rounded-lg p-6 text-center hover:scale-105 transition-transform"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <h3 className="text-5xl">{feature.icon}</h3>
              <h4 className="text-xl font-semibold mt-4">{feature.title}</h4>
              <p className="text-gray-600 dark:text-gray-300 mt-2">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-200 dark:bg-gray-800 px-6">
        <h2 className="text-4xl font-bold text-center mb-10">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-6 text-center">
          {[
            { step: '1️⃣', title: 'Create Your Profile', desc: 'Fill in your resume and details once.' },
            { step: '2️⃣', title: 'Auto-Apply', desc: 'Our AI auto-fills job applications for you.' },
            { step: '3️⃣', title: 'Track & Manage', desc: 'Monitor your applications in one place.' },
          ].map((process, index) => (
            <motion.div
              key={index}
              className="p-6 rounded-lg shadow-lg bg-white dark:bg-gray-900 hover:scale-105 transition-transform"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <h3 className="text-4xl">{process.step}</h3>
              <h4 className="text-xl font-semibold mt-4">{process.title}</h4>
              <p className="text-gray-600 dark:text-gray-300 mt-2">{process.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-6 max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-10">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="space-y-4">
          {[
            { q: 'How does auto-fill work?', a: 'We securely store your details and auto-fill job forms.' },
            { q: 'Is my data secure?', a: 'Yes, we use encryption and secure authentication.' },
            { q: 'Can I edit auto-filled applications?', a: 'Absolutely! You can review and edit before submitting.' },
          ].map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger>{faq.q}</AccordionTrigger>
              <AccordionContent>{faq.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* Footer Section */}
      <footer className="bg-white dark:bg-black py-10 text-center text-gray-600 dark:text-gray-400">
        <p>&copy; {year} JobAutoFill. All rights reserved.</p>
        <div className="mt-4 space-x-6">
          <a href="#" className="hover:text-black dark:hover:text-white">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-black dark:hover:text-white">
            Terms of Service
          </a>
          <a href="#" className="hover:text-black dark:hover:text-white">
            Contact
          </a>
        </div>
      </footer>
    </div>
  );
}
