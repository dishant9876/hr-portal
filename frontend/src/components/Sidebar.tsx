"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import {
  Briefcase,
  LayoutDashboard,
  User,
  FileText,
  ClipboardList,
} from "lucide-react";

import {
  useAuthStore,
} from "@/store/authStore";

export default function Sidebar() {

  const {
    role,
    hydrated,
  } = useAuthStore();

  // -----------------------------------
  // Prevent Hydration Mismatch
  // -----------------------------------

  const [isMounted, setIsMounted] =
    useState(false);

  useEffect(() => {

    if (hydrated) {

      setIsMounted(true);
    }

  }, [hydrated]);

  // Prevent SSR mismatch
  if (!isMounted) {
    return null;
  }

  // -----------------------------------
  // Role Checks
  // -----------------------------------

  const isRecruiter =
    role === "recruiter";

  const isCandidate =
    role === "candidate";

  // -----------------------------------
  // UI
  // -----------------------------------

  return (

    <div
      className="
        fixed
        left-0
        top-0
        h-full
        w-72
        border-r
        border-slate-200
        bg-white
        p-6
        pt-20
      "
    >

      {/* Header */}

      <div className="mb-8">

        <h2
          className="
            mt-3
            text-2xl
            font-bold
            text-slate-900
          "
        >
          Dashboard
        </h2>

        {/* Role Badge */}

        {role && (

          <span
            className="
              mt-2
              inline-flex
              rounded-full
              bg-slate-100
              px-3
              py-1
              text-xs
              font-semibold
              uppercase
              tracking-[0.2em]
              text-slate-700
            "
          >

            {role === "recruiter"
              ? "Recruiter"
              : "Candidate"}
          </span>
        )}
      </div>

      {/* Recruiter Links */}

      {isRecruiter && (

        <nav
          className="
            space-y-3
            text-sm
            font-medium
            text-slate-700
          "
        >

          <Link
            href="/recruiter/dashboard"
            className="
              flex
              items-center
              gap-3
              rounded-2xl
              px-4
              py-3
              transition
              hover:bg-slate-100
            "
          >

            <LayoutDashboard
              size={18}
            />

            Recruiter Home
          </Link>

          <Link
            href="/recruiter/jobs"
            className="
              flex
              items-center
              gap-3
              rounded-2xl
              px-4
              py-3
              transition
              hover:bg-slate-100
            "
          >

            <Briefcase
              size={18}
            />

            Jobs
          </Link>

          <Link
            href="/recruiter/applications"
            className="
              flex
              items-center
              gap-3
              rounded-2xl
              px-4
              py-3
              transition
              hover:bg-slate-100
            "
          >

            <ClipboardList
              size={18}
            />

            Applications
          </Link>

          <Link
            href="/recruiter/profile"
            className="
              flex
              items-center
              gap-3
              rounded-2xl
              px-4
              py-3
              transition
              hover:bg-slate-100
            "
          >

            <User
              size={18}
            />

            Profile
          </Link>
        </nav>
      )}

      {/* Candidate Links */}

      {isCandidate && (

        <nav
          className="
            space-y-3
            text-sm
            font-medium
            text-slate-700
          "
        >

          <Link
            href="/candidate/dashboard"
            className="
              flex
              items-center
              gap-3
              rounded-2xl
              px-4
              py-3
              transition
              hover:bg-slate-100
            "
          >

            <LayoutDashboard
              size={18}
            />

            Candidate Home
          </Link>

          <Link
            href="/candidate/jobs"
            className="
              flex
              items-center
              gap-3
              rounded-2xl
              px-4
              py-3
              transition
              hover:bg-slate-100
            "
          >

            <Briefcase
              size={18}
            />

            Browse Jobs
          </Link>

          <Link
            href="/candidate/applications"
            className="
              flex
              items-center
              gap-3
              rounded-2xl
              px-4
              py-3
              transition
              hover:bg-slate-100
            "
          >

            <FileText
              size={18}
            />

            Applications
          </Link>

          <Link
            href="/candidate/profile"
            className="
              flex
              items-center
              gap-3
              rounded-2xl
              px-4
              py-3
              transition
              hover:bg-slate-100
            "
          >

            <User
              size={18}
            />

            Profile
          </Link>
        </nav>
      )}

      {/* No Role */}

      {!role && (

        <div
          className="
            mt-10
            rounded-3xl
            border
            border-slate-200
            bg-slate-50
            p-4
            text-sm
            text-slate-600
          "
        >

          Please log in or register
          to see your dashboard links.
        </div>
      )}
    </div>
  );
}