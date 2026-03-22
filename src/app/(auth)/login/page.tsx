"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { validateEmail, validateRequired } from "@/lib/validation";

type FieldErrors = { email?: string; password?: string };

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading]   = useState(false);

  // ── Real-time field-level clear ──────────────────────────────────────────
  function clearFieldError(field: keyof FieldErrors) {
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  // ── Submit ───────────────────────────────────────────────────────────────
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setServerError(null);

    const errors: FieldErrors = {};
    const emailErr    = validateEmail(email);
    const passwordErr = validateRequired(password, "Password");
    if (emailErr)    errors.email    = emailErr;
    if (passwordErr) errors.password = passwordErr;

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      setServerError(
        error.message === "Invalid login credentials"
          ? "Incorrect email or password. Please try again."
          : error.message
      );
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back</h1>
          <p className="mt-2 text-gray-500 text-sm">
            Sign in to your Artisan Connect account
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5" noValidate>
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); clearFieldError("email"); }}
              onBlur={() => {
                const err = validateEmail(email);
                if (err) setFieldErrors((p) => ({ ...p, email: err }));
              }}
              placeholder="you@example.com"
              className={`w-full px-4 py-2.5 rounded-lg border text-gray-900 placeholder-gray-400
                          focus:outline-none focus:ring-2 focus:border-transparent transition
                          ${fieldErrors.email
                            ? "border-red-400 focus:ring-red-300"
                            : "border-gray-300 focus:ring-orange-400"}`}
            />
            {fieldErrors.email && <FieldError msg={fieldErrors.email} />}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); clearFieldError("password"); }}
              placeholder="••••••••"
              className={`w-full px-4 py-2.5 rounded-lg border text-gray-900 placeholder-gray-400
                          focus:outline-none focus:ring-2 focus:border-transparent transition
                          ${fieldErrors.password
                            ? "border-red-400 focus:ring-red-300"
                            : "border-gray-300 focus:ring-orange-400"}`}
            />
            {fieldErrors.password && <FieldError msg={fieldErrors.password} />}
          </div>

          {/* Server error */}
          {serverError && <ErrorBanner msg={serverError} />}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-orange-500 text-white font-semibold rounded-lg
                       hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed
                       transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            {loading && <Spinner />}
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-orange-500 font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </div>

      <p className="mt-6 text-center">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
          ← Back to home
        </Link>
      </p>
    </div>
  );
}

// ─── Shared mini-components ───────────────────────────────────────────────────

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
