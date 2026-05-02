"use client";

import { useEffect, useState } from "react";

type ProfileData = {
  name: string;
  email: string;
  phone: string;
  locationType: string;
  locationCity: string;
};

type FieldErrors = Partial<Record<keyof ProfileData, string>>;

const USER_TYPE_LABEL: Record<string, string> = {
  buyer_investor: "Buyer / Investor",
  existing_client: "Existing Client",
  developer: "Developer",
};

const EMPTY: ProfileData = {
  name: "",
  email: "",
  phone: "",
  locationType: "local",
  locationCity: "",
};

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1.5 text-xs text-red-600">{message}</p>;
}

function inputClass(hasError: boolean) {
  return `w-full rounded-lg border px-3 py-2.5 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 ${
    hasError
      ? "border-red-300 focus:border-red-400"
      : "border-neutral-200 focus:border-neutral-400"
  }`;
}

export default function ProfileClient() {
  const [saved, setSaved] = useState<ProfileData>(EMPTY);
  const [form, setForm] = useState<ProfileData>(EMPTY);
  const [userType, setUserType] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    fetch("/api/client/profile")
      .then((r) => r.json())
      .then((data) => {
        const profile: ProfileData = {
          name: data.name ?? "",
          email: data.email ?? "",
          phone: data.phone ?? "",
          locationType: data.location?.type ?? "local",
          locationCity: data.location?.city ?? "",
        };
        setSaved(profile);
        setForm(profile);
        setUserType(data.userType ?? "");
      })
      .catch(() => setApiError("Failed to load profile."))
      .finally(() => setLoading(false));
  }, []);

  const isDirty = JSON.stringify(form) !== JSON.stringify(saved);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  }

  function handleDiscard() {
    setForm(saved);
    setFieldErrors({});
    setApiError("");
  }

  async function handleSave() {
    const errors: FieldErrors = {};

    if (!form.name.trim()) {
      errors.name = "Name is required";
    } else if (!/^[A-Za-z\s]+$/.test(form.name.trim())) {
      errors.name = "Name can contain letters and spaces only";
    } else if (form.name.length > 100) {
      errors.name = "Name is too long";
    }

    if (form.phone) {
      const norm = form.phone.replace(/\s|-/g, "").trim();
      if (!/^\+?[0-9]{6,20}$/.test(norm)) {
        errors.phone = "Enter a valid phone number";
      }
    }

    if (form.locationCity.length > 100) {
      errors.locationCity = "City name is too long";
    }

    setFieldErrors(errors);
    if (Object.keys(errors).some((k) => errors[k as keyof FieldErrors])) return;

    setSaving(true);
    setApiError("");

    try {
      const res = await fetch("/api/client/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          locationType: form.locationType,
          locationCity: form.locationCity,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setFieldErrors(data.fieldErrors ?? {});
        setApiError(data.message ?? "Failed to save changes.");
        return;
      }

      setSaved(form);
      setSuccessModal(true);
    } catch {
      setApiError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="flex flex-1 items-center justify-center min-h-screen">
        <p className="text-sm text-neutral-400">Loading profile…</p>
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-neutral-200 px-8 py-5">
        <h1 className="text-xl font-semibold text-neutral-900">My Profile</h1>
        <p className="mt-0.5 text-sm text-neutral-500">
          View and update your personal details.
        </p>
      </div>

      <div className="flex-1 px-8 py-6 space-y-6 max-w-2xl">
        {/* User type badge */}
        {userType && (
          <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-neutral-400" />
            <span className="text-xs font-medium text-neutral-600">
              {USER_TYPE_LABEL[userType] ?? userType}
            </span>
          </div>
        )}

        {apiError && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {apiError}
          </div>
        )}

        {/* Personal Information */}
        <div className="rounded-xl border border-neutral-200 bg-white">
          <div className="border-b border-neutral-100 px-6 py-4">
            <h2 className="text-sm font-semibold text-neutral-900">Personal Information</h2>
          </div>
          <div className="space-y-5 px-6 py-5">
            {/* Name */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-neutral-500">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                maxLength={100}
                placeholder="Your full name"
                className={inputClass(Boolean(fieldErrors.name))}
              />
              <FieldError message={fieldErrors.name} />
            </div>

            {/* Email (read-only) */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-neutral-500">
                Email Address
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="email"
                  value={form.email}
                  readOnly
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm text-neutral-500 outline-none cursor-not-allowed"
                />
                <span className="shrink-0 rounded-md bg-neutral-100 px-2.5 py-1.5 text-xs font-medium text-neutral-500">
                  Read-only
                </span>
              </div>
              <p className="mt-1.5 text-xs text-neutral-400">
                Email cannot be changed. Contact support if needed.
              </p>
            </div>

            {/* Phone */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-neutral-500">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                maxLength={20}
                placeholder="e.g. +61412345678"
                className={inputClass(Boolean(fieldErrors.phone))}
              />
              <FieldError message={fieldErrors.phone} />
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="rounded-xl border border-neutral-200 bg-white">
          <div className="border-b border-neutral-100 px-6 py-4">
            <h2 className="text-sm font-semibold text-neutral-900">Location</h2>
          </div>
          <div className="space-y-5 px-6 py-5">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-neutral-500">
                Location Type
              </label>
              <select
                name="locationType"
                value={form.locationType}
                onChange={handleChange}
                className={inputClass(Boolean(fieldErrors.locationType))}
              >
                <option value="local">Local</option>
                <option value="overseas">Overseas</option>
              </select>
              <FieldError message={fieldErrors.locationType} />
            </div>

            {form.locationType === "local" && (
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  City
                </label>
                <input
                  type="text"
                  name="locationCity"
                  value={form.locationCity}
                  onChange={handleChange}
                  maxLength={100}
                  placeholder="e.g. Melbourne"
                  className={inputClass(Boolean(fieldErrors.locationCity))}
                />
                <FieldError message={fieldErrors.locationCity} />
              </div>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-3 pt-1">
          <button
            onClick={handleSave}
            disabled={saving || !isDirty}
            className="rounded-lg bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
          <button
            onClick={handleDiscard}
            disabled={saving || !isDirty}
            className="rounded-lg border border-neutral-200 px-5 py-2.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Discard Changes
          </button>
        </div>
      </div>

      {/* Success modal */}
      {successModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 px-6">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-50">
                <svg className="h-5 w-5 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h2 className="text-base font-semibold text-neutral-900">Profile Updated</h2>
            </div>
            <p className="text-sm text-neutral-600">
              Your personal details have been saved successfully.
            </p>
            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setSuccessModal(false)}
                className="rounded-lg bg-neutral-900 px-5 py-2 text-sm font-medium text-white hover:bg-neutral-700 transition"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
