"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { getCartTotal, readCart, type CartItem } from "@/lib/cart";

export default function CheckoutPage() {
  const [items] = useState<CartItem[]>(() => readCart());
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const subtotal = useMemo(() => getCartTotal(items), [items]);
  const vat = useMemo(() => subtotal * 0.05, [subtotal]);
  const total = subtotal + vat;

  if (items.length === 0) {
    return (
      <section className="pb-16 pt-24 text-center sm:pb-24 sm:pt-28">
        <h1 className="text-4xl font-semibold text-zinc-900 sm:text-5xl">
          No items to checkout
        </h1>
        <div className="mt-8">
          <Link
            href="/collections/all"
            className="inline-flex h-12 items-center justify-center rounded-xl bg-black px-8 text-lg font-medium !text-white transition hover:bg-zinc-800 hover:!text-white visited:!text-white"
          >
            Go shopping
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="pb-10 pt-24 sm:pb-14 sm:pt-28">
      <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
        Checkout
      </h1>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <form className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-2xl font-semibold text-zinc-900">Customer Details</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <input
              placeholder="First name"
              className="h-11 rounded-lg border border-zinc-300 bg-zinc-50 px-3 text-sm outline-none focus:border-zinc-500"
            />
            <input
              placeholder="Last name"
              className="h-11 rounded-lg border border-zinc-300 bg-zinc-50 px-3 text-sm outline-none focus:border-zinc-500"
            />
            <input
              type="email"
              placeholder="Email"
              className="h-11 rounded-lg border border-zinc-300 bg-zinc-50 px-3 text-sm outline-none focus:border-zinc-500"
            />
            <input
              placeholder="Phone"
              className="h-11 rounded-lg border border-zinc-300 bg-zinc-50 px-3 text-sm outline-none focus:border-zinc-500"
            />
            <input
              placeholder="City / Area"
              className="h-11 rounded-lg border border-zinc-300 bg-zinc-50 px-3 text-sm outline-none focus:border-zinc-500"
            />
            <input
              placeholder="Address"
              className="h-11 rounded-lg border border-zinc-300 bg-zinc-50 px-3 text-sm outline-none focus:border-zinc-500"
            />
          </div>

          <label className="mt-5 flex items-center gap-2 text-sm text-zinc-700">
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(event) => setAcceptedTerms(event.target.checked)}
            />
            I accept the terms and conditions
          </label>

          <button
            type="button"
            disabled={!acceptedTerms}
            className="mt-6 inline-flex h-11 items-center justify-center rounded-lg bg-black px-8 text-sm font-medium !text-white transition hover:bg-zinc-800 hover:!text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Place order
          </button>
        </form>

        <aside className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-2xl font-semibold text-zinc-900">Order Summary</h2>
          <div className="mt-4 space-y-2 text-sm text-zinc-700">
            {items.map((item) => (
              <div key={item.handle} className="flex items-center justify-between">
                <span>
                  {item.title} x{item.quantity}
                </span>
                <span>Dh {(item.priceMad * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 border-t border-zinc-200 pt-4 text-sm text-zinc-700">
            <div className="flex items-center justify-between py-1">
              <span>Subtotal</span>
              <span>Dh {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span>VAT (5%)</span>
              <span>Dh {vat.toFixed(2)}</span>
            </div>
            <div className="mt-1 flex items-center justify-between py-1 text-base font-semibold text-zinc-900">
              <span>Total</span>
              <span>Dh {total.toFixed(2)} MAD</span>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
