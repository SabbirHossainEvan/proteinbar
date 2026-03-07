import type { MonthlyPlan } from "@/data/monthlyPlans";
import type { StoreProduct } from "@/data/products";
import type { Location } from "@/types";

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

export function mapApiPlan(plan: any): MonthlyPlan {
  const mappedType =
    typeof plan?.type === "string" && plan.type.toLowerCase() === "custom"
      ? "custom"
      : "normal";

  return {
    id: String(plan?.planId ?? plan?.id ?? ""),
    planKind: mappedType,
    title: plan?.name ?? plan?.title ?? "",
    description: plan?.description ?? "",
    image: plan?.imageUrl ?? plan?.image ?? "/food/food.png",
    badge: plan?.isNew ? "NEW" : plan?.badge
  };
}

export function mapApiProduct(product: any): StoreProduct {
  const fallbackHandle = toSlug(product?.sku ?? product?.name ?? product?.title ?? "");
  const fallbackDescription = [product?.description, product?.category].filter(Boolean).join(" | ");

  return {
    id: product?.productId ?? product?.id ?? product?._id ?? product?.sku ?? "",
    handle: product?.handle ?? fallbackHandle ?? "",
    title: product?.title ?? product?.name ?? "",
    description: fallbackDescription || "",
    priceMad: toNumberFromPrice(product?.priceMad ?? product?.price),
    image: product?.image ?? product?.imageUrl ?? "/food/food.png"
  };
}

export function mapApiLocation(location: any): Location {
  return {
    id: location?.locationId ?? location?.id ?? "",
    name: location?.name ?? "",
    address: location?.address ?? location?.pickupAddress ?? "",
    phone: location?.phone ?? "",
    mapUrl: location?.mapUrl ?? location?.mapLink ?? ""
  };
}
