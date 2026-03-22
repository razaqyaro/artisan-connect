import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* ── Main footer grid ─────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* Column 1 — Brand */}
        <div className="lg:col-span-1">
          <Link href="/" className="inline-block mb-3">
            <span className="text-xl font-bold text-white">
              Artisan <span className="text-orange-400">Connect</span>
            </span>
          </Link>
          <p className="text-sm text-gray-400 leading-relaxed">
            Ghana&apos;s trusted marketplace for connecting customers with
            skilled local tradespeople — fast, simple, and phone-first.
          </p>
          {/* Made in Ghana badge */}
          <div className="mt-5 inline-flex items-center gap-2 bg-gray-800 text-gray-300
                          text-xs font-medium px-3 py-1.5 rounded-full">
            <span>🇬🇭</span>
            <span>Made in Ghana</span>
          </div>
        </div>

        {/* Column 2 — Quick links */}
        <div>
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
            Platform
          </h4>
          <ul className="space-y-3 text-sm">
            <li>
              <Link href="/" className="hover:text-orange-400 transition-colors">
                Browse Categories
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-orange-400 transition-colors">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/about#how-it-works" className="hover:text-orange-400 transition-colors">
                How It Works
              </Link>
            </li>
            <li>
              <Link href="/signup" className="hover:text-orange-400 transition-colors">
                Get Started
              </Link>
            </li>
            <li>
              <Link href="/login" className="hover:text-orange-400 transition-colors">
                Sign In
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3 — For users */}
        <div>
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
            For Users
          </h4>
          <ul className="space-y-3 text-sm">
            <li>
              <Link href="/signup" className="hover:text-orange-400 transition-colors">
                Post a Job Request
              </Link>
            </li>
            <li>
              <Link href="/" className="hover:text-orange-400 transition-colors">
                Find an Artisan
              </Link>
            </li>
            <li>
              <Link href="/signup" className="hover:text-orange-400 transition-colors">
                Join as a Provider
              </Link>
            </li>
            <li>
              <Link href="/about#faq" className="hover:text-orange-400 transition-colors">
                FAQ
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 4 — Contact / creator */}
        <div>
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
            Contact
          </h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <span className="mt-0.5">📧</span>
              <a
                href="mailto:razaqyaro@gmail.com"
                className="hover:text-orange-400 transition-colors break-all"
              >
                razaqyaro@gmail.com
              </a>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5">📍</span>
              <span className="text-gray-400">Accra, Ghana</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5">💼</span>
              <a
                href="https://www.linkedin.com/in/abdul-razak-hussein/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-orange-400 transition-colors"
              >
                Abdul-Razak Hussein
              </a>
            </li>
          </ul>

          {/* WhatsApp CTA */}
          <a
            href="https://wa.me/233599668783"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 bg-green-600 hover:bg-green-500
                       text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors"
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
            Chat on WhatsApp
          </a>
        </div>
      </div>

      {/* ── Bottom bar ───────────────────────────────────────────────────────── */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center
                        justify-between gap-3 text-xs text-gray-500">
          <p>© {currentYear} Artisan Connect. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/about#privacy" className="hover:text-gray-300 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/about#terms" className="hover:text-gray-300 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
