"use client";

export const MENU_LOCATION_STORAGE_KEY = "proteinbar:selected-menu-location";

export function normalizeLocationName(value: string | null | undefined) {
  return String(value ?? "").trim().toLowerCase();
}

export function resolveLocationName(
  value: string | null | undefined,
  options: string[],
) {
  const normalizedValue = normalizeLocationName(value);

  if (!normalizedValue) {
    return "";
  }

  return (
    options.find((option) => normalizeLocationName(option) === normalizedValue) ??
    ""
  );
}
