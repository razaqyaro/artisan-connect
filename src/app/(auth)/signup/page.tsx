"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import {
  validateEmail,
  validatePassword,
  validatePasswordMatch,
} from "@/lib/validation";

type FieldErrors = {
  email?: string;
  password?: string;
  confirmPassword?: string;
};

// ── Password strength ────────────────────────────────────────────────────────

function getStrength(password: string): {
  score: number;   // 0–4
  label: string;
  color: string;
} {
  if (!password) return { score: 0, label: "", color: "bg-gray-200" };
  let score = 0;
  if (password.length >= 6)  score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/\d/.test(password) || /[^A-Za-z0-9]/.test(password)) score++;

  const levels = [
    { label: "Very weak", color: "bg-red-500" },
    { label: "Weak",      color: "bg-orange-400" },
    { label: "Fair",      color: "bg-yellow-400" },
    { label: "Strong",    color: "bg-green-400" },
    { label: "Very strong", color: "bg-green-600" },
  ];
  return { score, ...levels[score] };
}

export default function SignupPage() {
  const [email, setEmail]                   = useState("");
  const [password, setPassword]             = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors, setFieldErrors]       = useState<FieldErrors>({});
  const [serverError, setServerError]       = useState<string | null>(null);
  const [loading, setLoading]               = useState(false);
  const [success, setSuccess]               = useState(false);

  const strength = getStrength(password);

  function clearFieldError(field: keyof FieldErrors) {
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setServerError(null);

    const errors: FieldErrors = {};
    const emailErr    = validateEmail(email);
    const passwordErr = validatePassword(password);
    const matchErr    = validatePasswordMatch(password, confirmPassword);

    if (emailErr)    errors.email           = emailErr;
    if (passwordErr) errors.password        = passwordErr;
    if (!passwordErr && matchErr) errors.confirmPassword = matchErr;

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { emailRedirectTo: `${window.location.origin}/dashboard` },
    });

    if (error) {
      setServerError(error.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  // ── Success state ────────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Check your email</h2>
          <p className="text-gray-500 text-sm">
            We sent a confirmation link to{" "}
            <span className="font-medium text-gray-700">{email}</span>.
            Click the link to activate your account.
          </p>
          <Link href="/login" className="mt-6 inline-block text-orange-500 font-medium hover:underline text-sm">
            Back to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Create account</h1>
          <p className="mt-2 text-gray-500 text-sm">
            Join Artisan Connect today — it&apos;s free
          </p>
        </div>

        <form onSubmit={handleSignup} className="space-y-5" noValidate>
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
              className={inputCls(!!fieldErrors.email)}
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
              autoComplete="new-password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); clearFieldError("password"); }}
              placeholder="Min. 6 characters"
              className={inputCls(!!fieldErrors.password)}
            />

            {/* Strength bar — shown once the user starts typing */}
            {password.length > 0 && (
              <div className="mt-2 space-y-1">
                <div className="flex gap-1">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                        i < strength.score ? strength.color : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-gray-500">
                  Strength:{" "}
                  <span className="font-medium text-gray-700">{strength.label}</span>
                </p>
              </div>
            )}

            {fieldErrors.password && <FieldError msg={fieldErrors.password} />}
          </div>

          {/* Confirm password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm password
            </label>
            <input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => { setConfirmPassword(e.target.value); clearFieldError("confirmPassword"); }}
              onBlur={() => {
                if (password && confirmPassword) {
                  const err = validatePasswordMatch(password, confirmPassword);
                  if (err) setFieldErrors((p) => ({ ...p, confirmPassword: err }));
                }
              }}
              placeholder="••••••••"
              className={inputCls(!!fieldErrors.confirmPassword)}
            />
            {/* Real-time match indicator */}
            {confirmPassword.length > 0 && (
              password === confirmPassword ? (
                <p className="mt-1.5 text-xs text-green-600 flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M6.5 11.5L3 8l1.4-1.4 2.1 2.1 4.6-4.6L12.5 5.5z" />
                  </svg>
                  Passwords match
                </p>
              ) : (
                <FieldError msg={fieldErrors.confirmPassword ?? "Passwords do not match."} />
              )
            )}
          </div>

          {/* Server error */}
          {serverError && <ErrorBanner msg={serverError} />}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-orange-500 text-white font-semibold rounded-lg
                       hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed
                       transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            {loading && <Spinner />}
            {loading ? "Creating account…" : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link href="/login" className="text-orange-500 font-medium hover:underline">
            Sign in
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
