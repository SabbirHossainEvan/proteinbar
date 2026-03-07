import type { MonthlyPlan } from "@/data/monthlyPlans";

export type PlanKind = "custom" | "normal";

export function getPlanKind(plan: MonthlyPlan): PlanKind {
  if (plan.planKind === "custom" || plan.planKind === "normal") {
    return plan.planKind;
  }

  const id = String(plan.id).toLowerCase();
  const title = plan.title.toLowerCase();

  if (id === "4" || id === "custom-plan" || title.includes("custom")) {
    return "custom";
  }

  return "normal";
}

export function getSetPlanPath(plan: MonthlyPlan): string {
  const kind = getPlanKind(plan);
  return `/${kind}/${plan.id}/set-plan`;
}

export function getSelectMealsPath(plan: MonthlyPlan): string {
  const kind = getPlanKind(plan);
  return `/${kind}/${plan.id}/select-meals`;
}

export function getCheckoutPath(plan: MonthlyPlan): string {
  const kind = getPlanKind(plan);
  return `/${kind}/${plan.id}/checkout`;
}
