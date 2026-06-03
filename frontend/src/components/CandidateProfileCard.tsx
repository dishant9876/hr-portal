"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import { useRouter } from "next/navigation";

export default function CandidateProfileCard() {
  const router = useRouter();
  const [candidate, setCandidate] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/auth/profile/");
        setCandidate(res.data);
      } catch (err: any) {
        console.error("Failed to fetch profile:", err);
        if (err.response?.status === 401) {
          // Token expired or invalid
          setError("Your session has expired. Please log in again.");
          // Redirect to login after a short delay
          setTimeout(() => {
            router.push("/auth/login");
          }, 2000);
        } else {
          setError("Failed to load profile. Please try again.");
          setCandidate({
            name: "Unknown",
            email: "unknown@example.com",
            phone_number: "-",
            years_of_experience: null,
          });
        }
      }
    };

    fetchProfile();
  }, [router]);

  const display = candidate ?? {
    name: "Loading...",
    email: "",
    phone_number: "",
    years_of_experience: "",
  };

  return (
    <div className="rounded-3xl bg-white p-8 shadow-lg">
      <h1 className="text-3xl font-bold text-slate-900">Candidate Profile</h1>
      {error && (
        <div className="mt-4 rounded-lg bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}
      <div className="mt-6 space-y-4 text-slate-700">
        <p><strong>Name:</strong> {display.name}</p>
        <p><strong>Email:</strong> {display.email}</p>
        <p><strong>Phone:</strong> {display.phone_number}</p>
        <p><strong>Experience:</strong> {display.years_of_experience ?? '-'}</p>
      </div>
    </div>
  );
}
