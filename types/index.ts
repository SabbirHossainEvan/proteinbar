export type MenuItem = {
  id: string;
  name: string;
  description: string;
  priceMad: number;
  calories: number;
};

export type MenuCategory = {
  id: string;
  name: string;
  description: string;
  items: MenuItem[];
  image: string;
  restaurants?: string[];
};

export type RestaurantInfo = {
  restaurantId: string;
  name: string;
  address: string;
  workingDays: string[];
  openingHours: string;
  status: string;
};

export type Location = {
  id: string;
  name: string;
  address: string;
  phone?: string;
  mapUrl: string;
  image?: string;
  ratingText?: string;
  deliveryZone?: string;
  cutoffTime?: string;
  workingDays?: string[];
  timeSlots?: string[];
};
