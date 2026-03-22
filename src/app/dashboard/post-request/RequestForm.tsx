"use client";

import { useActionState, useState } from "react";
import { postServiceRequest } from "./actions";
import type { ServiceCategory } from "@/lib/supabase/types";
import { validateRequired, validateMinLength, validateMaxLength } from "@/lib/validation";

const DESCRIPTION_MIN = 20;
const DESCRIPTION_MAX = 1000;
const TITLE_MAX       = 120;

interface RequestFormProps {
  categories: Pick<ServiceCategory, "id" | "name" | "icon">[];
  defaultLocation: string;
}

type FieldErrors = {
  description?: string;
  location?: string;
};

const initialState = { error: null };

export default function RequestForm({ categories, defaultLocation }: RequestFormProps) {
  const [state, formAction, pending] = useActionState(postServiceRequest, initialState);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [descLen, setDescLen]         = useState(0);

  function clearFieldError(field: keyof FieldErrors) {
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    const form = e.currentTarget;
    const data = new FormData(form);

    const description = (data.get("description") as string | null) ?? "";
    const location    = (data.get("location")    as string | null) ?? "";

    const errors: FieldErrors = {};
    const descErr = validateRequired(description, "Description")
      ?? validateMinLength(description, DESCRIPTION_MIN, "Description")
      ?? validateMaxLength(description, DESCRIPTION_MAX, "Description");
    const locErr  = validateRequired(location, "Location");

    if (descErr) errors.description = descErr;
    if (locErr)  errors.location    = locErr;

    if (Object.keys(errors).length > 0) {
      e.preventDefault();
      setFieldErrors(errors);
    }
  }

  const descTooShort = descLen > 0 && descLen < DESCRIPTION_MIN;
  const descNearMax  = descLen > DESCRIPTION_MAX * 0.85;

  return (
    <form action={formAction} onSubmit={handleSubmit} className="space-y-6" noValidate>

      {/* ── Title (optional) ──────────────────────────────────────────────── */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Title <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <input
          id="title"
          name="title"
          type="text"
          maxLength={TITLE_MAX}
          placeholder='e.g. "Fix leaking kitchen pipe"'
          className={inputCls(false)}
        />
        <p className="mt-1 text-xs text-gray-400">
          A short headline helps providers understand your job at a glance.
        </p>
      </div>

      {/* ── Category dropdown (optional) ──────────────────────────────────── */}
      <div>
        <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-1">
          Service category <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <div className="relative">
          <select
            id="category_id"
            name="category_id"
            defaultValue=""
            className="w-full appearance-none px-4 py-2.5 pr-10 rounded-lg border border-gray-300
                       text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400
                       focus:border-transparent transition cursor-pointer"
          >
            <option value="">— Any / not sure yet —</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.icon ? `${cat.icon}  ` : ""}{cat.name}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
            <svg className="w-4 h-4 text-gray-400" viewBox="0 0 16 16" fill="none"
                 stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 6l4 4 4-4" />
            </svg>
          </div>
        </div>
      </div>

      {/* ── Description (required) ────────────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description <span className="text-red-500">*</span>
          </label>
          <span className={`text-xs tabular-nums ${
            descTooShort  ? "text-amber-500" :
            descNearMax   ? "text-orange-500" :
            descLen === 0 ? "text-gray-400" : "text-gray-400"
          }`}>
            {descLen} / {DESCRIPTION_MAX}
          </span>
        </div>
        <textarea
          id="description"
          name="description"
          rows={5}
          maxLength={DESCRIPTION_MAX}
          placeholder="Describe the job in as much detail as possible — what needs doing, any known issues, dimensions, materials needed, urgency, etc."
          onChange={(e) => {
            setDescLen(e.target.value.length);
            clearFieldError("description");
          }}
          onBlur={(e) => {
            const err = validateMinLength(e.target.value, DESCRIPTION_MIN, "Description");
            if (err && e.target.value.length > 0) setFieldErrors((p) => ({ ...p, description: err }));
          }}
          className={`w-full px-4 py-2.5 rounded-lg border text-gray-900 placeholder-gray-400
                      focus:outline-none focus:ring-2 focus:border-transparent transition resize-none
                      ${fieldErrors.description ? "border-red-400 focus:ring-red-300" : "border-gray-300 focus:ring-orange-400"}`}
        />
        {fieldErrors.description
          ? <FieldError msg={fieldErrors.description} />
          : descTooShort
          ? <p className="mt-1 text-xs text-amber-600">At least {DESCRIPTION_MIN} characters needed ({DESCRIPTION_MIN - descLen} more).</p>
          : <p className="mt-1 text-xs text-gray-400">The more detail, the better response you&apos;ll get.</p>
        }
      </div>

      {/* ── Location (required) ───────────────────────────────────────────── */}
      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
          Location <span className="text-red-500">*</span>
        </label>
        <input
          id="location"
          name="location"
          type="text"
          defaultValue={defaultLocation}
          placeholder="e.g. Kumasi, Ashanti Region"
          onChange={() => clearFieldError("location")}
          className={inputCls(!!fieldErrors.location)}
        />
        {fieldErrors.location
          ? <FieldError msg={fieldErrors.location} />
          : <p className="mt-1 text-xs text-gray-400">Where the work needs to be done.</p>
        }
      </div>

      {/* ── Status note ───────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2.5 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
        <span className="text-lg">📢</span>
        <p className="text-sm text-blue-800">
          Your request will be posted as <span className="font-semibold">Open</span>{" "}
          and visible to service providers who match your selected category.
        </p>
      </div>

      {/* ── Server error ──────────────────────────────────────────────────── */}
      {state.error && <ErrorBanner msg={state.error} />}

      {/* ── Actions ───────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="w-full sm:w-auto px-8 py-3 bg-orange-500 text-white font-semibold rounded-xl
                     hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed
                     transition-colors shadow-sm flex items-center justify-center gap-2"
        >
          {pending && <Spinner />}
          {pending ? "Posting…" : "Post Request"}
        </button>
        <a href="/dashboard" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
          Cancel — back to dashboard
        </a>
      </div>
    </form>
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
