export type MonthlyPlan = {
  id: string;
  title: string;
  description: string;
  image: string;
  badge?: string;
};

export const monthlyPlans: MonthlyPlan[] = [
  {
    id: "custom-plan",
    title: "Custom Plan",
    description:
      "Build your own monthly subscription with meals and snacks aligned with your fitness goals.",
    image: "/food/food.png",
  },
  {
    id: "super-saver",
    title: "Super Saver Subscription",
    description:
      "A balanced monthly plan focused on daily consistency, healthy variety, and affordable pricing.",
    image: "/food/food11.webp",
  },
  {
    id: "kids-meal",
    title: "Kids Meal Plan",
    description:
      "Nutritious portion-controlled meals for children with family-friendly options and better ingredients.",
    image: "/food/food2.png",
    badge: "NEW",
  },
  {
    id: "ramadan-cut",
    title: "Ramadan Lose Weight",
    description:
      "Smart calorie control for Ramadan with satisfying meals and clean ingredients.",
    image: "/food/food9.webp",
  },
  {
    id: "ramadan-bulk",
    title: "Ramadan Gain Weight",
    description:
      "Higher-calorie Ramadan structure for healthy weight gain and stronger recovery.",
    image: "/food/food9.webp",
  },
  {
    id: "sandwich",
    title: "Sandwich Subscription",
    description:
      "Quick and protein-focused monthly option with practical daily meal convenience.",
    image: "/food/food10.webp",
  },
  {
    id: "lose-weight",
    title: "Lose Weight",
    description:
      "A guided deficit approach with portioned meals that help cut fat while staying energized.",
    image: "/food/food2.png",
  },
  {
    id: "gain-weight",
    title: "Gain Weight",
    description:
      "Controlled calorie surplus with nutrient-dense meals to support healthy mass gain.",
    image: "/food/food6.webp",
  },
  {
    id: "detox",
    title: "Detox Plan",
    description:
      "A lighter monthly plan with clean hydration and fresh ingredient combinations.",
    image: "/food/food12.webp",
  },
  {
    id: "keto",
    title: "Keto Plan",
    description:
      "Low-carb, high-fat meal structure for people following ketogenic nutrition.",
    image: "/food/food13.webp",
  },
  {
    id: "vegan",
    title: "Vegan Diet",
    description:
      "Plant-based monthly meals with high-fiber ingredients and complete daily variety.",
    image: "/food/food3.webp",
  },
  {
    id: "pescatarian",
    title: "Pescatarian Diet",
    description:
      "Seafood-forward meals with vegetables and grains for balanced, lighter nutrition.",
    image: "/food/food14.webp",
  },
  {
    id: "ovo-veg",
    title: "Ovo-Veg Diet",
    description:
      "Vegetarian structure including eggs for higher protein and better satiety.",
    image: "/food/food7.webp",
  },
  {
    id: "lacto",
    title: "Lacto Diet Plan",
    description:
      "Vegetarian monthly plan that includes dairy while avoiding egg-based meals.",
    image: "/food/food9.webp",
  },
];

export function getMonthlyPlanById(planId: string) {
  return monthlyPlans.find((plan) => plan.id === planId);
}

