"use client";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

interface Props {
  mobile?: boolean;
  onClose?: () => void;
}

const NavigationLinks = ({ mobile = false, onClose = () => {} }: Props) => {
  const { user } = useAuth();

  return (
    <>
      <Link
        href="/"
        onClick={onClose}
        className={`hover:text-primary transition-colors ${mobile ? "block py-2" : ""}`}
      >
        Home
      </Link>
      {!user ? (
        <Link
          href="/features"
          onClick={onClose}
          className={`hover:text-primary transition-colors ${mobile ? "block py-2" : ""}`}
        >
          Features
        </Link>
      ) : (
        <>
          <Link href="/job-listing" onClick={onClose} className={`hover:text-primary transition-colors ${mobile ? "block py-2" : ""}`}>
            Find Jobs
          </Link>
          <Link href="/tracker" onClick={onClose} className={`hover:text-primary transition-colors ${mobile ? "block py-2" : ""}`}>
            Application Tracker
          </Link>
          <Link href="/analyze" onClick={onClose} className={`hover:text-primary transition-colors ${mobile ? "block py-2" : ""}`}>
            ATS Analyzer
          </Link>
        </>
      )}
    </>
  );
};

export default NavigationLinks;
