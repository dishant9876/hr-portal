"use client";

import { useEffect } from "react";

import api from "@/services/api";

import {
  useAuthStore,
} from "@/store/authStore";

export default function AuthInitializer() {

  const {
    token,
    user,
    setUser,
    hydrated,
  } = useAuthStore();

  useEffect(() => {

    if (
      !hydrated ||
      !token ||
      user
    ) {
      return;
    }

    // Only fetch profile if we have a token but no user data
    api
      .get("/auth/profile/")
      .then((res) => {

        setUser(res.data);

      })
      .catch((error) => {
        console.log(
          "Failed to fetch profile:",
          error.response?.status
        );
      });

  }, [token, user, hydrated, setUser]);

  return null;
}