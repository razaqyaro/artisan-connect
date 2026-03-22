"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

// ─── Types ───────────────────────────────────────────────────────────────────

type Category = {
  id: number;
  name: string;
  icon: string | null;
} | null;

export type JobRequest = {
  id: number;
  title: string;
  description: string;
  location: string;
  created_at: string;
  service_categories: Category;
  customerPhone: string | null;
};

interface JobBoardProps {
  jobs: JobRequest[];
  providerSkillIds: number[];
}

type Filter = "all" | "matching";

// ─── Relative time helper ────────────────────────────────────────────────────

function timeAgo(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime();
  const mins  = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days  = Math.floor(diff / 86_400_000);

  if (mins  <  1) return "Just now";
  if (mins  < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days  <  7) return `${days}d ago`;
  return new Date(isoDate).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: days > 365 ? "numeric" : undefined,
  });
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function JobBoard({ jobs, providerSkillIds }: JobBoardProps) {
  const [filter, setFilter] = useState<Filter>("all");

  const matchingJobs = useMemo(
    () =>
      jobs.filter(
        (job) =>
          job.service_categories === null ||
          providerSkillIds.includes(job.service_categories.id)
      ),
    [jobs, providerSkillIds]
  );

  const displayed = filter === "all" ? jobs : matchingJobs;
  const hasSkills = providerSkillIds.length > 0;

  return (
    <div>
      {/* ── Filter toggle ────────────────────────────────────────────────── */}
      <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1 w-fit mb-8">
        <FilterTab
          active={filter === "all"}
          onClick={() => setFilter("all")}
          label="All Open Jobs"
          count={jobs.length}
        />
        <FilterTab
          active={filter === "matching"}
          onClick={() => setFilter("matching")}
          label="Matching My Skills"
          count={matchingJobs.length}
          disabled={!hasSkills}
          disabledTooltip="Add skills to your profile to use this filter"
        />
      </div>

      {/* ── No skills nudge (matching tab only) ─────────────────────────── */}
      {filter === "matching" && !hasSkills && (
        <div className="mb-6 flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
          <span className="text-xl mt-0.5">💡</span>
          <p className="text-sm text-amber-800">
            You haven&apos;t added any skills yet.{" "}
            <Link
              href="/dashboard/skills"
              className="font-semibold underline hover:text-amber-900"
            >
              Manage your skills
            </Link>{" "}
            to filter jobs that match your trades.
          </p>
        </div>
      )}

      {/* ── Job list ─────────────────────────────────────────────────────── */}
      {displayed.length === 0 ? (
        <EmptyState filter={filter} hasSkills={hasSkills} />
      ) : (
        <div className="flex flex-col gap-4">
          {displayed.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Filter tab ───────────────────────────────────────────────────────────────

function FilterTab({
  active,
  onClick,
  label,
  count,
  disabled = false,
  disabledTooltip,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
  disabled?: boolean;
  disabledTooltip?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={disabled ? disabledTooltip : undefined}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
        ${
          active
            ? "bg-white text-gray-900 shadow-sm"
            : disabled
              ? "text-gray-400 cursor-not-allowed"
              : "text-gray-600 hover:text-gray-900"
        }`}
    >
      {label}
      <span
        className={`text-xs font-semibold px-1.5 py-0.5 rounded-full
          ${active ? "bg-orange-100 text-orange-600" : "bg-gray-200 text-gray-500"}`}
      >
        {count}
      </span>
    </button>
  );
}

// ─── Job card ────────────────────────────────────────────────────────────────

function JobCard({ job }: { job: JobRequest }) {
  const cat = job.service_categories;

  return (
    <article className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6
                        hover:shadow-md hover:border-orange-200 transition-all duration-200">
      {/* ── Top row: category badge + time ───────────────────────────────── */}
      <div className="flex items-center justify-between gap-3 mb-4">
        {cat ? (
          <span className="inline-flex items-center gap-1.5 bg-orange-50 text-orange-700
                           text-xs font-semibold px-3 py-1 rounded-full border border-orange-100">
            {cat.icon && <span>{cat.icon}</span>}
            {cat.name}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-500
                           text-xs font-semibold px-3 py-1 rounded-full">
            🔧 General / Other
          </span>
        )}

        <span className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0">
          🕐 {timeAgo(job.created_at)}
        </span>
      </div>

      {/* ── Title ────────────────────────────────────────────────────────── */}
      {job.title && (
        <h3 className="font-bold text-gray-900 text-base mb-2 leading-snug">
          {job.title}
        </h3>
      )}

      {/* ── Description ──────────────────────────────────────────────────── */}
      <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 mb-4">
        {job.description}
      </p>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <div className="pt-4 border-t border-gray-100 space-y-3">

        {/* Location + status */}
        <div className="flex items-center justify-between gap-3">
          <span className="flex items-center gap-1.5 text-xs text-gray-500">
            <svg
              className="w-3.5 h-3.5 flex-shrink-0 text-gray-400"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M8 1.5A4.5 4.5 0 0 1 12.5 6c0 3.5-4.5 8.5-4.5 8.5S3.5 9.5 3.5 6A4.5 4.5 0 0 1 8 1.5Z" />
              <circle cx="8" cy="6" r="1.5" />
            </svg>
            {job.location}
          </span>

          <span className="inline-flex items-center gap-1 text-xs font-semibold
                           text-green-700 bg-green-50 px-2.5 py-0.5 rounded-full border border-green-100">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            Open
          </span>
        </div>

        {/* Customer contact */}
        {job.customerPhone ? (
          <div className="flex items-center gap-3">
            {/* Phone number display */}
            <div className="flex items-center gap-2 text-gray-500 min-w-0">
              <PhoneIcon className="text-gray-400 flex-shrink-0" />
              <span className="text-sm tabular-nums tracking-wide truncate">
                {job.customerPhone}
              </span>
            </div>

            {/* Call button */}
            <a
              href={`tel:${job.customerPhone}`}
              aria-label={`Call customer at ${job.customerPhone}`}
              className="ml-auto flex-shrink-0 inline-flex items-center gap-1.5
                         px-4 py-2 rounded-xl text-sm font-semibold text-white
                         bg-green-500 hover:bg-green-600 active:bg-green-700
                         transition-colors shadow-sm"
            >
              <PhoneIcon className="text-white" />
              Call Customer
            </a>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-gray-400">
            <PhoneIcon className="text-gray-300 flex-shrink-0" />
            <span className="text-xs italic">Customer phone not available</span>
          </div>
        )}
      </div>
    </article>
  );
}

// ─── Phone icon ──────────────────────────────────────────────────────────────

function PhoneIcon({ className = "text-green-500" }: { className?: string }) {
  return (
    <svg
      className={`w-4 h-4 ${className}`}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2 2.5C2 2.5 3 1 4.5 1c.5 0 1 .5 1.5 1.5l1 2c.3.7.1 1.3-.3 1.8L5.5 7.5C6.3 9 7 9.7 8.5 10.5l1.2-1.2c.5-.4 1.1-.6 1.8-.3l2 1c1 .5 1.5 1 1.5 1.5 0 1.5-1.5 2.5-1.5 2.5C5 16 0 11 0 4.5 0 4.5 .5 3 2 2.5Z" />
    </svg>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState({
  filter,
  hasSkills,
}: {
  filter: Filter;
  hasSkills: boolean;
}) {
  if (filter === "matching" && !hasSkills) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="text-5xl mb-3">🛠️</div>
        <p className="font-semibold text-gray-700 mb-1">No skills on your profile</p>
        <p className="text-sm text-gray-400 max-w-xs mx-auto mb-5">
          Add your trade categories to see requests that match what you do.
        </p>
        <Link
          href="/dashboard/skills"
          className="inline-block px-5 py-2 bg-orange-500 text-white text-sm font-semibold
                     rounded-xl hover:bg-orange-600 transition-colors shadow-sm"
        >
          Manage Skills
        </Link>
      </div>
    );
  }

  if (filter === "matching") {
    return (
      <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="text-5xl mb-3">🎉</div>
        <p className="font-semibold text-gray-700 mb-1">
          No open requests in your skill categories
        </p>
        <p className="text-sm text-gray-400 max-w-xs mx-auto">
          Check back soon, or browse all open jobs.
        </p>
      </div>
    );
  }

  return (
    <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
      <div className="text-5xl mb-3">📋</div>
      <p className="font-semibold text-gray-700 mb-1">No open requests yet</p>
      <p className="text-sm text-gray-400 max-w-xs mx-auto">
        New customer requests will appear here automatically.
      </p>
    </div>
  );
}
