"use client";

import { useActionState, useState } from "react";
import { saveProfile } from "./actions";
import { validatePhone, validateRequired } from "@/lib/validation";

type FieldErrors = {
  full_name?: string;
  phone?: string;
  location?: string;
};

const initialState = { error: null };

export default function SetupProfilePage() {
  const [state, formAction, pending] = useActionState(saveProfile, initialState);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  function clearFieldError(field: keyof FieldErrors) {
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  // Client-side validation intercept — runs before the server action is called
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    const form = e.currentTarget;
    const data = new FormData(form);

    const fullName = (data.get("full_name") as string | null) ?? "";
    const phone    = (data.get("phone")     as string | null) ?? "";
    const location = (data.get("location")  as string | null) ?? "";

    const errors: FieldErrors = {};
    const nameErr  = validateRequired(fullName, "Full name");
    const phoneErr = validatePhone(phone);
    const locErr   = validateRequired(location, "Location");

    if (nameErr)  errors.full_name = nameErr;
    if (phoneErr) errors.phone     = phoneErr;
    if (locErr)   errors.location  = locErr;

    if (Object.keys(errors).length > 0) {
      e.preventDefault();           // stop the server action
      setFieldErrors(errors);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Set up your profile</h1>
          <p className="mt-2 text-gray-500 text-sm">
            Tell us a bit about yourself to get started on Artisan Connect.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form action={formAction} onSubmit={handleSubmit} className="space-y-6" noValidate>

            {/* Full name */}
            <div>
              <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-1">
                Full name <span className="text-red-500">*</span>
              </label>
              <input
                id="full_name"
                name="full_name"
                type="text"
                placeholder="e.g. Kwame Asante"
                onChange={() => clearFieldError("full_name")}
                className={inputCls(!!fieldErrors.full_name)}
              />
              {fieldErrors.full_name && <FieldError msg={fieldErrors.full_name} />}
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone number <span className="text-red-500">*</span>
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                placeholder="e.g. +233 24 000 0000"
                onChange={() => clearFieldError("phone")}
                onBlur={(e) => {
                  const err = validatePhone(e.target.value);
                  if (err) setFieldErrors((p) => ({ ...p, phone: err }));
                }}
                className={inputCls(!!fieldErrors.phone)}
              />
              {fieldErrors.phone
                ? <FieldError msg={fieldErrors.phone} />
                : <p className="mt-1 text-xs text-gray-400">Customers and providers will use this to contact you.</p>
              }
            </div>

            {/* Role selection */}
            <fieldset>
              <legend className="block text-sm font-medium text-gray-700 mb-3">
                I am a… <span className="text-red-500">*</span>
              </legend>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: "customer", emoji: "🛠️", label: "Customer", desc: "I need skilled artisans for my projects", defaultChecked: true },
                  { value: "service_provider", emoji: "👷", label: "Service Provider", desc: "I offer skilled trade services", defaultChecked: false },
                ].map((opt) => (
                  <label key={opt.value} className="relative cursor-pointer">
                    <input
                      type="radio"
                      name="role"
                      value={opt.value}
                      className="peer sr-only"
                      defaultChecked={opt.defaultChecked}
                    />
                    <div className="flex flex-col items-center gap-2 p-5 rounded-xl border-2 border-gray-200 bg-gray-50 peer-checked:border-orange-400 peer-checked:bg-orange-50 transition-all">
                      <span className="text-3xl">{opt.emoji}</span>
                      <span className="font-semibold text-gray-800 text-sm">{opt.label}</span>
                      <span className="text-xs text-gray-500 text-center leading-tight">{opt.desc}</span>
                    </div>
                  </label>
                ))}
              </div>
            </fieldset>

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Location <span className="text-red-500">*</span>
              </label>
              <input
                id="location"
                name="location"
                type="text"
                placeholder="e.g. Kumasi, Ghana"
                onChange={() => clearFieldError("location")}
                className={inputCls(!!fieldErrors.location)}
              />
              {fieldErrors.location && <FieldError msg={fieldErrors.location} />}
            </div>

            {/* Bio — optional */}
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                Bio <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <textarea
                id="bio"
                name="bio"
                rows={3}
                placeholder="A short description about you or your services…"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-gray-900
                           placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400
                           focus:border-transparent transition resize-none"
              />
            </div>

            {/* Server error */}
            {state.error && <ErrorBanner msg={state.error} />}

            {/* Submit */}
            <button
              type="submit"
              disabled={pending}
              className="w-full py-3 bg-orange-500 text-white font-semibold rounded-lg
                         hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed
                         transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              {pending && <Spinner />}
              {pending ? "Saving…" : "Save & Continue →"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function inputCls(hasError: boolean) {
  return `w-full px-4 py-2.5 rounded-lg border text-gray-900 placeholder-gray-400
          focus:outline-none focus:ring-2 focus:border-transparent transition
          ${hasError ? "border-red-400 focus:ring-red-300" : "border-gray-300 focus:ring-orange-400"}`;
}

function FieldError({ msg }: { msg: string }) {
  return (
    <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
      <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm-.75 3.75a.75.75 0 0 1 1.5 0v3.5a.75.75 0 0 1-1.5 0v-3.5zm.75 7a.875.875 0 1 1 0-1.75.875.875 0 0 1 0 1.75z" />
      </svg>
      {msg}
    </p>
  );
}

function ErrorBanner({ msg }: { msg: string }) {
  return (
    <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
      <svg className="w-4 h-4 flex-shrink-0 mt-0.5" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm-.75 3.75a.75.75 0 0 1 1.5 0v3.5a.75.75 0 0 1-1.5 0v-3.5zm.75 7a.875.875 0 1 1 0-1.75.875.875 0 0 1 0 1.75z" />
      </svg>
      {msg}
    </div>
  );
}

function Spinner() {
  return (
    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  );
}
