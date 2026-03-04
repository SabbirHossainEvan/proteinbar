import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import MonthlyPlanCheckoutForm from "@/components/monthly-plan/MonthlyPlanCheckoutForm";
import { getMonthlyPlanById, monthlyPlans } from "@/data/monthlyPlans";

type CheckoutPageProps = {
  params: Promise<{ planId: string }>;
  searchParams: Promise<{
    meals?: string;
    days?: string;
    snacks?: string;
    startDate?: string;
    planType?: string;
  }>;
};

export function generateStaticParams() {
  return monthlyPlans.map((plan) => ({ planId: plan.id }));
}

export default async function CheckoutPage({
  params,
  searchParams,
}: CheckoutPageProps) {
  const { planId } = await params;
  const query = await searchParams;
  const plan = getMonthlyPlanById(planId);

  if (!plan) notFound();

  const selection = {
    meals: query.meals ?? "1",
    days: query.days ?? "7",
    snacks: query.snacks ?? "0",
    startDate: query.startDate ?? new Date().toISOString().split("T")[0],
    planType: query.planType ?? "",
  };

  return (
    <>
      <section className="relative left-1/2 right-1/2 -mx-[50vw] -mt-8 w-screen overflow-hidden sm:-mt-10">
        <div className="relative min-h-[58vh] w-full">
          <Image
            src="/location_hero.png"
            alt="Checkout"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/70" />
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/75 to-transparent" />

          <div className="relative z-10 flex min-h-[58vh] items-center justify-center px-6 pt-24 text-center text-white">
            <div>
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-7xl">
                Checkout
              </h1>
              <p className="mt-3 text-sm text-white/85 sm:text-base">
                Complete your purchase order
              </p>
              <p className="mt-8 text-sm text-white/90">
                <Link href="/" className="hover:text-white">
                  Home
                </Link>{" "}
                <span className="px-1">{">"}</span>
                <span>Checkout</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      <MonthlyPlanCheckoutForm plan={plan} selection={selection} />
    </>
  );
}
