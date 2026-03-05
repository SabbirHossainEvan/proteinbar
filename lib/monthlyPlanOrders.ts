import type { MonthlyPlan } from "@/data/monthlyPlans";
import type { Location } from "@/types";

export type DeliveryOptionId =
  | "daily-delivery"
  | "daily-pickup"
  | "weekly-delivery"
  | "weekly-pickup";

export type DeliverySelection = {
  optionId: DeliveryOptionId;
  address?: string;
  pickupLocation?: Pick<Location, "id" | "name" | "address">;
};

export type MonthlyPlanSelection = {
  meals: string;
  days: string;
  snacks: string;
  startDate: string;
  planType?: string;
};

export type MonthlySubscriptionRecord = {
  id: string;
  createdAt: string;
  plan: Pick<MonthlyPlan, "id" | "title">;
  selection: MonthlyPlanSelection;
  delivery: DeliverySelection;
  status: "active";
};

export type MonthlyOrderRecord = {
  id: string;
  createdAt: string;
  subscriptionId: string;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    emirate: string;
    area: string;
  };
  delivery: DeliverySelection;
  totals: {
    subtotal: number;
    giftDiscount: number;
    vat: number;
    safetyBag: number;
    grandTotal: number;
  };
};

const STORAGE_KEYS = {
  subscriptions: "proteinbar_monthly_subscriptions_v1",
  orders: "proteinbar_monthly_orders_v1",
};

function canUseStorage() {
  return typeof window !== "undefined";
}

function readList<T>(key: string): T[] {
  if (!canUseStorage()) return [];
  const raw = window.localStorage.getItem(key);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as T[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeList<T>(key: string, records: T[]) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(key, JSON.stringify(records));
}

function buildId(prefix: string) {
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `${prefix}-${Date.now()}-${random}`;
}

export function createMonthlySubscription(
  payload: Omit<MonthlySubscriptionRecord, "id" | "createdAt" | "status">
) {
  const record: MonthlySubscriptionRecord = {
    id: buildId("SUB"),
    createdAt: new Date().toISOString(),
    status: "active",
    ...payload,
  };

  const all = readList<MonthlySubscriptionRecord>(STORAGE_KEYS.subscriptions);
  writeList(STORAGE_KEYS.subscriptions, [...all, record]);
  return record;
}

export function createMonthlyOrder(
  payload: Omit<MonthlyOrderRecord, "id" | "createdAt">
) {
  const record: MonthlyOrderRecord = {
    id: buildId("ORD"),
    createdAt: new Date().toISOString(),
    ...payload,
  };

  const all = readList<MonthlyOrderRecord>(STORAGE_KEYS.orders);
  writeList(STORAGE_KEYS.orders, [...all, record]);
  return record;
}
