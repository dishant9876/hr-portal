"use client";

import { useEffect, useState } from "react";

import api from "@/services/api";

import {
  Building2,
  Mail,
  Phone,
  MapPin,
  User,
  Pencil,
  Save,
} from "lucide-react";

import {
  useAuthStore,
} from "@/store/authStore";

export default function RecruiterProfileCard() {

  const {
    setUser,
  } = useAuthStore();

  const [hydrated, setHydrated] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [isEditing, setIsEditing] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [success, setSuccess] =
    useState<string | null>(null);

  const [formData, setFormData] =
    useState({

      name: "",

      email: "",

      phone_number: "",

      company_name: "",

      company_address: "",
    });

  // -----------------------------------
  // Prevent Hydration Mismatch
  // -----------------------------------

  useEffect(() => {

    setHydrated(true);

  }, []);

  // -----------------------------------
  // Fetch Profile
  // -----------------------------------

  useEffect(() => {

    if (!hydrated) return;

    api
      .get("/auth/profile/")
      .then((res) => {

        const data = res.data;

        setFormData({

          name:
            data.name || "",

          email:
            data.email || "",

          phone_number:
            data.phone_number || "",

          company_name:
            data.company_name || "",

          company_address:
            data.company_address || "",
        });

      })
      .catch((err) => {

        console.error(
          "Profile fetch error:",
          err
        );

        setError(
          "Failed to load profile."
        );
      });

  }, [hydrated]);

  // Prevent SSR mismatch
  if (!hydrated) {
    return null;
  }

  // -----------------------------------
  // Handle Change
  // -----------------------------------

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement |
      HTMLTextAreaElement
    >
  ) => {

    setFormData({

      ...formData,

      [e.target.name]:
        e.target.value,
    });
  };

  // -----------------------------------
  // Save Profile
  // -----------------------------------

  const handleSave = async () => {

    try {

      setLoading(true);

      setError(null);

      setSuccess(null);

      const response =
        await api.put(
          "/auth/profile/update/",
          formData
        );

      setUser(response.data);

      setSuccess(
        "Profile updated successfully."
      );

      setIsEditing(false);

    } catch (err: any) {

      console.error(
        "Update failed:",
        err
      );

      setError(
        "Failed to update profile."
      );

    } finally {

      setLoading(false);
    }
  };

  return (

    <div className="rounded-3xl bg-white p-8 shadow-lg">

      {/* Header */}

      <div className="mb-8 flex items-center justify-between">

        <div>

          <h1 className="text-3xl font-bold text-slate-900">
            Recruiter Profile
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Manage your account details
          </p>
        </div>

        {/* Buttons */}

        {!isEditing ? (

          <button
            onClick={() =>
              setIsEditing(true)
            }
            className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
          >

            <Pencil size={16} />

            Edit
          </button>

        ) : (

          <button
            onClick={handleSave}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
          >

            <Save size={16} />

            {loading
              ? "Saving..."
              : "Save"}
          </button>
        )}
      </div>

      {/* Error */}

      {error && (

        <div className="mb-6 rounded-2xl bg-red-50 p-4 text-sm text-red-700">

          {error}
        </div>
      )}

      {/* Success */}

      {success && (

        <div className="mb-6 rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-700">

          {success}
        </div>
      )}

      {/* Form */}

      <div className="grid gap-6 md:grid-cols-2">

        {/* Name */}

        <div>

          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">

            <User size={16} />

            Name
          </label>

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            readOnly={!isEditing}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none focus:border-slate-900"
          />
        </div>

        {/* Email */}

        <div>

          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">

            <Mail size={16} />

            Email
          </label>

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            readOnly={!isEditing}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none focus:border-slate-900"
          />
        </div>

        {/* Phone */}

        <div>

          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">

            <Phone size={16} />

            Phone Number
          </label>

          <input
            type="text"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            readOnly={!isEditing}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none focus:border-slate-900"
          />
        </div>

        {/* Company */}

        <div>

          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">

            <Building2 size={16} />

            Company Name
          </label>

          <input
            type="text"
            name="company_name"
            value={formData.company_name}
            onChange={handleChange}
            readOnly={!isEditing}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none focus:border-slate-900"
          />
        </div>

        {/* Address */}

        <div className="md:col-span-2">

          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">

            <MapPin size={16} />

            Company Address
          </label>

          <textarea
            name="company_address"
            value={formData.company_address}
            onChange={handleChange}
            readOnly={!isEditing}
            rows={4}
            className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none focus:border-slate-900"
          />
        </div>
      </div>
    </div>
  );
}