import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import CategoryGrid from "@/components/CategoryGrid";
import Footer from "@/components/Footer";

export default async function HomePage() {
  const supabase = await createClient();

  // Fetch all service categories
  const { data: categories } = await supabase
    .from("service_categories")
    .select("id, name, description, icon, created_at")
    .order("name", { ascending: true });

  // Fetch all provider skills to compute per-category provider counts
  const { data: skillRows } = await supabase
    .from("provider_skills")
    .select("category_id");

  // Build a count map: { [category_id]: number }
  const countMap: Record<number, number> = {};
  for (const row of skillRows ?? []) {
    countMap[row.category_id] = (countMap[row.category_id] ?? 0) + 1;
  }

  const categoriesWithCount = (categories ?? []).map((cat) => ({
    ...cat,
    providerCount: countMap[cat.id] ?? 0,
  }));

  const totalProviders = (skillRows ?? []).length > 0
    ? Object.values(countMap).reduce((a, b) => a + b, 0)
    : 0;

  return (
    <>
    <div className="min-h-screen bg-gray-50">
      {/* Top nav */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-gray-900">
            Artisan <span className="text-orange-500">Connect</span>
          </Link>
          <nav className="flex items-center gap-3">
            <Link
              href="/about"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors px-3 py-2"
            >
              About
            </Link>
            <Link
              href="/login"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors px-3 py-2"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="text-sm font-medium bg-orange-500 text-white px-4 py-2 rounded-xl hover:bg-orange-600 transition-colors shadow-sm"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-orange-500 to-amber-400 text-white py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-4">
            Find skilled artisans<br className="hidden sm:block" /> near you
          </h1>
          <p className="text-lg sm:text-xl opacity-90 mb-6 max-w-xl mx-auto">
            Browse {categoriesWithCount.length} service categories and connect
            with trusted local tradespeople.
          </p>

          {/* Quick summary pills */}
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <span className="bg-white/20 backdrop-blur-sm text-white text-sm font-medium px-4 py-1.5 rounded-full">
              🛠️ {categoriesWithCount.length} Categories
            </span>
            <span className="bg-white/20 backdrop-blur-sm text-white text-sm font-medium px-4 py-1.5 rounded-full">
              👷 {totalProviders} Provider{totalProviders !== 1 ? "s" : ""}
            </span>
            <span className="bg-white/20 backdrop-blur-sm text-white text-sm font-medium px-4 py-1.5 rounded-full">
              📍 Ghana-wide
            </span>
          </div>
        </div>
      </section>

      {/* Category browser */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Browse by Category
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Click a category to see available service providers.
            </p>
          </div>
          <Link
            href="/signup"
            className="text-sm font-medium text-orange-500 hover:text-orange-600 hover:underline transition-colors self-start sm:self-auto"
          >
            Post a job request →
          </Link>
        </div>

        <CategoryGrid categories={categoriesWithCount} />
      </section>

      {/* CTA strip above footer */}
      <section className="bg-white border-t border-gray-100 py-12 px-6 mt-4">
        <div className="max-w-xl mx-auto text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Are you a skilled artisan?
          </h3>
          <p className="text-gray-500 text-sm mb-6">
            Join Artisan Connect to get discovered by clients looking for your
            trade.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/signup"
              className="inline-block px-8 py-3 bg-orange-500 text-white font-semibold rounded-xl
                         hover:bg-orange-600 transition-colors shadow-md"
            >
              Create a provider account
            </Link>
            <Link
              href="/about"
              className="inline-block px-8 py-3 bg-white text-orange-500 font-semibold rounded-xl
                         border-2 border-orange-200 hover:border-orange-400 transition-colors"
            >
              Learn more
            </Link>
          </div>
        </div>
      </section>
    </div>

    <Footer />
    </>
  );
}
