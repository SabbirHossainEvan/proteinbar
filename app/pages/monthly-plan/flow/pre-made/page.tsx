"use client";

import Image from "next/image";
import Link from "next/link";
import { useGetMonthlyPlansQuery } from "@/redux/api/publicApi";
import { mapApiPlan } from "@/lib/api-mappers";
import { getPlanKind, getSetPlanPath } from "@/lib/monthlyPlanFlow";

export default function PreMadePlanFlowPage() {
  const { data, isLoading } = useGetMonthlyPlansQuery();
  const plans = (data?.data ?? []).map(mapApiPlan);
  const preMadePlans = plans.filter((plan) => getPlanKind(plan) === "normal");

  return (
    <>
      <section className="relative left-1/2 right-1/2 -mx-[50vw] -mt-8 w-screen overflow-hidden sm:-mt-10">
        <div className="relative min-h-[48vh] w-full">
          <Image
            src="/location_hero.png"
            alt="Pre-made plans"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/75" />
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/75 to-transparent" />

          <div className="relative z-10 flex min-h-[48vh] items-center justify-center px-6 pt-24 text-center text-white">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-white/70">
                Flow 2
              </p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-7xl">
                Pre-made Plan Categories
              </h1>
              <p className="mt-3 text-sm text-white/85 sm:text-base">
                Select a category type to continue with its set-plan step.
              </p>
              <p className="mt-8 text-sm text-white/90">
                <Link href="/" className="hover:text-white">
                  Home
                </Link>{" "}
                <span className="px-1">{">"}</span>
                <Link href="/plans" className="hover:text-white">
                  Monthly Plans
                </Link>{" "}
                <span className="px-1">{">"}</span>
                <span>Pre-made Plans</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-zinc-100 py-10 sm:py-14">
        {isLoading ? (
          <p className="mt-4 text-sm text-zinc-500">Loading plans...</p>
        ) : null}
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {preMadePlans.map((plan) => (
            <article
              key={plan.id}
              className="group relative flex h-full flex-col rounded-sm border border-zinc-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="relative mx-auto h-44 w-44 overflow-hidden rounded-full bg-zinc-100">
                {plan.image && (
                  <Image
                    src={plan.image}
                    alt={plan.title}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                )}
              </div>

              <h2 className="mt-6 text-center text-6xl font-semibold leading-[1.05] tracking-tight text-zinc-900">
                {plan.title}
              </h2>
              <p className="mt-3 text-center text-sm leading-6 text-zinc-600">
                {plan.description}
              </p>

              <div className="mt-auto flex justify-center pt-8">
                <Link
                  href={getSetPlanPath(plan)}
                  className="inline-flex h-10 items-center justify-center rounded-sm bg-[#f04b23] px-6 text-sm font-medium text-white transition hover:bg-[#dc431d]"
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
