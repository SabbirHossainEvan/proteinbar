import type { MonthlyPlan } from "@/data/monthlyPlans";
import type { StoreProduct } from "@/data/products";
import type { Location } from "@/types";

function asRecord(value: unknown): Record<string, unknown> {
  if (value && typeof value === "object") {
    return value as Record<string, unknown>;
  }

  return {};
}

function toSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function toNumberFromPrice(value: unknown) {
  if (typeof value === "number") return value;
  if (typeof value !== "string") return 0;

  const normalized = value.replace(/[^0-9.]+/g, "");
  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function mapApiPlan(plan: unknown): MonthlyPlan {
  const rawPlan = asRecord(plan);
  const source = rawPlan.plan && typeof rawPlan.plan === "object"
    ? asRecord(rawPlan.plan)
    : rawPlan;
  const rawKind = String(source?.planKind ?? source?.type ?? "").toLowerCase();
  const mappedType =
    rawKind === "custom"
      ? "custom"
      : "normal";

  return {
    id: String(source?.planId ?? source?.id ?? ""),
    planKind: mappedType,
    title: String(source?.name ?? source?.title ?? ""),
    description: String(source?.description ?? ""),
    image: String(source?.imageUrl ?? source?.image ?? "/food/food.png"),
    badge: source?.isNew ? "NEW" : typeof source?.badge === "string" ? source.badge : undefined
  };
}

export function mapApiProduct(product: unknown): StoreProduct {
  const source = asRecord(product);
  const fallbackHandle = toSlug(String(source.sku ?? source.name ?? source.title ?? ""));
  const fallbackDescription = [source.description, source.category].filter(Boolean).join(" | ");

  return {
    id: String(source.productId ?? source.id ?? source._id ?? source.sku ?? ""),
    handle: String(source.handle ?? fallbackHandle ?? ""),
    title: String(source.title ?? source.name ?? ""),
    description: fallbackDescription || "",
    priceMad: toNumberFromPrice(source.priceMad ?? source.price),
    image: String(source.image ?? source.imageUrl ?? "/food/food.png")
  };
}

export function mapApiLocation(location: unknown): Location {
  const source = asRecord(location);
  return {
    id: String(source.locationId ?? source.id ?? ""),
    name: String(source.name ?? ""),
    address: String(source.address ?? source.pickupAddress ?? ""),
    phone: String(source.phone ?? ""),
    mapUrl: String(source.mapUrl ?? source.mapLink ?? source.googleMapsUrl ?? ""),
    image: String(source.image ?? source.imageUrl ?? ""),
    ratingText: String(source.ratingText ?? ""),
    deliveryZone: String(source.deliveryZone ?? ""),
    cutoffTime: String(source.cutoffTime ?? ""),
    workingDays: Array.isArray(source.workingDays) ? source.workingDays.map(String) : [],
    timeSlots: Array.isArray(source.timeSlots) ? source.timeSlots.map(String) : []
  };
}
