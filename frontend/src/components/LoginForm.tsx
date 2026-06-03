"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import api from "@/services/api";
import { useAuthStore } from "@/store/authStore";
import { useToastStore } from "@/store/toastStore";
import Alert from "@/components/Alert";

interface LoginFormValues {
  email: string;
  password: string;
}

export default function LoginForm() {
  const router = useRouter();
  const { setToken, setUser, setAuthRole } = useAuthStore();
  const { addToast } = useToastStore();
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<"success" | "error" | "info">("error");
  const { register, handleSubmit } = useForm<LoginFormValues>();

  const onSubmit = async (data: LoginFormValues) => {
    setAlertMessage(null);
    try {
      const response = await api.post("/auth/jwt/create/", {
        username: data.email,
        password: data.password,
      });
      const newToken = response.data.access;
      setToken(newToken);
      
      // Determine user role and redirect
      try {
        // Try to fetch profile to get role
        const profileRes = await api.get("/auth/profile/");
        const profileData = profileRes.data;
        
        // Extract role from various possible field names
        const userRole = profileData.role || profileData.userType || profileData.user_type || "candidate";
        
        setUser({ 
          email: data.email, 
          ...profileData 
        });
        setAuthRole(userRole);
        
        // Redirect based on role
        router.push(userRole === "recruiter" ? "/recruiter/dashboard" : "/candidate/dashboard");
      } catch (roleErr: any) {
        // Fallback: try /auth/role/ endpoint if /auth/profile/ fails
        try {
          const roleRes = await api.get("/auth/role/");
          const userRole = roleRes.data.role || "candidate";
          setUser({ email: data.email });
          setAuthRole(userRole);
          router.push(userRole === "recruiter" ? "/recruiter/dashboard" : "/candidate/dashboard");
        } catch {
          // Final fallback: default to candidate
          setUser({ email: data.email });
          setAuthRole("candidate");
          router.push("/candidate/dashboard");
        }
      }
    } catch (error: any) {
      console.error("Login error:", error);
      const backendMessage = getBackendErrorMessage(error) || "Login failed. Check your email and password.";
      setAlertType("error");
      setAlertMessage(backendMessage);
      addToast(backendMessage, "error");
    }
  };

  const getBackendErrorMessage = (error: any): string | null => {
    const data = error?.response?.data;
    if (!data) return null;
    if (typeof data === "string") return data;
    if (typeof data.detail === "string") return data.detail;
    if (Array.isArray(data.detail)) return data.detail[0];
    if (typeof data.email === "string") return data.email;
    if (Array.isArray(data.email)) return data.email[0];
    if (typeof data.username === "string") return data.username;
    if (Array.isArray(data.username)) return data.username[0];
    if (typeof data.non_field_errors === "string") return data.non_field_errors;
    if (Array.isArray(data.non_field_errors)) return data.non_field_errors[0];
    const firstKey = Object.keys(data)[0];
    const firstValue = data[firstKey];
    if (typeof firstValue === "string") return firstValue;
    if (Array.isArray(firstValue)) return firstValue[0];
    return null;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md space-y-6 rounded-3xl bg-white p-8 shadow-lg">
      <h1 className="text-3xl font-bold text-slate-900">Login</h1>
      {alertMessage && <Alert type={alertType} message={alertMessage} />}
      <div className="space-y-4">
        <input
          {...register("email")}
          placeholder="Email"
          className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-slate-900"
        />
        <input
          {...register("password")}
          type="password"
          placeholder="Password"
          className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-slate-900"
        />
      </div>
      <button type="submit" className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-white transition hover:bg-slate-700">
        Sign In
      </button>
      <div className="text-center text-sm text-slate-600 mt-2">
        Don't have an account?{' '}
        <Link href="/auth/register" className="text-slate-900 font-semibold">
          Register
        </Link>
      </div>
    </form>
  );
}
