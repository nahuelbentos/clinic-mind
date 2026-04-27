"use client";

import { useState } from "react";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("nav");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const navLinks = [
    { href: "/" as const, label: t("home") },
    { href: "/about" as const, label: t("about") },
    { href: "/servicios" as const, label: t("services") },
    { href: "/blog" as const, label: t("blog") },
    { href: "/contacto" as const, label: t("contact") },
  ];

  function switchLocale(next: "es" | "en") {
    router.replace(pathname, { locale: next });
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-warm-50/95 backdrop-blur-sm border-b border-warm-200/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-sage-600 text-xl font-semibold tracking-tight">
              Lic. Micaela Vulcano
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm text-warm-700 hover:text-sage-600 hover:bg-sage-50 rounded-lg transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contacto"
              className="ml-3 px-4 py-2 bg-sage-500 hover:bg-sage-600 text-white text-sm font-medium rounded-full transition-colors duration-200"
            >
              {t("bookSession")}
            </Link>
            {/* Language switcher */}
            <div className="ml-2 flex items-center gap-1 border border-warm-200 rounded-full px-1 py-0.5">
              <button
                onClick={() => switchLocale("es")}
                className={`px-2 py-0.5 text-xs rounded-full transition ${locale === "es" ? "bg-sage-500 text-white" : "text-warm-600 hover:text-warm-900"}`}
              >
                ES
              </button>
              <button
                onClick={() => switchLocale("en")}
                className={`px-2 py-0.5 text-xs rounded-full transition ${locale === "en" ? "bg-sage-500 text-white" : "text-warm-600 hover:text-warm-900"}`}
              >
                EN
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg text-warm-700 hover:bg-warm-100 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={t("menuLabel")}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden pb-4 border-t border-warm-200/60 pt-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-3 py-2.5 text-warm-700 hover:text-sage-600 hover:bg-sage-50 rounded-lg transition-colors text-sm"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contacto"
              className="block mt-2 mx-3 px-4 py-2.5 bg-sage-500 hover:bg-sage-600 text-white text-sm font-medium rounded-full text-center transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {t("bookSession")}
            </Link>
            <div className="flex items-center gap-2 mx-3 mt-3">
              <button
                onClick={() => switchLocale("es")}
                className={`px-3 py-1 text-xs rounded-full border transition ${locale === "es" ? "bg-sage-500 text-white border-sage-500" : "text-warm-600 border-warm-300"}`}
              >
                ES
              </button>
              <button
                onClick={() => switchLocale("en")}
                className={`px-3 py-1 text-xs rounded-full border transition ${locale === "en" ? "bg-sage-500 text-white border-sage-500" : "text-warm-600 border-warm-300"}`}
              >
                EN
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
