"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import MenuLocationModal from "@/components/menu/MenuLocationModal";
import { MENU_LOCATION_STORAGE_KEY } from "@/components/menu/menuLocation";
import { buildRestaurantOptions } from "@/components/menu/restaurantOptions";
import { useGetRestaurantsQuery } from "@/redux/api/publicApi";
import type { RestaurantInfo } from "@/types";

type MenuLocationTriggerProps = {
  children: ReactNode;
  className?: string;
  onBeforeOpen?: () => void;
  onAfterSelect?: () => void;
  variant?: "modal" | "dropdown";
};

export default function MenuLocationTrigger({
  children,
  className,
  onBeforeOpen,
  onAfterSelect,
  variant = "modal",
}: MenuLocationTriggerProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { data, isLoading } = useGetRestaurantsQuery();

  const locations = useMemo(
    () => buildRestaurantOptions((data?.data ?? []) as RestaurantInfo[]),
    [data]
  );

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  const openDropdown = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    onBeforeOpen?.();
    setOpen(true);
  };

  const closeDropdownWithDelay = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }

    closeTimeoutRef.current = setTimeout(() => {
      setOpen(false);
      closeTimeoutRef.current = null;
    }, 180);
  };

  useEffect(() => {
    if (!open || variant !== "dropdown") {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (
        containerRef.current &&
        event.target instanceof Node &&
        !containerRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, variant]);

  const handleSelect = (locationName: string) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(MENU_LOCATION_STORAGE_KEY, locationName);
    }

    setOpen(false);
    onAfterSelect?.();

    const targetUrl = `/pages/menu?location=${encodeURIComponent(locationName)}`;

    if (pathname === "/pages/menu") {
      router.replace(targetUrl, { scroll: false });
      return;
    }

    router.push(targetUrl);
  };

  if (variant === "dropdown") {
    return (
      <div
        ref={containerRef}
        className="relative"
        onMouseEnter={openDropdown}
        onMouseLeave={closeDropdownWithDelay}
      >
        <button
          type="button"
          onClick={() => {
            if (open) {
              if (closeTimeoutRef.current) {
                clearTimeout(closeTimeoutRef.current);
                closeTimeoutRef.current = null;
              }
              setOpen(false);
              return;
            }

            openDropdown();
          }}
          onFocus={openDropdown}
          className={`appearance-none border-0 p-0 ${className ?? ""}`}
          aria-haspopup="menu"
          aria-expanded={open}
        >
          {children}
        </button>

        <div
          className={`absolute left-1/2 top-full z-50 mt-5 w-[320px] -translate-x-1/2 border border-white/12 bg-[rgba(10,10,10,0.94)] p-2 text-white shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl transition-all duration-200 ${
            open
              ? "visible translate-y-0 opacity-100"
              : "invisible -translate-y-2 opacity-0 pointer-events-none"
          }`}
          onMouseEnter={openDropdown}
          onMouseLeave={closeDropdownWithDelay}
        >
          <div className="border-b border-white/8 px-3 pb-3 pt-1">
            <p className="text-[0.68rem] uppercase tracking-[0.28em] text-white/48">
              Select Location
            </p>
            <p className="mt-2 text-sm leading-6 text-white/72">
              Choose a Proteinbar branch to view its menu.
            </p>
          </div>

          <div className="mt-2 space-y-1">
            {isLoading ? (
              <p className="px-3 py-3 text-sm text-white/68">
                Loading locations...
              </p>
            ) : null}

            {!isLoading && !locations.length ? (
              <p className="px-3 py-3 text-sm text-white/68">
                No locations available right now.
              </p>
            ) : null}

            {locations.map((location) => (
              <button
                key={location.key}
                type="button"
                onClick={() => handleSelect(location.label)}
                className="flex min-h-[48px] w-full items-center justify-between gap-4 px-3 py-3 text-left text-[0.95rem] text-white transition hover:bg-white/[0.06]"
              >
                <span>
                  <span className="block">{location.label}</span>
                  {location.address ? (
                    <span className="mt-1 block text-xs text-white/45">{location.address}</span>
                  ) : null}
                </span>
                <span className="text-xs text-white/45" aria-hidden="true">
                  -&gt;
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          onBeforeOpen?.();
          setOpen(true);
        }}
        className={`appearance-none border-0 p-0 ${className ?? ""}`}
      >
        {children}
      </button>
      <MenuLocationModal
        open={open}
        onClose={() => setOpen(false)}
        onSelect={handleSelect}
      />
    </>
  );
}
