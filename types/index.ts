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
};

export type Location = {
  id: string;
  name: string;
  address: string;
  phone: string;
  mapUrl: string;
};
