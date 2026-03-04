import Image from "next/image";
import Link from "next/link";
import { monthlyPlans } from "@/data/monthlyPlans";

const preMadePlans = monthlyPlans.filter((plan) => plan.id !== "custom-plan");

export default function PreMadePlanFlowPage() {
  return (
    <section className="py-10 sm:py-14">
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-7">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">
          Flow 2
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
          Pre-made Plans
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-600 sm:text-base">
          Choose a pre-defined program and continue with limited customization and
          confirmation.
        </p>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {preMadePlans.map((plan) => (
          <article
            key={plan.id}
            className="group relative flex h-full flex-col rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="relative mx-auto h-44 w-44 overflow-hidden rounded-full bg-zinc-100">
              <Image
                src={plan.image}
                alt={plan.title}
                fill
                className="object-cover transition duration-500 group-hover:scale-105"
              />
            </div>

            <h2 className="mt-6 text-center text-3xl font-semibold leading-[1.05] tracking-tight text-zinc-900">
              {plan.title}
            </h2>

            <p className="mt-3 text-center text-sm leading-6 text-zinc-600">
              {plan.description}
            </p>

            <div className="mt-6 flex justify-center pt-1">
              <Link
                href={`/pages/monthly-plan/${plan.id}`}
                className="inline-flex h-10 items-center justify-center rounded-lg bg-black px-5 text-sm font-medium !text-white transition hover:bg-zinc-800"
              >
                Select & Confirm
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
