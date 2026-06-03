"use client";

import Link from "next/link";

import { useRouter } from "next/navigation";

import {
  useEffect,
  useState,
} from "react";

import {
  usePathname,
} from "next/navigation";

import {
  LogOut,
} from "lucide-react";

import api from "@/services/api";

import {
  useAuthStore,
} from "@/store/authStore";

import {
  useToastStore,
} from "@/store/toastStore";

export default function TopNav() {

  const router = useRouter();

  const pathname = usePathname();

  const {
    user,
    role,
    logout,
    setUser,
  } = useAuthStore();

  const { addToast } =
    useToastStore();

  // -----------------------------------
  // Prevent Hydration Mismatch
  // -----------------------------------

  const [hydrated, setHydrated] =
    useState(false);

  // -----------------------------------
  // Dropdown State
  // -----------------------------------

  const [showDropdown, setShowDropdown] =
    useState(false);

  useEffect(() => {

    setHydrated(true);

  }, []);

  // -----------------------------------
  // Fetch Profile
  // -----------------------------------

  useEffect(() => {

    if (!hydrated) return;

    const token =
      localStorage.getItem(
        "access_token"
      );

    if (
      token &&
      (!user || !user.email)
    ) {

      api
        .get("/auth/profile/")
        .then((res) => {

          setUser(res.data);

        })
        .catch(() => {
          // ignore
        });
    }

  }, [hydrated]);

  // -----------------------------------
  // Close Dropdown On Outside Click
  // -----------------------------------

  useEffect(() => {

    const handleClickOutside = (
      event: MouseEvent
    ) => {

      const target =
        event.target as HTMLElement;

      if (
        !target.closest(
          ".profileDropdown"
        )
      ) {

        setShowDropdown(false);
      }
    };

    document.addEventListener(
      "click",
      handleClickOutside
    );

    return () => {

      document.removeEventListener(
        "click",
        handleClickOutside
      );
    };

  }, []);

  // -----------------------------------
  // Main App Padding
  // -----------------------------------

  useEffect(() => {

    if (!hydrated) return;

    const token =
      localStorage.getItem(
        "access_token"
      );

    const shouldPad =
      !!token &&
      pathname !== "/";

    const mainApp =
      document.querySelector(
        ".mainApp"
      ) as HTMLElement | null;

    if (!mainApp) return;

    if (shouldPad) {

      mainApp.style.paddingTop =
        "";

    } else {

      mainApp.style.paddingTop =
        "";
    }

    return () => {

      mainApp.style.paddingTop =
        "";
    };

  }, [pathname, hydrated]);

  // -----------------------------------
  // Prevent SSR mismatch
  // -----------------------------------

  if (!hydrated) {
    return null;
  }

  // -----------------------------------
  // Auth
  // -----------------------------------

  const isLoggedIn =
    !!user || !!role;

  const handleLogout = () => {

    logout();

    addToast(
      "Logged out",
      "info"
    );

    router.push(
      "/auth/login"
    );
  };

  // -----------------------------------
  // User Info
  // -----------------------------------

  const email =
    user?.email ?? null;

  const name =
    user?.name ??
    (
      email
        ? email.split("@")[0]
        : null
    );

  const initials =
    name
      ? name.charAt(0).toUpperCase()
      : "U";

  // -----------------------------------
  // UI
  // -----------------------------------

  return (

    <header
      className="
        sticky
        top-0
        z-50
        h-16
        w-full
        border-b
        border-slate-100
        bg-white/80
        backdrop-blur
      "
    >

      <div
        className="
          mx-auto
          flex
          max-w-7xl
          items-center
          justify-between
          gap-4
          px-6
          py-3
        "
      >

        {/* Logo */}

        <div
          className="
            flex
            items-center
            gap-6
          "
        >

          <Link
            href="/"
            className="
              text-lg
              font-bold
              text-slate-900
            "
          >
            TalentBridge
          </Link>
        </div>

        {/* Right Side */}

        <div
          className="
            flex
            items-center
            gap-4
          "
        >

          {!isLoggedIn ? (

            <div
              className="
                flex
                gap-3
              "
            >

              <Link
                href="/auth/login"
                className="
                  rounded-2xl
                  bg-slate-900
                  px-3
                  py-2
                  text-sm
                  font-semibold
                  text-white
                "
              >
                Login
              </Link>

              <Link
                href="/auth/register"
                className="
                  rounded-2xl
                  border
                  border-slate-200
                  px-3
                  py-2
                  text-sm
                  font-semibold
                  text-slate-700
                "
              >
                Register
              </Link>
            </div>

          ) : (

            <div
              className="
                relative
                profileDropdown
              "
            >

              {/* Avatar */}

              <button
                onClick={() =>
                  setShowDropdown(
                    !showDropdown
                  )
                }
                className="
                  flex
                  cursor-pointer
                  items-center
                  gap-2
                  rounded-full
                  px-2
                  py-1
                  transition
                  hover:bg-slate-100
                "
              >

                <div
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-full
                    bg-slate-200
                    text-sm
                    font-semibold
                    text-slate-700
                  "
                >
                  {initials}
                </div>
              </button>

              {/* Dropdown */}

              {showDropdown && (

                <div
                  className="
                    absolute
                    right-0
                    mt-3
                    w-72
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    p-5
                    shadow-lg
                  "
                >

                  {/* Header */}

                  <div
                    className="
                      flex
                      items-center
                      gap-3
                    "
                  >

                    <div
                      className="
                        flex
                        h-12
                        w-12
                        items-center
                        justify-center
                        rounded-full
                        bg-slate-200
                        text-lg
                        font-bold
                        text-slate-700
                      "
                    >
                      {initials}
                    </div>

                    <div>

                      <h3
                        className="
                          text-sm
                          font-semibold
                          text-slate-900
                        "
                      >
                        {name}
                      </h3>

                      <p
                        className="
                          text-xs
                          text-slate-500
                        "
                      >
                        {email}
                      </p>
                    </div>
                  </div>

                  {/* Divider */}

                  <div
                    className="
                      my-4
                      border-t
                      border-slate-200
                    "
                  />

                  {/* Details */}

                  <div
                    className="
                      space-y-3
                      text-sm
                      text-slate-700
                    "
                  >

                    <div className="flex justify-between">

                      <span className="font-medium">
                        Role
                      </span>

                      <span className="capitalize">
                        {role}
                      </span>
                    </div>

                    {user?.phone_number && (

                      <div className="flex justify-between">

                        <span className="font-medium">
                          Phone
                        </span>

                        <span>
                          {user.phone_number}
                        </span>
                      </div>
                    )}

                    {/* Recruiter Details */}

                    {role === "recruiter" && (

                      <>
                        {user?.company_name && (

                          <div className="flex justify-between">

                            <span className="font-medium">
                              Company
                            </span>

                            <span>
                              {user.company_name}
                            </span>
                          </div>
                        )}

                        {user?.company_address && (

                          <div className="flex justify-between gap-3">

                            <span className="font-medium">
                              Address
                            </span>

                            <span className="text-right">
                              {user.company_address}
                            </span>
                          </div>
                        )}
                      </>
                    )}

                    {/* Candidate Details */}

                    {role === "candidate" &&
                      user?.years_of_experience && (

                      <div className="flex justify-between">

                        <span className="font-medium">
                          Experience
                        </span>

                        <span>
                          {user.years_of_experience} Years
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Divider */}

                  <div
                    className="
                      my-4
                      border-t
                      border-slate-200
                    "
                  />

                  {/* Logout */}

                  <div
                    className="
                      flex
                      justify-end
                    "
                  >

                    <button
                      onClick={handleLogout}
                      className="
                        inline-flex
                        items-center
                        gap-2
                        rounded-2xl
                        bg-rose-50
                        px-3
                        py-2
                        text-xs
                        font-semibold
                        text-rose-700
                      "
                    >

                      <LogOut
                        size={14}
                      />

                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}