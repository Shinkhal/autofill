'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AuthSuccessPage() {
  const router = useRouter();
  const [status, setStatus] = useState<'checking' | 'success' | 'error'>('checking');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (token) {
      localStorage.setItem('token', token);
      setStatus('success');
      setTimeout(() => {
        router.replace('/home');
      }, 1500);
    } else {
      setStatus('error');
      setTimeout(() => {
        router.replace('/welcome');
      }, 1500);
    }
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-all duration-300">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="text-center"
      >
        <Loader2 className="animate-spin h-10 w-10 text-blue-600 mx-auto mb-4" />

        {status === 'checking' && <p className="text-lg font-medium">Authenticating...</p>}
        {status === 'success' && (
          <p className="text-lg font-medium text-green-600">Authentication successful! Redirecting to your dashboard...</p>
        )}
        {status === 'error' && (
          <p className="text-lg font-medium text-red-600">Authentication failed. Redirecting to welcome page...</p>
        )}
      </motion.div>
    </div>
  );
}
