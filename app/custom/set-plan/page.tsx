"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { mapApiPlan } from "@/lib/api-mappers";
import { getPlanKind, getSetPlanPath } from "@/lib/monthlyPlanFlow";
import { useGetMonthlyPlansQuery } from "@/redux/api/publicApi";

export default function CustomSetPlanAliasPage() {
  const router = useRouter();
  const { data, isLoading } = useGetMonthlyPlansQuery();

  useEffect(() => {
    const plans = (data?.data ?? []).map(mapApiPlan);
    const customPlan =
      plans.find((plan) => getPlanKind(plan) === "custom") ?? null;

    if (customPlan) {
      router.replace(getSetPlanPath(customPlan));
    }
  }, [data, router]);

  return (
    <section className="py-20 text-center">
      <p className="text-sm text-zinc-600">
        {isLoading ? "Loading custom plan..." : "Redirecting to custom plan..."}
      </p>
    </section>
  );
}
