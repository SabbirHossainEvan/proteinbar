import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import MonthlyPlanStepTwoForm from "@/components/monthly-plan/MonthlyPlanStepTwoForm";
import { getMonthlyPlanById, monthlyPlans } from "@/data/monthlyPlans";

type MonthlyPlanDetailsPageProps = {
  params: Promise<{ planId: string }>;
};

export function generateStaticParams() {
  return monthlyPlans.map((plan) => ({ planId: plan.id }));
}

export default async function MonthlyPlanDetailsPage({
  params,
}: MonthlyPlanDetailsPageProps) {
  const { planId } = await params;
  const plan = getMonthlyPlanById(planId);

  if (!plan) notFound();

  return (
    <>
      <section className="relative left-1/2 right-1/2 -mx-[50vw] -mt-8 w-screen overflow-hidden sm:-mt-10">
        <div className="relative min-h-[58vh] w-full">
          <Image
            src="/location_hero.png"
            alt={plan.title}
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/70" />
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/75 to-transparent" />

          <div className="relative z-10 flex min-h-[58vh] items-center justify-center px-6 pt-24 text-center text-white">
            <div>
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-7xl">
                {plan.title.toUpperCase()}
              </h1>
              <p className="mt-3 text-sm text-white/85 sm:text-base">
                Choose the meal plan for your goals
              </p>
              <p className="mt-8 text-sm text-white/90">
                <Link href="/" className="hover:text-white">
                  Home
                </Link>{" "}
                <span className="px-1">{">"}</span>
                <Link href="/pages/monthly-plan" className="hover:text-white">
                  Monthly Plans
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      <MonthlyPlanStepTwoForm plan={plan} />
    </>
  );
}


