"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/about-us", label: "About Us" },
  { href: "/our-system", label: "Our System" },
  { href: "/latest", label: "Latest" },
  { href: "/investors-portal", label: "Investors Portal" },
];

type SiteShellProps = {
  children: React.ReactNode;
};

export default function SiteShell({ children }: SiteShellProps) {
  const [isHidden, setIsHidden] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    const threshold = 120;

    const onScroll = () => {
      if (isMobileMenuOpen) {
        setIsHidden(false);
        return;
      }

      const currentY = window.scrollY;
      const delta = currentY - lastY;

      if (currentY <= threshold) {
        setIsHidden(false);
      } else if (delta > 4) {
        setIsHidden(true);
      } else if (delta < -4) {
        setIsHidden(false);
      }

      lastY = currentY;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isMobileMenuOpen]);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  return (
    <div className="min-h-screen">
      <header
        className={`fixed inset-x-0 top-0 z-30 bg-transparent transition-transform duration-300 ${
          isHidden && !isMobileMenuOpen ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        <div className="top-nav-shell w-full">
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-6 px-6 py-3 md:px-8">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/sinag-logo.svg"
                alt="Sinag Global"
                width={170}
                height={42}
                className="h-auto w-[140px] md:w-[170px]"
                priority
              />
            </Link>
            <nav className="hidden items-center gap-7 text-[1.04rem] font-semibold lg:flex">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} className="desktop-nav-link top-nav-link">
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
              className={`inline-flex h-11 w-11 items-center justify-center rounded-full border transition lg:hidden ${
                isMobileMenuOpen
                  ? "border-[var(--line)] bg-white text-[var(--brand-dark)]"
                  : "border-[var(--line)] bg-white text-[var(--brand-dark)]"
              }`}
            >
              {isMobileMenuOpen ? (
                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6">
                  <path
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    d="M6 6l12 12M18 6L6 18"
                  />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6">
                  <path
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    d="M4 7h16M4 12h16M4 17h16"
                  />
                </svg>
              )}
            </button>
            <button
              type="button"
              aria-label="Search"
              className="hidden h-10 w-10 items-center justify-center rounded-full border border-white/45 text-white transition hover:border-white hover:bg-white/12 lg:inline-flex"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  d="M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16Zm10 2-4.3-4.3"
                />
              </svg>
            </button>
          </div>
        </div>
        <div
          className={`overflow-hidden bg-white/98 backdrop-blur transition-[max-height,opacity] duration-300 lg:hidden ${
            isMobileMenuOpen ? "max-h-[24rem] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <nav className="mx-auto flex w-full max-w-7xl flex-col px-6 py-3 text-base font-semibold text-[var(--brand-dark)]">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="border-b border-[var(--line)] py-3 text-[var(--brand-dark)] last:border-b-0 hover:text-[var(--brand)]"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main>{children}</main>

      <footer className="mt-20 border-t border-[var(--line)] bg-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10 text-sm text-slate-600 md:flex-row md:justify-between">
          <div className="space-y-3">
            <p className="text-base font-semibold text-[var(--brand-dark)]">SINAG GLOBAL</p>
            <p className="max-w-md">
              A company committed to sustaining life by replacing coal, nuclear and oil-powered generation
              technologies.
            </p>
          </div>
          <div className="space-y-2">
            <p>Address: 5F Chemphil Bldg. 851 Arnaiz Ave. Legaspi Village, Makati City 1223 Metro Manila</p>
            <p>Phone: +63 917 881 0555 / +63 920 901 2450</p>
            <p>Email: info@sinagglobal.com</p>
            <p>Mon-Fri | 8am to 5pm</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
