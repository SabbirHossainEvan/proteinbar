"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/pages/monthly-plan", label: "Monthly Plan" },
  { href: "/pages/nos-restaurants", label: "Locations" },
  { href: "/pages/menu#menu-details", label: "Menu" },
  { href: "/pages/about-us", label: "About" },
  { href: "/pages/contact", label: "Contact" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="fixed left-0 top-0 z-50 w-full px-3 pt-2 sm:px-5">
      <div className="mx-auto max-w-[1500px]  bg-black/10 backdrop-blur-sm rounded-3xl">
        <div className="flex h-14 items-center justify-between px-4 sm:px-8">
          <div className="flex w-24 items-center gap-3">
            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              className="text-white transition-colors hover:text-white/80 lg:hidden"
              aria-label="Toggle menu"
            >
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </button>
            <button
              type="button"
              aria-label="Search"
              onClick={() => setSearchOpen(true)}
              className="hidden text-white/90 transition-colors hover:text-white lg:inline-flex"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20L16.6 16.6" />
              </svg>
            </button>
          </div>

          <div className="flex flex-col items-center justify-center ">
            <Link
              href="/"
              className="text-[2rem] font-medium tracking-wide !text-white sm:text-3xl"
              style={{ color: "#ffffff" }}
            >
              PROTEINBAR
            </Link>
          </div>

          <div className="flex w-24 items-center justify-end gap-3">
            <button
              type="button"
              aria-label="Search"
              onClick={() => setSearchOpen(true)}
              className="text-white/90 transition-colors hover:text-white lg:hidden"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20L16.6 16.6" />
              </svg>
            </button>
            <Link
              href="/login"
              aria-label="Account"
              className="!text-white transition-colors hover:!text-white"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="12" cy="8" r="4" />
                <path d="M5 20c1.5-3 4.2-4.5 7-4.5s5.5 1.5 7 4.5" />
              </svg>
            </Link>
            <Link
              href="/cart"
              aria-label="Cart"
              className="!text-white transition-colors hover:!text-white"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="#ffffff" strokeWidth="1.8">
                <path d="M4 6h2l2 10h8l2-7H7.5" />
                <circle cx="10" cy="19" r="1.5" />
                <circle cx="17" cy="19" r="1.5" />
              </svg>
            </Link>
          </div>
        </div>

        <div className="hidden justify-center border-t border-white/10 px-6 py-3 lg:flex">
          <nav className="flex items-center gap-8 text-base font-medium text-white/85">
            {navLinks.map((item) => {
              const linkPath = item.href.split("#")[0];
              const isActive = pathname === linkPath;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`nav-link-hover ${isActive ? "text-white after:scale-x-100" : ""}`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

      </div>

      {menuOpen && (
        <nav className="animate-fade-down   bg-black/80 px-4 py-4 text-white lg:hidden">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-2">
            {navLinks.map((item) => {
                const linkPath = item.href.split("#")[0];
                const isActive = pathname === linkPath;
                return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={`rounded-lg px-2 py-2 text-sm transition-colors hover:bg-white/10 ${
                  isActive ? "bg-white/10 text-white" : "text-white/90"
                }`}
              >
                {item.label}
              </Link>
                );
              })}
          </div>
        </nav>
      )}

      {searchOpen && (
        <div
          className="fixed inset-0 z-[70] bg-black/45"
          onClick={() => setSearchOpen(false)}
          onKeyDown={(event) => {
            if (event.key === "Escape") setSearchOpen(false);
          }}
          role="button"
          tabIndex={0}
          aria-label="Close search"
        >
          <div className="mx-auto mt-6 w-[94%] max-w-[980px] px-2" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-full items-center rounded-2xl border-2 border-white bg-black/75 px-4">
                <input
                  autoFocus
                  type="text"
                  placeholder="Recherche"
                  className="w-full bg-transparent text-base text-white outline-none placeholder:text-white/70"
                />
                <button type="button" aria-label="Run search" className="text-white/90 hover:text-white">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <circle cx="11" cy="11" r="7" />
                    <path d="M20 20L16.6 16.6" />
                  </svg>
                </button>
              </div>
              <button
                type="button"
                aria-label="Close search"
                onClick={() => setSearchOpen(false)}
                className="text-white/90 transition-colors hover:text-white"
              >
                <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
