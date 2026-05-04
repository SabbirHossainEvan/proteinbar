"use client";

import { useMemo } from "react";
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
  const { data, isLoading } = useGetRestaurantsQuery(undefined, {
    skip: !open,
  });

  const locations = useMemo(
    () => buildRestaurantOptions((data?.data ?? []) as RestaurantInfo[]),
    [data]
  );

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-40 flex items-start justify-center px-4 pb-6 pt-28 sm:pt-32">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={allowClose ? onClose : undefined}
      />
      <div className="relative z-10 w-full max-w-[460px] border border-white/15 bg-[#0d0d0d]/95 p-5 text-white shadow-[0_24px_80px_rgba(0,0,0,0.35)] sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[0.76rem] uppercase tracking-[0.28em] text-white/65">
              Menu Selection
            </p>
            <h2 className="mt-3 text-[1.6rem] font-normal tracking-[-0.04em] sm:text-[1.95rem]">
              {title}
            </h2>
            <p className="mt-3 max-w-[360px] text-sm leading-6 text-white/72">
              {description}
            </p>
          </div>
          {allowClose ? (
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-9 w-9 items-center justify-center border border-white/15 text-white/70 transition hover:text-white"
              aria-label="Close location picker"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
          ) : null}
        </div>

        <div className="mt-6 space-y-2.5">
          {isLoading ? (
            <p className="text-sm text-white/70">Loading locations...</p>
          ) : null}

          {!isLoading && !locations.length ? (
            <p className="text-sm text-white/70">
              No locations are available right now.
            </p>
          ) : null}

          {locations.map((location) => (
            <button
              key={location.key}
              type="button"
              onClick={() => onSelect(location.label)}
              className="flex min-h-[52px] w-full items-center justify-between gap-4 border border-white/14 bg-white/[0.03] px-4 py-3 text-left text-[0.95rem] text-white transition hover:border-white/28 hover:bg-white/[0.07]"
            >
              <span>
                <span className="block">{location.label}</span>
                {location.address ? (
                  <span className="mt-1 block text-xs text-white/55">{location.address}</span>
                ) : null}
              </span>
              <span className="text-sm text-white/55" aria-hidden="true">
                -&gt;
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
