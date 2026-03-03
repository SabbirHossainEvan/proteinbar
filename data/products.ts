export type StoreProduct = {
  id: string;
  handle: string;
  title: string;
  description: string;
  priceMad: number;
  image: string;
};

export const storeProducts: StoreProduct[] = [
  {
    id: "compose-plate",
    handle: "im-composing",
    title: "I'm composing!",
    description: "Build your own protein plate with your preferred macros.",
    priceMad: 0,
    image: "/food/food.png",
  },
  {
    id: "eggs-day",
    handle: "eggs-day",
    title: "Eggs Day",
    description: "High-protein egg meal to start your day strong.",
    priceMad: 0,
    image: "/food/food4.webp",
  },
  {
    id: "keto-avocado-burger",
    handle: "keto-avocado-burger",
    title: "Keto avocado burger",
    description: "Low-carb burger option for keto-focused diets.",
    priceMad: 90,
    image: "/food/food13.webp",
  },
  {
    id: "pancake-beef-burger",
    handle: "pancake-beef-burger",
    title: "Pancake beef burger",
    description: "Savory pancakes with beef patty and balanced macros.",
    priceMad: 90,
    image: "/food/food10.webp",
  },
  {
    id: "pancake-chicken-burger",
    handle: "pancake-chicken-burger",
    title: "Pancake chicken burger",
    description: "Protein-packed chicken burger in pancake buns.",
    priceMad: 190,
    image: "/food/food7.webp",
  },
  {
    id: "healthy-salmon-avocado-pizza",
    handle: "healthy-salmon-avocado-pizza",
    title: "Healthy salmon avocado pizza",
    description: "Fresh salmon and avocado on a light healthy crust.",
    priceMad: 190,
    image: "/food/food14.webp",
  },
  {
    id: "healthy-beef-pizza",
    handle: "healthy-beef-pizza",
    title: "Healthy beef pizza",
    description: "Protein-rich beef pizza with controlled calories.",
    priceMad: 190,
    image: "/food/food11.webp",
  },
  {
    id: "healthy-chicken-pizza",
    handle: "healthy-chicken-pizza",
    title: "Healthy chicken pizza",
    description: "Lean chicken pizza made for fitness meal plans.",
    priceMad: 190,
    image: "/food/food12.webp",
  },
  {
    id: "beef-spaghetti",
    handle: "beef-meatballs-spaghetti",
    title: "150g minced meatballs + 150g spaghetti",
    description: "Balanced carb-protein plate with minced meatballs.",
    priceMad: 190,
    image: "/food/food5.webp",
  },
  {
    id: "salmon-rice-broccoli",
    handle: "salmon-rice-broccoli",
    title: "150g salmon + 150g rice + broccoli",
    description: "Classic lean meal for strength and recovery.",
    priceMad: 190,
    image: "/food/food6.webp",
  },
  {
    id: "healthy-carrot-cake",
    handle: "healthy-carrot-cake",
    title: "Healthy carrot cake",
    description: "Clean dessert option with balanced macros.",
    priceMad: 80,
    image: "/food/food3.webp",
  },
  {
    id: "healthy-cheesecake",
    handle: "healthy-cheesecake",
    title: "Healthy cheesecake",
    description: "Creamy high-protein dessert without heavy sugar load.",
    priceMad: 80,
    image: "/food/food2.png",
  },
];

export function getProductByHandle(handle: string) {
  return storeProducts.find((product) => product.handle === handle);
}

