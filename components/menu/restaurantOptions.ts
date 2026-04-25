import type { RestaurantInfo } from "@/types";

type RestaurantOption = {
  key: string;
  label: string;
  address: string;
};

export function buildRestaurantOptions(restaurants: RestaurantInfo[]): RestaurantOption[] {
  return restaurants
    .map((restaurant, index) => {
      const label = String(restaurant.name ?? "").trim();
      return {
        key: String(restaurant.restaurantId ?? "").trim() || `${label}-${index}`,
        label,
        address: String(restaurant.address ?? "").trim()
      };
    })
    .filter((restaurant) => restaurant.label);
}
