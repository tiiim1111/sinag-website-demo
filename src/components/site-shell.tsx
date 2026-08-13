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

// TODO: replace "#" with Sinag's real profile URLs once they are confirmed.
const socials = [
  {
    name: "LinkedIn",
    href: "#",
    path: "M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.59 0 4.26 2.36 4.26 5.45v6.29ZM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13Zm1.78 13.02H3.55V9h3.57v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0Z",
  },
  {
    name: "Facebook",
    href: "#",
    path: "M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07Z",
  },
  {
    name: "X",
    href: "#",
    path: "M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.4l-5.8-7.58-6.64 7.58H.47l8.6-9.83L0 1.15h7.59l5.24 6.93 6.07-6.93Zm-1.29 19.5h2.04L6.49 3.24H4.3l13.31 17.41Z",
  },
  {
    name: "YouTube",
    href: "#",
    path: "M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.5A3.02 3.02 0 0 0 .5 6.19C0 8.08 0 12 0 12s0 3.92.5 5.81a3.02 3.02 0 0 0 2.12 2.14c1.88.5 9.38.5 9.38.5s7.5 0 9.38-.5a3.02 3.02 0 0 0 2.12-2.14C24 15.92 24 12 24 12s0-3.92-.5-5.81ZM9.55 15.57V8.43L15.82 12l-6.27 3.57Z",
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
            <div className="flex flex-col justify-between gap-12 lg:pr-12">
              <Link href="/" className="inline-flex">
                <Image
                  src="/sinag-logo.svg"
                  alt="Sinag Global"
                  width={170}
                  height={42}
                  className="h-auto w-[170px]"
                />
              </Link>
              <div>
                <p className="type-body-sm font-semibold text-white">Follow us on</p>
                <ul className="mt-4 flex items-center gap-5">
                  {socials.map((social) => (
                    <li key={social.name}>
                      <a
                        href={social.href}
                        aria-label={social.name}
                        className="block text-white/55 transition hover:text-[#8fdb3d]"
                      >
                        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[18px] w-[18px]">
                          <path fill="currentColor" d={social.path} />
                        </svg>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
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
            <p>Sustaining life by replacing coal, nuclear and oil-powered generation technologies.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
