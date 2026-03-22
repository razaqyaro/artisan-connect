"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { ServiceCategory } from "@/lib/supabase/types";

interface CategoryWithCount extends ServiceCategory {
  providerCount: number;
}

interface CategoryGridProps {
  categories: CategoryWithCount[];
}

export default function CategoryGrid({ categories }: CategoryGridProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.description ?? "").toLowerCase().includes(q)
    );
  }, [query, categories]);

  return (
    <section>
      {/* Search bar */}
      <div className="relative mb-8 max-w-lg mx-auto">
        <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center">
          <svg
            className="w-5 h-5 text-gray-400"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="9" cy="9" r="6" />
            <path d="M14 14l3.5 3.5" />
          </svg>
        </div>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search categories — plumber, electrician…"
          className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 bg-white text-gray-900
                     placeholder-gray-400 shadow-sm
                     focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent
                     transition"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-gray-600"
            aria-label="Clear search"
          >
            <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
              <path d="M4.293 4.293a1 1 0 011.414 0L8 6.586l2.293-2.293a1 1 0 111.414 1.414L9.414 8l2.293 2.293a1 1 0 01-1.414 1.414L8 9.414l-2.293 2.293a1 1 0 01-1.414-1.414L6.586 8 4.293 5.707a1 1 0 010-1.414z" />
            </svg>
          </button>
        )}
      </div>

      {/* Result count when searching */}
      {query && (
        <p className="text-sm text-gray-500 text-center mb-6">
          {filtered.length === 0
            ? "No categories match your search."
            : `${filtered.length} categor${filtered.length !== 1 ? "ies" : "y"} found`}
        </p>
      )}

      {/* Cards grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((cat) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.id}`}
              className="group bg-white rounded-2xl border border-gray-100 shadow-sm p-6
                         hover:shadow-md hover:border-orange-200 hover:-translate-y-0.5
                         transition-all duration-200 flex flex-col gap-3"
            >
              {/* Icon */}
              <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center text-3xl
                              group-hover:bg-orange-100 transition-colors">
                {cat.icon ?? "🔧"}
              </div>

              {/* Name + description */}
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 text-base group-hover:text-orange-600 transition-colors">
                  {cat.name}
                </h3>
                {cat.description && (
                  <p className="text-sm text-gray-500 mt-1 leading-snug line-clamp-2">
                    {cat.description}
                  </p>
                )}
              </div>

              {/* Provider count badge */}
              <div className="flex items-center justify-between mt-1">
                <span
                  className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
                    cat.providerCount > 0
                      ? "bg-green-50 text-green-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      cat.providerCount > 0 ? "bg-green-500" : "bg-gray-400"
                    }`}
                  />
                  {cat.providerCount > 0
                    ? `${cat.providerCount} provider${cat.providerCount !== 1 ? "s" : ""}`
                    : "No providers yet"}
                </span>
                <span className="text-orange-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  View →
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-gray-400">
          <div className="text-5xl mb-3">🔍</div>
          <p className="font-medium text-gray-600">No results for &ldquo;{query}&rdquo;</p>
          <p className="text-sm mt-1">Try a different trade name</p>
        </div>
      )}
    </section>
  );
}
