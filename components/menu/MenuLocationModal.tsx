"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { buildRestaurantOptions } from "@/components/menu/restaurantOptions";
import { useGetRestaurantsQuery } from "@/redux/api/publicApi";
import type { RestaurantInfo } from "@/types";

type MenuLocationModalProps = {
  open: boolean;
  onClose: () => void;
  onSelect: (locationName: string) => void;
  allowClose?: boolean;
  title?: string;
  description?: string;
};

export default function MenuLocationModal({
  open,
  onClose,
  onSelect,
  allowClose = true,
  title = "Choose your location",
  description = "Select a Proteinbar location to view that restaurant's menu.",
}: MenuLocationModalProps) {
  const [mounted, setMounted] = useState(false);
  const { data, isLoading } = useGetRestaurantsQuery(undefined, {
    skip: !open,
  });

  const locations = useMemo(
    () => buildRestaurantOptions((data?.data ?? []) as RestaurantInfo[]),
    [data]
  );

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!open || !mounted) {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-2 py-3 sm:px-4 sm:py-6">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={allowClose ? onClose : undefined}
      />
      <div className="relative z-10 flex max-h-[calc(100dvh-1.5rem)] w-full max-w-[460px] flex-col border border-white/15 bg-[#0d0d0d]/95 p-3.5 text-white shadow-[0_24px_80px_rgba(0,0,0,0.35)] sm:max-h-[min(100dvh-3rem,720px)] sm:p-6">
        <div className="flex items-start justify-between gap-3 sm:gap-4">
          <div className="min-w-0 flex-1">
            <p className="text-[0.63rem] uppercase tracking-[0.24em] text-white/65 sm:text-[0.76rem] sm:tracking-[0.28em]">
              Menu Selection
            </p>
            <h2 className="mt-2 text-[1.2rem] font-normal leading-[1.02] tracking-[-0.04em] sm:mt-3 sm:text-[1.95rem]">
              {title}
            </h2>
            <p className="mt-2 max-w-[340px] text-[0.82rem] leading-5 text-white/72 sm:mt-3 sm:max-w-[360px] sm:text-sm sm:leading-6">
              {description}
            </p>
          </div>
          {allowClose ? (
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center border border-white/15 text-white/70 transition hover:text-white sm:h-9 sm:w-9"
              aria-label="Close location picker"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4 sm:h-5 sm:w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
          ) : null}
        </div>

        <div className="mt-4 flex-1 space-y-2 overflow-hidden sm:mt-6 sm:space-y-2.5">
          {isLoading ? (
            <p className="text-[0.82rem] text-white/70 sm:text-sm">Loading locations...</p>
          ) : null}

          {!isLoading && !locations.length ? (
            <p className="text-[0.82rem] text-white/70 sm:text-sm">
              No locations are available right now.
            </p>
          ) : null}

          {locations.map((location) => (
            <button
              key={location.key}
              type="button"
              onClick={() => onSelect(location.label)}
              className="flex min-h-[44px] w-full items-center justify-between gap-2 border border-white/14 bg-white/[0.03] px-2.5 py-2 text-left text-[0.84rem] leading-tight text-white transition hover:border-white/28 hover:bg-white/[0.07] sm:min-h-[52px] sm:gap-4 sm:px-4 sm:py-3 sm:text-[0.95rem]"
            >
              <span className="min-w-0 flex-1">
                <span className="block break-words">{location.label}</span>
                {location.address ? (
                  <span className="mt-0.5 block break-words text-[0.68rem] leading-4 text-white/55 sm:mt-1 sm:text-xs">
                    {location.address}
                  </span>
                ) : null}
              </span>
              <span className="shrink-0 text-xs text-white/55 sm:text-sm" aria-hidden="true">
                -&gt;
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>,
    document.body
  );
}
