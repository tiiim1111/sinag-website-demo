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

const footerColumns = [
  {
    title: "Company",
    links: [
      { href: "/about-us", label: "About Us" },
      { href: "/about-us#leadership", label: "Leadership" },
      { href: "/latest", label: "Latest" },
      { href: "/investors-portal", label: "Investors Portal" },
    ],
  },
  {
    title: "The Technology",
    links: [
      { href: "/our-system", label: "How the System Works" },
      { href: "/#overview", label: "What We've Built" },
      { href: "/#challenge", label: "The Energy Challenge" },
      { href: "/#why-now", label: "Why It Matters Now" },
    ],
  },
];


type SiteShellProps = {
  children: React.ReactNode;
};

export default function SiteShell({ children }: SiteShellProps) {
  const [isHidden, setIsHidden] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    const threshold = 120;
    const initialFrame = window.requestAnimationFrame(() => {
      setIsScrolled(window.scrollY > threshold);
    });

    const onScroll = () => {
      if (isMobileMenuOpen) {
        setIsHidden(false);
        return;
      }

      const currentY = window.scrollY;
      const delta = currentY - lastY;

      setIsScrolled(currentY > threshold);

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
    return () => {
      window.cancelAnimationFrame(initialFrame);
      window.removeEventListener("scroll", onScroll);
    };
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
        <div className={`top-nav-shell w-full ${isScrolled ? "is-scrolled" : ""}`}>
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-6 px-6 py-3 md:px-8">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="Gem Power Philippines Corp."
                width={2000}
                height={357}
                className="h-auto w-[180px] md:w-[215px]"
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
          <nav className="type-body-sm mx-auto flex w-full max-w-7xl flex-col px-6 py-3 font-semibold text-[var(--brand-dark)]">
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

      <footer className="bg-[#13191b] text-white">
        <div className="mx-auto w-full max-w-7xl px-6 py-16 md:px-8 md:py-20">
          <div className="grid gap-12 lg:grid-cols-[1fr_0.85fr_1fr_1.2fr] lg:gap-0">
            <div className="lg:pr-12">
              <Link href="/" className="inline-flex">
                <Image
                  src="/logo.png"
                  alt="Gem Power Philippines Corp."
                  width={2000}
                  height={357}
                  className="h-auto w-[210px] md:w-[240px]"
                />
              </Link>
              <p className="type-body-sm mt-6 max-w-xs text-white/55">
                Sustaining life by replacing coal, nuclear and oil-powered generation technologies.
              </p>
            </div>

            {footerColumns.map((column) => (
              <div key={column.title} className="lg:border-l lg:border-white/12 lg:px-8">
                <p className="type-body-sm font-semibold text-white">{column.title}</p>
                <ul className="mt-4 space-y-3">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="type-body-sm text-white/55 transition hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="lg:border-l lg:border-white/12 lg:px-8">
              <p className="type-body-sm font-semibold text-white">Contact</p>
              <ul className="type-body-sm mt-4 space-y-3 text-white/55">
                <li>
                  5F Chemphil Bldg. 851 Arnaiz Ave.
                  <br />
                  Legaspi Village, Makati City 1223
                  <br />
                  Metro Manila
                </li>
                <li>
                  <a href="tel:+639178810555" className="transition hover:text-white">
                    +63 917 881 0555
                  </a>
                  {" / "}
                  <a href="tel:+639209012450" className="transition hover:text-white">
                    +63 920 901 2450
                  </a>
                </li>
                <li>
                  <a href="mailto:info@sinagglobal.com" className="transition hover:text-white">
                    info@sinagglobal.com
                  </a>
                </li>
                <li>Mon&ndash;Fri | 8am to 5pm</li>
              </ul>
            </div>
          </div>

          <div className="type-kicker mt-14 flex flex-col gap-3 border-t border-white/12 pt-6 text-white/45 sm:flex-row sm:items-center sm:justify-between">
            <p>&copy; {new Date().getFullYear()} Sinag Global Energy Corp. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
