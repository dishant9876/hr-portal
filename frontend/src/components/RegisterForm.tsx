"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import api from "@/services/api";

import { useAuthStore } from "@/store/authStore";
import { useToastStore } from "@/store/toastStore";

import Alert from "@/components/Alert";

interface RegisterFormValues {
  role: "recruiter" | "candidate";

  name: string;
  email: string;
  password: string;

  phone_number: string;

  company_name?: string;
  company_address?: string;

  years_of_experience?: number;
}

export default function RegisterForm() {

  const router = useRouter();

  const {
    setToken,
    setUser,
    setAuthRole,
  } = useAuthStore();

  const { addToast } = useToastStore();

  const [role, setRole] = useState<
    "recruiter" | "candidate"
  >("recruiter");

  const [alertMessage, setAlertMessage] =
    useState<string | null>(null);

  const [alertType, setAlertType] = useState<
    "success" | "error" | "info"
  >("error");

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { isSubmitting },
  } = useForm<RegisterFormValues>({
    defaultValues: {
      role: "recruiter",
    },
    shouldUnregister: true,
  });

  // -------------------------------------
  // Extract Backend Error Message
  // -------------------------------------

  const getBackendErrorMessage = (
    error: any
  ): string => {

    const data = error?.response?.data;

    console.log(
      "Backend Error Data:",
      data
    );

    if (!data) {
      return "Something went wrong.";
    }

    // Recursive extractor
    const extractMessage = (
      obj: any
    ): string => {

      // String
      if (typeof obj === "string") {
        return obj;
      }

      // Array
      if (Array.isArray(obj)) {
        return extractMessage(obj[0]);
      }

      // Object
      if (typeof obj === "object") {

        const firstKey =
          Object.keys(obj)[0];

        if (!firstKey) {
          return "Registration failed.";
        }

        return extractMessage(
          obj[firstKey]
        );
      }

      return "Registration failed.";
    };

    return extractMessage(data);
  };

  // -------------------------------------
  // Submit Handler
  // -------------------------------------

  const onSubmit = async (
    data: RegisterFormValues
  ) => {

    const endpoint =
      data.role === "recruiter"
        ? "/auth/register/recruiter/"
        : "/auth/register/candidate/";

    try {

      const payload = {

        name: data.name,

        email: data.email,

        password: data.password,

        phone_number:
          data.phone_number,

        ...(data.role === "recruiter"
          ? {
            company_name:
              data.company_name,

            company_address:
              data.company_address,
          }
          : {
            years_of_experience:
              data.years_of_experience,
          }),
      };



      const response =
        await api.post(
          endpoint,
          payload
        );

      console.log(
        "Registration Success:",
        response.data
      );

      // Save auth token
      if (response.data?.access) {

        setToken(
          response.data.access
        );
      }

      // Save user
      setUser({
        name: data.name,
        email: data.email,
        phone_number: data.phone_number,

        ...(data.role === "recruiter"
          ? {
            company_name:
              data.company_name,

            company_address:
              data.company_address,
          }
          : {
            years_of_experience:
              data.years_of_experience,
          }),
      });

      setAuthRole(data.role);

      // Success Alert
      setAlertType("success");

      setAlertMessage(
        "Registration successful. Redirecting..."
      );

      addToast(
        "Registration successful.",
        "success"
      );

      // Reset form
      reset();

      // Redirect
      router.push(
        data.role === "recruiter"
          ? "/recruiter/dashboard"
          : "/candidate/dashboard"
      );

    } catch (error: any) {

      console.log(
        "Registration Error:",
        error?.response?.data
      );

      const backendMessage =
        getBackendErrorMessage(
          error
        );

      setAlertType("error");

      setAlertMessage(
        backendMessage
      );

      addToast(
        backendMessage,
        "error"
      );
    }
  };

  return (

    <form
      onSubmit={handleSubmit(onSubmit)}
      className="auth-form register-form"
    >

      {/* Title */}

      <h1 className="
        text-3xl
        font-bold
        text-slate-900
      ">
        Start your next chapter.
      </h1>
      <p className="form-description">Create your account. Connect with possibility.</p>

      {/* Alert */}

      {alertMessage && (

        <Alert
          type={alertType}
          message={alertMessage}
        />
      )}

      {/* Role Toggle */}

      <div className="
        flex
        flex-col
        gap-3
        sm:flex-row
      ">

        <button
          type="button"
          aria-pressed={role === "recruiter"}
          onClick={() => {

            setRole("recruiter");

            setValue(
              "role",
              "recruiter"
            );
          }}
          className={`
            rounded-2xl
            px-5
            py-3
            text-sm
            font-semibold
            transition

            ${role === "recruiter"
              ? "bg-slate-900 text-white"
              : "bg-slate-100 text-slate-700"
            }
          `}
        >
          Recruiter
        </button>

        <button
          type="button"
          aria-pressed={role === "candidate"}
          onClick={() => {

            setRole("candidate");

            setValue(
              "role",
              "candidate"
            );
          }}
          className={`
            rounded-2xl
            px-5
            py-3
            text-sm
            font-semibold
            transition

            ${role === "candidate"
              ? "bg-slate-900 text-white"
              : "bg-slate-100 text-slate-700"
            }
          `}
        >
          Candidate
        </button>
      </div>

      {/* Hidden Role */}

      <input
        type="hidden"
        {...register("role")}
      />

      {/* Common Fields */}

      <div className="
        grid
        gap-4
        sm:grid-cols-2
      ">

        <label className="register-label">Full name<input
          {...register("name", {
            required: true,
          })}
          placeholder="Name"
          className="
            w-full
            rounded-2xl
            border
            border-slate-300
            bg-slate-50
            px-4
            py-3
            outline-none
            focus:border-slate-900
          "
        /></label>

        <label className="register-label">Email<input
          {...register("email", {
            required: true,
          })}
          type="email" autoComplete="email" placeholder="Email"
          className="
            w-full
            rounded-2xl
            border
            border-slate-300
            bg-slate-50
            px-4
            py-3
            outline-none
            focus:border-slate-900
          "
        /></label>

        <label className="register-label">Password<input
          {...register("password", {
            required: true,
          })}
          type="password"
          placeholder="Password"
          className="
            w-full
            rounded-2xl
            border
            border-slate-300
            bg-slate-50
            px-4
            py-3
            outline-none
            focus:border-slate-900
          "
        /></label>

        <label className="register-label">Phone Number<input
          {...register("phone_number", {
            required: true,
          })}
          placeholder="Phone Number"
          className="
            w-full
            rounded-2xl
            border
            border-slate-300
            bg-slate-50
            px-4
            py-3
            outline-none
            focus:border-slate-900
          "
        /></label>
      </div>

      {/* Recruiter Fields */}

      {role === "recruiter" ? (

        <div className="
          grid
          gap-4
          sm:grid-cols-2
        ">

          <label className="register-label">Company Name<input
            {...register(
              "company_name",
              {
                required: true,
              }
            )}
            placeholder="Company Name"
            className="
              w-full
              rounded-2xl
              border
              border-slate-300
              bg-slate-50
              px-4
              py-3
              outline-none
              focus:border-slate-900
            "
          /></label>

          <label className="register-label">Company Address<input
            {...register(
              "company_address",
              {
                required: true,
              }
            )}
            placeholder="Company Address"
            className="
              w-full
              rounded-2xl
              border
              border-slate-300
              bg-slate-50
              px-4
              py-3
              outline-none
              focus:border-slate-900
            "
          /></label>
        </div>

      ) : (

        <label className="register-label">Years of Experience<input
          {...register(
            "years_of_experience",
            {
              required: true,
              valueAsNumber: true,
            }
          )}
          type="number"
          min="0" placeholder="Years of Experience"
          className="
            w-full
            rounded-2xl
            border
            border-slate-300
            bg-slate-50
            px-4
            py-3
            outline-none
            focus:border-slate-900
          "
        /></label>
      )}

      {/* Submit */}

      <button
        type="submit"
        disabled={isSubmitting}
        className="
          w-full
          rounded-2xl
          bg-slate-900
          px-4
          py-3
          text-white
          transition
          hover:bg-slate-700
        "
      >
        {isSubmitting ? "Creating your account…" : "Create account →"}
      </button>

      {/* Login Link */}

      <div className="
        mt-2
        text-center
        text-sm
        text-slate-600
      ">

        Already have an account?{" "}

        <Link
          href="/auth/login"
          className="
            font-semibold
            text-slate-900
          "
        >
          Login
        </Link>
      </div>
    </form>
  );
}