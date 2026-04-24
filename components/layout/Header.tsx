"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/pages/locations", label: "Locations" },
  { href: "/pages/menu", label: "Menu" },
  { href: "/pages/about-us", label: "About us" },
  { href: "/pages/contact", label: "Contact us" },
];

const actionLinks = [
  { href: "/login", label: "Log in" },
  { href: "/plans", label: "Meal Prep" },
];

function BrandLogo() {
  return (
    <div className="leading-none text-white">
      <p className="text-[1.2rem] uppercase tracking-[0.16em] sm:text-[1.45rem]">
        <span className="font-semibold">PROTEIN</span>
        <span className="ml-[0.08em] font-light tracking-[0.12em]">BAR</span>
      </p>
      <p className="mt-1.5 text-[0.4rem] font-medium uppercase tracking-[0.28em] text-white/92 sm:text-[0.5rem]">
        THE REAL FOOD REVOLUTION
      </p>
    </div>
  );
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="fixed left-0 top-0 z-50 w-full px-4 pt-5 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-[1500px] border border-white/12 bg-black/20 backdrop-blur-md">
        <div className="grid min-h-[84px] grid-cols-[auto_1fr_auto] items-center gap-6 px-4 sm:px-6 lg:px-8">
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
              <BrandLogo />
            </Link>
          </div>

          <nav className="hidden items-center justify-center lg:flex">
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

          <div className="flex items-center justify-end gap-5">
            {actionLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`hidden text-[0.98rem] font-normal transition-colors hover:text-white sm:inline-flex ${
                  item.label === "Meal Prep"
                    ? "border border-white/28 px-4 py-2.5"
                    : ""
                }`}
                style={{ color: "#ffffff" }}
              >
                {item.label}
              </Link>
            ))}
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
              {actionLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={`inline-flex h-11 items-center justify-center text-sm font-medium transition ${
                    item.label === "Meal Prep"
                      ? "border border-white text-white hover:bg-white/10"
                      : "rounded-lg border border-white/15 text-white/90 hover:bg-white/10"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}

