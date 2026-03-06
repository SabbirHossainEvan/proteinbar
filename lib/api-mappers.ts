import type { MonthlyPlan } from "@/data/monthlyPlans";
import type { StoreProduct } from "@/data/products";
import type { Location } from "@/types";

export function mapApiPlan(plan: any): MonthlyPlan {
  return {
    id: plan?.planId ?? plan?.id ?? "",
    title: plan?.name ?? plan?.title ?? "",
    description: plan?.description ?? "",
    image: plan?.imageUrl ?? plan?.image ?? "/food/food.png",
    badge: plan?.isNew ? "NEW" : plan?.badge
  };
}

export function mapApiProduct(product: any): StoreProduct {
  return {
    id: product?.productId ?? product?.id ?? "",
    handle: product?.handle ?? "",
    title: product?.title ?? "",
    description: product?.description ?? "",
    priceMad: Number(product?.priceMad ?? 0),
    image: product?.image ?? "/food/food.png"
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
