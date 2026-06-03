import { create } from "zustand";

import {
  persist,
  createJSONStorage,
} from "zustand/middleware";

interface User {
  name?: string;
  email?: string;
  phone_number?: string;

  company_name?: string;
  company_address?: string;

  years_of_experience?: number;
}

interface AuthState {

  user: User | null;

  token: string | null;

  role:
    | "recruiter"
    | "candidate"
    | null;

  hydrated: boolean;

  setUser: (
    user: User | null
  ) => void;

  setToken: (
    token: string | null
  ) => void;

  setAuthRole: (
    role:
      | "recruiter"
      | "candidate"
      | null
  ) => void;

  setHydrated: (
    value: boolean
  ) => void;

  logout: () => void;
}

export const useAuthStore =
  create<AuthState>()(

    persist(

      (set) => ({

        user: null,

        token: null,

        role: null,

        hydrated: false,

        setUser: (user) =>
          set({ user }),

        setToken: (token) =>
          set({ token }),

        setAuthRole: (role) =>
          set({ role }),

        setHydrated: (value) =>
          set({
            hydrated: value,
          }),

        logout: () =>
          set({
            user: null,
            token: null,
            role: null,
          }),
      }),

      {
        name: "auth-storage",

        storage: createJSONStorage(
          () => localStorage
        ),

        onRehydrateStorage:
          () => (state) => {

            state?.setHydrated(true);
          },
      }
    )
  );