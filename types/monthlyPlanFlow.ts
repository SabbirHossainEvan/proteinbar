export type PlanKind = "custom" | "normal";
export type DeliveryOptionId =
  | "daily-delivery"
  | "daily-pickup"
  | "weekly-delivery"
  | "weekly-pickup";

export type MealType = "Breakfast" | "Lunch" | "Dinner" | "Snack";

export type MealLibraryItem = {
  id: string;
  name: string;
  mealType: MealType;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  tags: string[];
  status: "active" | "inactive";
  image?: string;
};

export type AssignedMeal = {
  id: string;
  mealId: string;
  mealName: string;
  mealType: MealType;
  date: string;
  badges: string[];
};

export type WeekAssignment = {
  id: string;
  planId: string;
  weekIndex: number;
  startDate: string;
  endDate: string;
  mealsByDate: Record<string, AssignedMeal[]>;
};

export type PlanRuleConfig = {
  id: string;
  planId: string;
  allowedMealsPerDay: number[];
  allowedDays: number[];
  allowedSnacks: number[];
  planTypeOptions: string[];
  deliveryDaysRule: {
    min: number;
    max: number;
    allowedWeekDays: number[];
  };
  defaults: {
    meals: number;
    days: number;
    snacks: number;
    planType?: string;
    deliveryDays: number[];
  };
  deliveryOptionConfigs: Array<{
    option: DeliveryOptionId;
    enabled: boolean;
    label: string;
    serviceFee: number;
    minDays: number;
    maxDays: number;
  }>;
};

export type PricingConfig = {
  id: string;
  planId: string;
  basePriceFormula: {
    baseFee: number;
    pricePerMeal: number;
    dayMultiplier: number;
  };
  snacksAddonPrice: number;
  vatPercent: number;
  safetyBagFee: number;
  giftCodeRule: {
    type: "percent" | "fixed";
    value: number;
    maxDiscount: number;
    enabled: boolean;
  };
};

export type MonthlyPlanDetails = {
  plan: {
    id: string;
    slug: string;
    title: string;
    description: string;
    image: string;
    badge?: string;
    status: "draft" | "active" | "inactive" | "archived";
    planKind: PlanKind;
    content?: {
      heroTitle?: string;
      heroSubtitle?: string;
      selectMealsText?: string;
      checkoutText?: string;
      customStepTwo?: {
        categories: Array<{ name: string; mealIds: string[] }>;
      };
    };
    weekAssignmentIds?: string[];
  };
  rules: PlanRuleConfig;
  pricing: PricingConfig;
  weekAssignments: WeekAssignment[];
  mealLibrary?: MealLibraryItem[];
};
