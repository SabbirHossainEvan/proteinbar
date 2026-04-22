"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/plans", label: "Monthly Plan" },
  { href: "/pages/nos-restaurants", label: "Locations" },
  { href: "/pages/menu#menu-details", label: "Menu" },
  { href: "/pages/about-us", label: "About" },
  { href: "/pages/contact", label: "Contact" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="fixed left-0 top-0 z-50 w-full px-4 pt-6 sm:px-8 lg:px-14">
      <div className="mx-auto max-w-[1500px] border-b border-white/8 bg-black/18 backdrop-blur-[2px]">
        <div className="flex min-h-[86px] items-center justify-between gap-6 px-4 sm:px-6 lg:px-10">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              className="text-white transition-colors hover:text-white/80 lg:hidden"
              aria-label="Toggle menu"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-7 w-7"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </button>
            <Link
              href="/"
              className="shrink-0 text-white"
              onClick={() => setMenuOpen(false)}
            >
              <div className="leading-none">
                <p className="text-[1.2rem] font-semibold tracking-[0.12em] text-white sm:text-[1.45rem]">
                  PROTEINBAR
                </p>
                <p className="mt-1 text-[0.48rem] uppercase tracking-[0.22em] text-white sm:text-[0.58rem]">
                  The Real Food Revolution
                </p>
              </div>
            </Link>
          </div>

          <nav className="hidden flex-1 items-center justify-center lg:flex">
            <div className="flex items-center gap-8 xl:gap-12">
              {navLinks.map((item) => {
                const linkPath = item.href.split("#")[0];
                const isActive = pathname === linkPath;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`nav-link-hover !text-white text-[0.98rem] font-normal tracking-[0.01em] ${
                      isActive ? "after:scale-x-100" : ""
                    }`}
                    style={{ color: "#ffffff" }}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </nav>

          <div className="flex items-center justify-end gap-2 sm:gap-3">
            <Link
              href="/login"
              className="hidden !text-white text-[0.98rem] font-normal transition-colors hover:!text-white sm:inline-flex"
              style={{ color: "#ffffff" }}
            >
              Log in
            </Link>
            <Link
              href="/plans"
              className="inline-flex h-[52px] items-center justify-center rounded-none border border-white/36 px-6 text-[0.98rem] font-normal !text-white transition hover:bg-white hover:!text-black sm:px-8"
            >
              Meal Prep
            </Link>
          </div>
        </div>
      </div>

      {menuOpen && (
        <nav className="animate-fade-down mx-auto mt-3 max-w-[1500px] border border-white/12 bg-black/88 px-4 py-4 text-white shadow-[0_24px_80px_rgba(0,0,0,0.28)] lg:hidden">
          <div className="flex w-full flex-col gap-2">
            {navLinks.map((item) => {
              const linkPath = item.href.split("#")[0];
              const isActive = pathname === linkPath;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={`rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-white/10 ${
                    isActive ? "bg-white/10 text-white" : "text-white/90"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <div className="mt-2 grid grid-cols-2 gap-2 border-t border-white/10 pt-3">
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="inline-flex h-11 items-center justify-center rounded-lg border border-white/15 text-sm font-medium text-white/90 transition hover:bg-white/10"
              >
                Log in
              </Link>
              <Link
                href="/plans"
                onClick={() => setMenuOpen(false)}
                className="inline-flex h-11 items-center justify-center border border-white bg-white text-sm font-medium text-zinc-950 transition hover:bg-zinc-100"
              >
                Meal Prep
              </Link>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}

