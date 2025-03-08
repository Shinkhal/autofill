"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "@/lib/firebase"; // Your Firebase config file
import { onAuthStateChanged, User, signOut } from "firebase/auth";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    logout: () => Promise<void>; // Add logout type
  }
  

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: async () => {}

});

// Provider to wrap around your app
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

    // Logout function
    const logout = async () => {
        try {
          await signOut(auth);
          setUser(null);
        } catch (error) {
          console.error("Logout failed:");
        }
      };
    
      // Session timeout handler (optional)
      useEffect(() => {
        const sessionTimeout = setTimeout(() => {
          if (user) {
            logout();
            alert("Session expired! Please log in again.");
          }
        }, 2 * 60 * 60 * 1000); // Auto-logout after 2 hours
    
        return () => clearTimeout(sessionTimeout);
      }, [user]);

  return (
    <AuthContext.Provider value={{ user, loading , logout}}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to access the auth context
export function useAuth() {
  return useContext(AuthContext);
}
