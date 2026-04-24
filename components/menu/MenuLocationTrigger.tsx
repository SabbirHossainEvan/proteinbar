"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import MenuLocationModal from "@/components/menu/MenuLocationModal";
import { MENU_LOCATION_STORAGE_KEY } from "@/components/menu/menuLocation";
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
  const { data, isLoading } = useGetRestaurantsQuery();

  const locations = useMemo(() => {
    const restaurants = (data?.data ?? []) as RestaurantInfo[];
    const seen = new Set<string>();

    return restaurants.reduce<string[]>((acc, restaurant) => {
      const name = String(restaurant.name ?? "").trim();
      const normalizedName = name.toLowerCase();

      if (!name || seen.has(normalizedName)) {
        return acc;
      }

      seen.add(normalizedName);
      acc.push(name);
      return acc;
    }, []);
  }, [data]);

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
      <div ref={containerRef} className="relative">
        <button
          type="button"
          onClick={() => {
            onBeforeOpen?.();
            setOpen((prev) => !prev);
          }}
          className={`appearance-none border-0 bg-transparent p-0 ${className ?? ""}`}
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
                key={location}
                type="button"
                onClick={() => handleSelect(location)}
                className="flex min-h-[48px] w-full items-center justify-between px-3 text-left text-[0.95rem] text-white transition hover:bg-white/[0.06]"
              >
                <span>{location}</span>
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
        className={`appearance-none border-0 bg-transparent p-0 ${className ?? ""}`}
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
