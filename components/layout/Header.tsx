"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import MenuLocationModal from "@/components/menu/MenuLocationModal";
import { MENU_LOCATION_STORAGE_KEY } from "@/components/menu/menuLocation";
import MenuLocationTrigger from "@/components/menu/MenuLocationTrigger";
import {
  publicApi,
  useGetCurrentCustomerQuery,
  useGetWebsiteNavigationQuery,
  useLogoutCustomerMutation,
} from "@/redux/api/publicApi";
import type { AppDispatch } from "@/redux/store";

const CUSTOMER_SESSION_COOKIE_NAME = "proteinbar_customer_session";
const MEAL_PREP_URL = "https://proteinbargroup.com/mealprep";

type WebsiteNavigationItem = {
  id: string;
  slug: string;
  title: string;
  navLabel: string;
  kind: string;
  href?: string;
  url?: string;
  link?: string;
  navUrl?: string;
  externalUrl?: string;
  targetUrl?: string;
};

function clearCustomerSessionCookie() {
  if (typeof document === "undefined") return;

  document.cookie = `${CUSTOMER_SESSION_COOKIE_NAME}=; Path=/; Max-Age=0; SameSite=Lax`;
  document.cookie = `${CUSTOMER_SESSION_COOKIE_NAME}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
}

function BrandLogo() {
  return (
    <div className="leading-none text-white">
      <p className="text-[1.2rem] uppercase tracking-[0.16em] sm:text-[1.45rem]">
        <span className="font-semibold">PROTEIN</span>
        <span className="ml-[0.08em] font-light tracking-[0.12em]">BAR</span>
      </p>
      {/* <p className="mt-1.5 text-[0.4rem] font-medium uppercase tracking-[0.28em] text-white/92 sm:text-[0.5rem]">
        THE REAL FOOD REVOLUTION
      </p> */}
    </div>
  );
}

const navHrefBySlug: Record<string, string> = {
  home: "/",
  locations: "/locations",
  menu: "/menu",
  "about-us": "/about-us",
  contact: "/contact",
  "meal-prep": MEAL_PREP_URL,
  "terms-and-conditions": "/pages/terms-and-conditions",
  "privacy-policy": "/pages/privacy-policy",
};

const allowedHeaderNavSlugs = new Set([
  "home",
  "locations",
  "menu",
  "about-us",
  "contact",
]);

function getConfiguredNavHref(item: WebsiteNavigationItem) {
  return (
    item.href?.trim() ||
    item.navUrl?.trim() ||
    item.targetUrl?.trim() ||
    item.externalUrl?.trim() ||
    item.url?.trim() ||
    item.link?.trim() ||
    navHrefBySlug[item.slug] ||
    ""
  );
}

function isExternalHref(href: string) {
  return /^(https?:|mailto:|tel:)/i.test(href);
}

function getPathOnly(href: string) {
  if (isExternalHref(href)) return "";
  return href.split(/[?#]/)[0] || "/";
}

function isNavActive(pathname: string, href: string) {
  const linkPath = getPathOnly(href);
  if (!linkPath) return false;
  if (linkPath === "/") return pathname === "/";
  return pathname === linkPath || pathname.startsWith(`${linkPath}/`);
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileLocationModalOpen, setMobileLocationModalOpen] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLocallyLoggedOut, setIsLocallyLoggedOut] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { data } = useGetWebsiteNavigationQuery();
  const { data: currentCustomer } = useGetCurrentCustomerQuery(undefined, {
    skip: isLocallyLoggedOut,
  });
  const [logoutCustomer, { isLoading: isLoggingOut }] =
    useLogoutCustomerMutation();
  const pathname = usePathname();
  const router = useRouter();
  const isMenuActive = pathname === "/menu" || pathname === "/pages/menu";
  const lastScrollYRef = useRef(0);
  const isHeaderVisibleRef = useRef(true);
  const isScrolledRef = useRef(false);
  const menuOpenRef = useRef(false);
  const navLinks = useMemo(() => {
    if (!data?.data) return [];

    return data.data
      .map((item) => {
        if (!allowedHeaderNavSlugs.has(item.slug)) {
          return null;
        }

        const href = getConfiguredNavHref(item);
        if (!href) {
          return null;
        }

        return {
          href,
          label: item.navLabel || item.title,
          slug: item.slug,
        };
      })
      .filter((item): item is { href: string; label: string; slug: string } =>
        Boolean(item),
      );
  }, [data]);
  const leadingNavLinks = navLinks
    .filter((item) => item.slug !== "menu")
    .slice(0, 2);
  const trailingNavLinks = navLinks
    .filter((item) => item.slug !== "menu")
    .slice(2);
  const menuNavItem = navLinks.find((item) => item.slug === "menu");
  const customerEmail = isLocallyLoggedOut
    ? ""
    : (currentCustomer?.data?.user?.email?.trim() ?? "");
  const isCustomerLoggedIn = Boolean(customerEmail);

  const handleLogout = async () => {
    setIsLocallyLoggedOut(true);
    setMenuOpen(false);
    clearCustomerSessionCookie();

    try {
      await logoutCustomer().unwrap();
    } finally {
      clearCustomerSessionCookie();
      dispatch(publicApi.util.resetApiState());
      router.replace("/");
      router.refresh();
    }
  };

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

  const handleMobileMenuOpen = () => {
    setMenuOpen(false);
    setMobileLocationModalOpen(true);
  };

  const handleMobileLocationSelect = (locationName: string) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(MENU_LOCATION_STORAGE_KEY, locationName);
    }

    setMobileLocationModalOpen(false);

    const targetUrl = `/menu?location=${encodeURIComponent(locationName)}`;

    if (isMenuActive) {
      router.replace(targetUrl, { scroll: false });
      return;
    }

    router.push(targetUrl);
  };

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
                const isActive = isNavActive(pathname, item.href);
                const external = isExternalHref(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
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
                const isActive = isNavActive(pathname, item.href);
                const external = isExternalHref(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
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
            {isCustomerLoggedIn ? (
              <button
                type="button"
                className="hidden max-w-[220px] truncate text-[0.98rem] font-normal !text-white transition-colors hover:!text-white sm:inline-flex"
                style={{ color: "#ffffff" }}
                title={customerEmail}
              >
                {customerEmail}
              </button>
            ) : (
              <Link
                href="/login"
                className="hidden text-[0.98rem] font-normal !text-white transition-colors hover:!text-white sm:inline-flex"
                style={{ color: "#ffffff" }}
              >
                Log in
              </Link>
            )}
            {isCustomerLoggedIn ? (
              <>
                {/* <button
                  type="button"
                  onClick={() => void handleLogout()}
                  disabled={isLoggingOut}
                  className="hidden h-[46px] min-w-[110px] items-center justify-center rounded-full border border-white/35 bg-white/[0.06] px-5 text-[0.92rem] !text-white transition hover:bg-white/10 disabled:opacity-60 sm:inline-flex"
                  style={{ color: "#ffffff", border: "1px solid red" }}
                >
                  {isLoggingOut ? "Logging out..." : "Log out"}
                </button> */}
              </>
            ) : null}
            <Link
              href={"/mealprep"}
              // target="_blank"
              rel="noopener noreferrer"
              className="hidden h-[46px] min-w-[146px] items-center justify-center border border-white/35 bg-white/[0.06] px-6 text-[0.98rem] font-normal !text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)] backdrop-blur-[1.5px] transition hover:bg-white/[0.1] sm:inline-flex"
              style={{ color: "#ffffff" }}
            >
              Meal Prep
            </Link>
          </div>
        </div>
      </div>

      {menuOpen && (
        <nav className="animate-fade-down mx-auto mt-3 max-w-[1500px] border border-white/12 bg-black/88 px-4 py-4 text-white shadow-[0_24px_80px_rgba(0,0,0,0.28)] lg:hidden">
          <div className="flex w-full flex-col gap-2">
            {leadingNavLinks.map((item) => {
              const isActive = isNavActive(pathname, item.href);
              const external = isExternalHref(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
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
              <button
                type="button"
                onClick={handleMobileMenuOpen}
                className={`rounded-lg px-3 py-2.5 text-left text-sm transition-colors hover:bg-white/10 ${
                  isMenuActive ? "bg-white/10 text-white" : "text-white/90"
                }`}
              >
                {menuNavItem.label}
              </button>
            ) : null}
            {trailingNavLinks.map((item) => {
              const isActive = isNavActive(pathname, item.href);
              const external = isExternalHref(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
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
              {isCustomerLoggedIn ? (
                <button
                  type="button"
                  className="inline-flex h-11 items-center justify-center rounded-lg border border-white/15 px-3 text-sm font-medium !text-white transition hover:bg-white/10"
                  style={{ color: "#ffffff" }}
                  title={customerEmail}
                >
                  <span className="truncate">{customerEmail}</span>
                </button>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="inline-flex h-11 items-center justify-center rounded-lg border border-white/15 text-sm font-medium !text-white transition hover:bg-white/10"
                  style={{ color: "#ffffff" }}
                >
                  Log in
                </Link>
              )}
              {isCustomerLoggedIn ? (
                <>
                  {/* <button
                    type="button"
                    onClick={() => void handleLogout()}
                    disabled={isLoggingOut}
                    className="inline-flex h-11 items-center justify-center rounded-lg border border-white text-sm font-medium !text-white transition hover:bg-white/10 disabled:opacity-60"
                    style={{ color: "#ffffff", border: "1px solid red" }}
                  >
                    {isLoggingOut ? "Logging out..." : "Log out"}
                  </button> */}
                </>
              ) : null}
              <Link
                href={MEAL_PREP_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMenuOpen(false)}
                className="inline-flex h-11 items-center justify-center rounded-lg border border-white text-sm font-medium !text-white transition hover:bg-white/10"
                style={{ color: "#ffffff" }}
              >
                Meal Prep
              </Link>
            </div>
          </div>
        </nav>
      )}

      <MenuLocationModal
        open={mobileLocationModalOpen}
        onClose={() => setMobileLocationModalOpen(false)}
        onSelect={handleMobileLocationSelect}
      />
    </header>
  );
}
