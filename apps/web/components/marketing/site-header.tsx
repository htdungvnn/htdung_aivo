"use client";

import { useState, useEffect } from "react";
import { navigationItems } from "@/lib/marketing-content";

export function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [locale, setLocale] = useState<"vi-VN" | "en">("vi-VN");
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  useEffect(() => {
    // Load theme from localStorage or system preference
    const savedTheme = localStorage.getItem("aivo_theme_preference");
    if (savedTheme === "dark") {
      setTheme("dark");
    } else if (savedTheme === "light") {
      setTheme("light");
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setTheme(prefersDark ? "dark" : "light");
    }

    // Load locale
    const savedLocale = localStorage.getItem("aivo_locale");
    if (savedLocale === "en") setLocale("en");
    else setLocale("vi-VN");
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".theme-menu-btn") && !target.closest(".theme-menu")) {
        setShowThemeMenu(false);
      }
      if (!target.closest(".lang-menu-btn") && !target.closest(".lang-menu")) {
        setShowLangMenu(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const toggleTheme = (newTheme: "light" | "dark" | "system") => {
    if (newTheme === "system") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setTheme(prefersDark ? "dark" : "light");
      localStorage.setItem("aivo_theme_preference", "system");
      document.documentElement.setAttribute("data-theme", prefersDark ? "dark" : "light");
    } else {
      setTheme(newTheme);
      localStorage.setItem("aivo_theme_preference", newTheme);
      document.documentElement.setAttribute("data-theme", newTheme);
    }
    setShowThemeMenu(false);
  };

  const toggleLocale = (newLocale: "vi-VN" | "en") => {
    setLocale(newLocale);
    localStorage.setItem("aivo_locale", newLocale);
    setShowLangMenu(false);
  };

  // Handle body scroll lock
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isMobileMenuOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-[var(--surface)]/95 backdrop-blur-md shadow-sm"
            : "bg-transparent"
        }`}
      >
        <nav className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between lg:h-20">
            {/* Logo */}
            <a
              href="/"
              className="flex items-center gap-2 text-xl font-bold text-[#087A55]"
              aria-label="AIVO Home"
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <rect width="32" height="32" rx="8" fill="currentColor" />
                <path
                  d="M8 16C8 11.5817 11.5817 8 16 8V8C20.4183 8 24 11.5817 24 16V24H16C11.5817 24 8 20.4183 8 16V16Z"
                  fill="white"
                />
                <circle cx="16" cy="16" r="4" fill="currentColor" />
              </svg>
              AIVO
            </a>

            {/* Desktop Navigation */}
            <div className="hidden items-center gap-8 lg:flex">
              {navigationItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium text-[var(--foreground-muted)] transition-colors hover:text-[var(--foreground)]"
                >
                  {item.label}
                </a>
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="hidden items-center gap-3 lg:flex">
              {/* Theme Toggle */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setShowThemeMenu(!showThemeMenu);
                    setShowLangMenu(false);
                  }}
                  className="theme-menu-btn flex h-9 w-9 items-center justify-center rounded-lg text-[var(--foreground-muted)] transition-colors hover:bg-[var(--surface-subtle)] hover:text-[var(--foreground)]"
                  aria-label="Toggle theme"
                >
                  {theme === "dark" ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="5" />
                      <line x1="12" y1="1" x2="12" y2="3" />
                      <line x1="12" y1="21" x2="12" y2="23" />
                      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                      <line x1="1" y1="12" x2="3" y2="12" />
                      <line x1="21" y1="12" x2="23" y2="12" />
                      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                    </svg>
                  )}
                </button>
                {showThemeMenu && (
                  <div className="theme-menu absolute right-0 top-full z-50 mt-2 w-40 rounded-lg border border-[var(--border)] bg-[var(--surface)] py-1 shadow-lg">
                    <button
                      onClick={() => toggleTheme("light")}
                      className={`flex w-full items-center gap-2 px-4 py-2 text-sm transition-colors hover:bg-[var(--surface-subtle)] ${
                        theme === "light" ? "text-[var(--primary)] font-medium" : "text-[var(--foreground)]"
                      }`}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="5" />
                        <line x1="12" y1="1" x2="12" y2="3" />
                        <line x1="12" y1="21" x2="12" y2="23" />
                      </svg>
                      Sáng
                    </button>
                    <button
                      onClick={() => toggleTheme("dark")}
                      className={`flex w-full items-center gap-2 px-4 py-2 text-sm transition-colors hover:bg-[var(--surface-subtle)] ${
                        theme === "dark" ? "text-[var(--primary)] font-medium" : "text-[var(--foreground)]"
                      }`}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                      </svg>
                      Tối
                    </button>
                    <button
                      onClick={() => toggleTheme("system")}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-[var(--foreground)] transition-colors hover:bg-[var(--surface-subtle)]"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                        <line x1="8" y1="21" x2="16" y2="21" />
                        <line x1="12" y1="17" x2="12" y2="21" />
                      </svg>
                      Hệ thống
                    </button>
                  </div>
                )}
              </div>

              {/* Language Toggle */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setShowLangMenu(!showLangMenu);
                    setShowThemeMenu(false);
                  }}
                  className="lang-menu-btn flex h-9 items-center gap-1 rounded-lg px-3 text-sm font-medium text-[var(--foreground-muted)] transition-colors hover:bg-[var(--surface-subtle)] hover:text-[var(--foreground)]"
                  aria-label="Toggle language"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                  {locale === "vi-VN" ? "VI" : "EN"}
                </button>
                {showLangMenu && (
                  <div className="lang-menu absolute right-0 top-full z-50 mt-2 w-36 rounded-lg border border-[var(--border)] bg-[var(--surface)] py-1 shadow-lg">
                    <button
                      onClick={() => toggleLocale("vi-VN")}
                      className={`flex w-full items-center gap-2 px-4 py-2 text-sm transition-colors hover:bg-[var(--surface-subtle)] ${
                        locale === "vi-VN" ? "text-[var(--primary)] font-medium" : "text-[var(--foreground)]"
                      }`}
                    >
                      Tiếng Việt
                    </button>
                    <button
                      onClick={() => toggleLocale("en")}
                      className={`flex w-full items-center gap-2 px-4 py-2 text-sm transition-colors hover:bg-[var(--surface-subtle)] ${
                        locale === "en" ? "text-[var(--primary)] font-medium" : "text-[var(--foreground)]"
                      }`}
                    >
                      English
                    </button>
                  </div>
                )}
              </div>

              <a
                href="/login"
                className="px-4 py-2 text-sm font-medium text-[var(--foreground)] transition-colors hover:text-[var(--primary)]"
              >
                Log in
              </a>
              <a
                href="/signup"
                className="rounded-full bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--primary-hover)]"
              >
                Start Your Journey
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              type="button"
              className="rounded-lg p-2 text-[var(--foreground)] lg:hidden"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label="Open menu"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Menu Drawer */}
      <div
        id="mobile-menu"
        className={`fixed bottom-0 right-0 top-0 z-50 w-80 max-w-[85vw] bg-[var(--surface)] shadow-xl transition-transform duration-300 lg:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <div className="flex h-full flex-col p-6">
          {/* Close Button */}
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-[var(--primary)]">Menu</span>
            <button
              type="button"
              className="rounded-lg p-2 text-[var(--foreground)] hover:bg-[var(--surface-subtle)]"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="mt-8 flex flex-col gap-1">
            {navigationItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-lg px-4 py-3 text-base font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--primary-subtle)] hover:text-[var(--primary)]"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Mobile CTA */}
          <div className="mt-4 flex flex-col gap-3">
            {/* Theme Toggle */}
            <div className="flex items-center justify-between rounded-lg border border-[var(--border)] px-4 py-3">
              <div className="flex items-center gap-2 text-sm font-medium text-[var(--foreground)]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  {theme === "dark" ? (
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  ) : (
                    <>
                      <circle cx="12" cy="12" r="5" />
                      <line x1="12" y1="1" x2="12" y2="3" />
                      <line x1="12" y1="21" x2="12" y2="23" />
                    </>
                  )}
                </svg>
                Giao diện
              </div>
              <div className="flex gap-1">
                {["light", "dark"].map((t) => (
                  <button
                    key={t}
                    onClick={() => toggleTheme(t as "light" | "dark")}
                    className={`rounded px-3 py-1 text-xs font-medium transition-colors ${
                      theme === t ? "bg-[var(--primary)] text-white" : "bg-[var(--surface-subtle)] text-[var(--foreground-muted)]"
                    }`}
                  >
                    {t === "light" ? "Sáng" : "Tối"}
                  </button>
                ))}
              </div>
            </div>

            {/* Language Toggle */}
            <div className="flex items-center justify-between rounded-lg border border-[var(--border)] px-4 py-3">
              <div className="flex items-center gap-2 text-sm font-medium text-[var(--foreground)]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
                Ngôn ngữ
              </div>
              <div className="flex gap-1">
                {(["vi-VN", "en"] as const).map((l) => (
                  <button
                    key={l}
                    onClick={() => toggleLocale(l)}
                    className={`rounded px-3 py-1 text-xs font-medium transition-colors ${
                      locale === l ? "bg-[var(--primary)] text-white" : "bg-[var(--surface-subtle)] text-[var(--foreground-muted)]"
                    }`}
                  >
                    {l === "vi-VN" ? "VI" : "EN"}
                  </button>
                ))}
              </div>
            </div>

            <a
              href="/login"
              className="w-full rounded-lg border border-[var(--border)] px-4 py-3 text-center text-base font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--surface-subtle)]"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Log in
            </a>
            <a
              href="/signup"
              className="w-full rounded-lg bg-[var(--primary)] px-4 py-3 text-center text-base font-semibold text-white transition-colors hover:bg-[var(--primary-hover)]"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Start Your Journey
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
