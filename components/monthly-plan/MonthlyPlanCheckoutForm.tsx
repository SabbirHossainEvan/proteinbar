"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import type { MonthlyPlan } from "@/data/monthlyPlans";

type CheckoutSelection = {
  meals: string;
  days: string;
  snacks: string;
  startDate: string;
  planType?: string;
};

type MonthlyPlanCheckoutFormProps = {
  plan: MonthlyPlan;
  selection: CheckoutSelection;
};

function toNumber(value: string, fallback: number) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function computeBasePrice(selection: CheckoutSelection) {
  const meals = toNumber(selection.meals, 1);
  const days = toNumber(selection.days, 7);
  const snacks = toNumber(selection.snacks, 0);
  return meals * days * 18 + snacks * days * 8;
}

export default function MonthlyPlanCheckoutForm({
  plan,
  selection,
}: MonthlyPlanCheckoutFormProps) {
  const [giftCode, setGiftCode] = useState("");
  const [giftApplied, setGiftApplied] = useState(false);
  const [cutlery, setCutlery] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const subtotal = useMemo(() => computeBasePrice(selection), [selection]);
  const giftDiscount = giftApplied ? Math.round(subtotal * 0.1) : 0;
  const vat = Math.round((subtotal - giftDiscount) * 0.05);
  const safetyBag = cutlery ? 5 : 0;
  const grandTotal = subtotal - giftDiscount + vat + safetyBag;

  return (
    <section className="py-10 sm:py-14">
      <h2 className="text-5xl font-semibold tracking-tight text-black sm:text-7xl">
        Checkout
      </h2>

      <div className="mt-8 grid gap-5 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="relative mx-auto h-40 w-40 overflow-hidden rounded-full border border-zinc-200">
            <Image src={plan.image} alt={plan.title} fill className="object-cover" />
          </div>
          <h3 className="mt-4 text-center text-3xl font-semibold text-black">
            {plan.title}
          </h3>
          <p className="mt-2 text-center text-sm text-zinc-500">
            Selected Plan
          </p>
          <div className="mt-4 space-y-1 text-center text-sm text-zinc-700">
            {selection.planType ? <p>Plan Type: {selection.planType}</p> : null}
            <p>Meals: {selection.meals}</p>
            <p>Days: {selection.days}</p>
            <p>Snacks: {selection.snacks}</p>
            <p>Start: {selection.startDate}</p>
          </div>
        </aside>

        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
          <h3 className="text-3xl font-semibold text-black">Gift Code</h3>
          <div className="mt-4 grid gap-2 sm:grid-cols-[minmax(0,1fr)_120px]">
            <input
              type="text"
              value={giftCode}
              onChange={(event) => setGiftCode(event.target.value)}
              placeholder="Enter Gift Code"
              className="h-12 rounded-lg border border-zinc-300 bg-zinc-50 px-4 text-sm text-zinc-800 outline-none focus:border-zinc-500"
            />
            <button
              type="button"
              onClick={() => setGiftApplied(giftCode.trim().length > 0)}
              className="h-12 rounded-lg bg-black px-6 text-sm font-medium !text-white transition hover:bg-zinc-800 hover:!text-white"
            >
              Apply
            </button>
          </div>

          <div className="mt-5 border-t border-zinc-200 pt-4 text-sm">
            <div className="flex items-center justify-between py-2">
              <span>Total</span>
              <span className="font-semibold">{subtotal.toFixed(2)} AED</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span>Code</span>
              <span className="font-semibold">-{giftDiscount.toFixed(2)} AED</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span>Vat</span>
              <span className="font-semibold">{vat.toFixed(2)} AED</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span>Safety Bag</span>
              <span className="font-semibold">{safetyBag.toFixed(2)} AED</span>
            </div>
            <div className="mt-2 flex items-center justify-between border-t border-zinc-200 py-3 text-base">
              <span className="font-semibold">Grand Total</span>
              <span className="font-bold text-black">{grandTotal.toFixed(2)} AED</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
        <h3 className="text-3xl font-semibold text-zinc-900">Checkout Form</h3>

        <form className="mt-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-zinc-700">First Name</label>
              <input className="mt-2 h-11 w-full rounded-lg border border-zinc-300 bg-zinc-50 px-3 text-sm outline-none focus:border-zinc-500" />
            </div>
            <div>
              <label className="text-sm font-medium text-zinc-700">Last Name</label>
              <input className="mt-2 h-11 w-full rounded-lg border border-zinc-300 bg-zinc-50 px-3 text-sm outline-none focus:border-zinc-500" />
            </div>
            <div>
              <label className="text-sm font-medium text-zinc-700">Email</label>
              <input
                type="email"
                className="mt-2 h-11 w-full rounded-lg border border-zinc-300 bg-zinc-50 px-3 text-sm outline-none focus:border-zinc-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-zinc-700">Phone Number</label>
              <input className="mt-2 h-11 w-full rounded-lg border border-zinc-300 bg-zinc-50 px-3 text-sm outline-none focus:border-zinc-500" />
            </div>
            <div>
              <label className="text-sm font-medium text-zinc-700">Password</label>
              <input
                type="password"
                className="mt-2 h-11 w-full rounded-lg border border-zinc-300 bg-zinc-50 px-3 text-sm outline-none focus:border-zinc-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-zinc-700">Emirates</label>
              <select className="mt-2 h-11 w-full rounded-lg border border-zinc-300 bg-zinc-50 px-3 text-sm outline-none focus:border-zinc-500">
                <option>Choose Emirates</option>
                <option>Abu Dhabi</option>
                <option>Dubai</option>
                <option>Sharjah</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-zinc-700">Area</label>
              <input className="mt-2 h-11 w-full rounded-lg border border-zinc-300 bg-zinc-50 px-3 text-sm outline-none focus:border-zinc-500" />
            </div>
            <div>
              <label className="text-sm font-medium text-zinc-700">Address</label>
              <input className="mt-2 h-11 w-full rounded-lg border border-zinc-300 bg-zinc-50 px-3 text-sm outline-none focus:border-zinc-500" />
            </div>
          </div>

          <div className="mt-5 space-y-2 text-sm text-zinc-700">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={cutlery}
                onChange={(event) => setCutlery(event.target.checked)}
              />
              Cutlery
            </label>
            <p className="text-zinc-500">We Accept: Visa, Mastercard</p>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(event) => setAcceptedTerms(event.target.checked)}
              />
              I accepted the Terms and Conditions of the meals plan
            </label>
          </div>

          <div className="mt-6">
            <button
              type="button"
              disabled={!acceptedTerms}
              className="inline-flex h-12 min-w-44 items-center justify-center rounded-lg bg-black px-8 text-base font-medium !text-white transition hover:bg-zinc-800 hover:!text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              Checkout
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
