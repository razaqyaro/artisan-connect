"use client";

import { useActionState } from "react";
import { saveSkills } from "./actions";
import type { ServiceCategory } from "@/lib/supabase/types";

interface SkillsFormProps {
  categories: ServiceCategory[];
  selectedIds: number[];
}

const initialState = { error: null, success: false };

export default function SkillsForm({ categories, selectedIds }: SkillsFormProps) {
  const [state, formAction, pending] = useActionState(saveSkills, initialState);

  return (
    <form action={formAction}>
      {/* Category grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
        {categories.map((cat) => (
          <label
            key={cat.id}
            className="relative flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer
                       border-gray-200 bg-white transition-all
                       hover:border-orange-200
                       has-[:checked]:border-orange-400 has-[:checked]:bg-orange-50"
          >
            {/*
              The hidden input is the actual form value.
              It must come first in the DOM so peer-checked: siblings work.
            */}
            <input
              type="checkbox"
              name="category_ids"
              value={cat.id}
              defaultChecked={selectedIds.includes(cat.id)}
              className="peer sr-only"
            />

            {/*
              Custom visual checkbox: white bg + gray border by default.
              peer-checked: turns it orange with a white checkmark.
              The SVG is always white; invisible against white bg, visible against orange.
            */}
            <div
              className="mt-0.5 w-5 h-5 flex-shrink-0 rounded-md border-2 flex items-center justify-center
                         border-gray-300 bg-white transition-colors
                         peer-checked:border-orange-500 peer-checked:bg-orange-500"
            >
              <svg
                className="w-3 h-3 text-white"
                viewBox="0 0 12 12"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M2 6l3 3 5-5" />
              </svg>
            </div>

            {/* Category info */}
            <div className="flex-1 min-w-0 select-none">
              <div className="flex items-center gap-2">
                {cat.icon && (
                  <span className="text-xl leading-none">{cat.icon}</span>
                )}
                <span className="font-semibold text-gray-900 text-sm">
                  {cat.name}
                </span>
              </div>
              {cat.description && (
                <p className="text-xs text-gray-500 mt-1 leading-snug">
                  {cat.description}
                </p>
              )}
            </div>
          </label>
        ))}
      </div>

      {/* Error banner */}
      {state.error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
          {state.error}
        </div>
      )}

      {/* Submit / cancel */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          className="w-full sm:w-auto px-8 py-3 bg-orange-500 text-white font-semibold rounded-xl
                     hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed
                     transition-colors shadow-sm"
        >
          {pending ? "Saving…" : "Save Skills"}
        </button>
        <a
          href="/dashboard"
          className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          Cancel — back to dashboard
        </a>
      </div>
    </form>
  );
}
