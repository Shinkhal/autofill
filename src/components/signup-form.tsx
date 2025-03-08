"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, OAuthProvider } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function SignupForm({ className, ...props }: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Handle Google Signup
  const handleGoogleSignup = async () => {
    const provider = new GoogleAuthProvider();
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      toast.success(`Welcome, ${user.displayName}!`);
      router.push("/profile");
    } catch (error) {
      console.error("Google signup failed:", error.message);
      toast.error("Google signup failed. Please try again!");
    } finally {
      setLoading(false);
    }
  };

  // Handle Apple Signup
  const handleAppleSignup = async () => {
    const provider = new OAuthProvider("apple.com");
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      toast.success(`Welcome, ${user.displayName || "User"}!`);
      router.push("/profile");
    } catch (error) {
      console.error("Apple signup failed:", error.message);
      toast.error("Apple signup failed. Please try again!");
    } finally {
      setLoading(false);
    }
  };

  // Handle Email/Password Signup
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    setLoading(true);
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    toast.success("Account created successfully! Please complete your profile.");
    router.push("/profile"); // Redirect to profile page for details
  } catch (error) {
    console.error("Signup failed:", error.message);
    toast.error("Signup failed. Please try again!");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create an account</CardTitle>
          <CardDescription>Sign up with Apple or Google</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6">
              <div className="flex flex-col gap-4">
                <Button variant="outline" className="w-full" onClick={handleAppleSignup} type="button" disabled={loading}>
                  {loading ? "Signing up..." : "Sign up with Apple"}
                </Button>
                <Button variant="outline" className="w-full" onClick={handleGoogleSignup} type="button" disabled={loading}>
                  {loading ? "Signing up..." : "Sign up with Google"}
                </Button>
              </div>
              <div className="relative text-center text-sm">
                <span className="bg-background text-muted-foreground relative z-10 px-2">Or continue with</span>
              </div>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Creating account..." : "Sign Up"}
                </Button>
              </div>
              <div className="text-center text-sm">
                Already have an account?{" "}
                <a href="/auth/login" className="underline underline-offset-4">
                  Login
                </a>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-muted-foreground text-center text-xs">
        By signing up, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
