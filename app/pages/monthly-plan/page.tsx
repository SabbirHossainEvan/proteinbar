"use client";

import Image from "next/image";
import Link from "next/link";
import { useGetMonthlyPlansQuery } from "@/redux/api/publicApi";
import { mapApiPlan } from "@/lib/api-mappers";
import { getSetPlanPath } from "@/lib/monthlyPlanFlow";

export default function MonthlyPlanPage() {
  const { data, isLoading } = useGetMonthlyPlansQuery();
  const monthlyPlans = (data?.data ?? []).map(mapApiPlan);

  return (
    <>
      <section className="relative left-1/2 right-1/2 -mx-[50vw] -mt-8 w-screen overflow-hidden sm:-mt-10">
        <div className="relative min-h-[62vh] w-full">
          <Image
            src="/location_hero.png"
            alt="Monthly plans"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/70" />
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/75 to-transparent" />

          <div className="relative z-10 flex min-h-[62vh] items-center justify-center px-6 pt-24 text-center text-white">
            <div>
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-7xl">
                Monthly Plans
              </h1>
              <p className="mt-3 text-sm text-white/85 sm:text-base">
                Choose the meal plan for your goals
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8 pb-8 sm:mt-10 sm:pb-12">
        {isLoading ? (
          <p className="text-sm text-zinc-500">Loading plans...</p>
        ) : null}
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {monthlyPlans.map((plan) => (
            <article
              key={plan.id}
              className="group relative flex min-h-[720px] flex-col overflow-hidden rounded-md bg-white px-8 pb-14 pt-6 shadow-[0_20px_45px_rgba(0,0,0,0.12)] transition hover:-translate-y-1 hover:shadow-[0_24px_55px_rgba(0,0,0,0.16)]"
            >
              {plan.badge ? (
                <span className="absolute right-[-36px] top-[18px] z-10 rotate-45 bg-[#e73345] px-10 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-white">
                  {plan.badge}
                </span>
              ) : null}

              <div className="relative mx-auto h-[250px] w-full max-w-[320px] overflow-hidden">
                {plan.image && (
                  <Image
                    src={plan.image}
                    alt={plan.title}
                    fill
                    className="object-contain transition duration-500 group-hover:scale-105"
                  />
                )}
              </div>

              <h2 className="mt-6 text-center text-5xl font-extrabold uppercase leading-[0.95] tracking-tight text-zinc-900">
                {plan.title}
              </h2>
              <p className="mx-auto mt-4 max-w-[320px] text-center text-[15px] leading-9 text-zinc-400">
                {plan.description}
              </p>

              <div className="mt-auto flex justify-center pt-12">
                <Link
                  href={getSetPlanPath(plan)}
                  className="inline-flex h-10 min-w-[152px] items-center justify-center rounded bg-black px-6 text-sm font-medium !text-white transition hover:bg-zinc-800 hover:!text-white visited:!text-white"
                >
                  Subscribe Now
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
