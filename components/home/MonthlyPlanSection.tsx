import Link from "next/link";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";

export default function MonthlyPlanSection() {
  return (
    <Section className="pb-6 pt-10 sm:pb-8 sm:pt-12">
      <div className="rounded-3xl bg-gradient-to-br from-zinc-900 to-zinc-700 p-8 text-white sm:p-12">
        <p className="text-xs uppercase tracking-[0.2em] text-zinc-300">
          Monthly Subscription
        </p>
        <h2 className="mt-4 max-w-3xl text-3xl font-bold tracking-tight sm:text-5xl">
          Build your personalized monthly meal plan.
        </h2>
        <p className="mt-4 max-w-2xl text-sm text-zinc-200 sm:text-base">
          Choose meals, delivery days, and plan duration with a flexible
          subscription flow.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/pages/monthly-plan">
            <Button className="bg-white text-zinc-900 hover:bg-zinc-100">
              Go To Monthly Plan
            </Button>
          </Link>
          <Link href="/pages/nos-restaurants">
            <Button
              variant="outline"
              className="border-zinc-400 bg-transparent text-white hover:bg-zinc-800"
            >
              View Locations
            </Button>
          </Link>
        </div>
      </div>
    </Section>
  );
}
