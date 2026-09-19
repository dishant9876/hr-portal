"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Eye, EyeOff, LoaderCircle, Layers3 } from "lucide-react";
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
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<LoginFormValues>();

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
    <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
      <div className="form-mark"><Layers3 size={23} /></div>
      <p className="eyebrow">WELCOME TO TALENTBRIDGE</p>
      <h1>Good to see you again.</h1>
      <p className="form-description">Sign in to pick up where you left off.</p>
      {alertMessage && <Alert type={alertType} message={alertMessage} />}
      <div className="auth-fields">
        <label htmlFor="login-email">Email address<input id="login-email" {...register("email", { required: true })} type="email" required autoComplete="email" placeholder="you@company.com" /></label>
        <label htmlFor="login-password">Password<div className="password-field"><input id="login-password" {...register("password", { required: true })} required autoComplete="current-password" type={showPassword ? "text" : "password"} placeholder="Enter your password" /><button type="button" className="password-toggle" aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword} onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></label>
      </div>
      <button type="submit" disabled={isSubmitting} className="primary-button">{isSubmitting ? <><LoaderCircle size={18} className="animate-spin" /> Signing in…</> : <>Sign in to your workspace <ArrowRight size={18} /></>}</button>
      <p className="auth-switch">New to TalentBridge? <Link href="/auth/register">Create an account <ArrowUpRightIcon /></Link></p>
    </form>
  );
}
function ArrowUpRightIcon() { return <span aria-hidden="true">↗</span>; }
