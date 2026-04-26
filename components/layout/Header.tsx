"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import MenuLocationTrigger from "@/components/menu/MenuLocationTrigger";
import { useGetWebsiteNavigationQuery } from "@/redux/api/publicApi";

const fallbackNavLinks = [
  { href: "/", label: "Home", slug: "home" },
  { href: "/pages/locations", label: "Locations", slug: "locations" },
  { href: "/pages/menu", label: "Menu", slug: "menu" },
  { href: "/pages/about-us", label: "About us", slug: "about-us" },
  { href: "/pages/contact", label: "Contact us", slug: "contact" },
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

const navHrefBySlug: Record<string, string> = {
  home: "/",
  locations: "/pages/locations",
  menu: "/pages/menu",
  "about-us": "/pages/about-us",
  contact: "/pages/contact",
  "meal-prep": "/plans",
  "terms-and-conditions": "/pages/terms-and-conditions",
  "privacy-policy": "/pages/privacy-policy",
};

const allowedHeaderNavSlugs = new Set(["home", "locations", "menu", "about-us", "contact"]);

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const { data } = useGetWebsiteNavigationQuery();
  const pathname = usePathname();
  const isMenuActive = pathname === "/pages/menu";
  const lastScrollYRef = useRef(0);
  const isHeaderVisibleRef = useRef(true);
  const isScrolledRef = useRef(false);
  const menuOpenRef = useRef(false);
  const navLinks = useMemo(() => {
    const apiLinks =
      data?.data
        ?.map((item) => {
          if (!allowedHeaderNavSlugs.has(item.slug)) {
            return null;
          }

          const href = navHrefBySlug[item.slug];
          if (!href) {
            return null;
          }

          return {
            href,
            label: item.navLabel || item.title,
            slug: item.slug,
          };
        })
        .filter((item): item is { href: string; label: string; slug: string } => Boolean(item)) ?? [];

    return apiLinks.length ? apiLinks : fallbackNavLinks;
  }, [data]);
  const leadingNavLinks = navLinks.filter((item) => item.slug !== "menu").slice(0, 2);
  const trailingNavLinks = navLinks.filter((item) => item.slug !== "menu").slice(2);
  const menuNavItem = navLinks.find((item) => item.slug === "menu");

  useEffect(() => {
    menuOpenRef.current = menuOpen;
  }, [menuOpen]);

  useEffect(() => {
    lastScrollYRef.current = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const isNearTop = currentScrollY < 24;
      const nextIsScrolled = !isNearTop;
      const isScrollingDown = currentScrollY > lastScrollYRef.current;

      if (nextIsScrolled !== isScrolledRef.current) {
        isScrolledRef.current = nextIsScrolled;
        setIsScrolled(nextIsScrolled);
      }

      if (isNearTop) {
        if (!isHeaderVisibleRef.current) {
          isHeaderVisibleRef.current = true;
          setIsHeaderVisible(true);
        }
        lastScrollYRef.current = currentScrollY;
        return;
      }

      if (isScrollingDown && currentScrollY > 96) {
        if (isHeaderVisibleRef.current) {
          isHeaderVisibleRef.current = false;
          setIsHeaderVisible(false);
        }
        if (menuOpenRef.current) {
          menuOpenRef.current = false;
          setMenuOpen(false);
        }
      } else if (!isScrollingDown && !isHeaderVisibleRef.current) {
        isHeaderVisibleRef.current = true;
        setIsHeaderVisible(true);
      }

      lastScrollYRef.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed left-0 top-0 z-50 w-full px-4 pt-5 transition-transform duration-300 ease-out sm:px-8 lg:px-12 ${
        isHeaderVisible ? "translate-y-0" : "-translate-y-[calc(100%+1.25rem)]"
      }`}
    >
      <div
        className={`mx-auto max-w-[1500px] transition-[background-color,backdrop-filter,box-shadow] duration-300 ${
          isScrolled && isHeaderVisible
            ? "bg-black/20 shadow-[0_16px_40px_rgba(0,0,0,0.18)] backdrop-blur-md"
            : "bg-transparent shadow-none backdrop-blur-0"
        }`}
      >
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
              {leadingNavLinks.map((item) => {
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
              {menuNavItem ? (
                <MenuLocationTrigger
                  className={`nav-link-hover !text-white text-[0.98rem] font-normal tracking-[0.01em] ${
                    isMenuActive ? "after:scale-x-100" : ""
                  }`}
                  variant="dropdown"
                >
                  {menuNavItem.label}
                </MenuLocationTrigger>
              ) : null}
              {trailingNavLinks.map((item) => {
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
                    ? "h-[46px] min-w-[146px] items-center justify-center border border-white/35 bg-white/[0.06] px-6 text-[0.98rem] font-normal shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)] backdrop-blur-[1.5px]"
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
            {leadingNavLinks.map((item) => {
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
            {menuNavItem ? (
              <MenuLocationTrigger
                className={`rounded-lg px-3 py-2.5 text-left text-sm transition-colors hover:bg-white/10 ${
                  isMenuActive ? "bg-white/10 text-white" : "text-white/90"
                }`}
                onAfterSelect={() => setMenuOpen(false)}
              >
                {menuNavItem.label}
              </MenuLocationTrigger>
            ) : null}
            {trailingNavLinks.map((item) => {
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

