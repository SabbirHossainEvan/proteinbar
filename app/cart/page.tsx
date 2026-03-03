"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  getCartCount,
  getCartTotal,
  readCart,
  removeItem,
  type CartItem,
  updateItemQuantity,
} from "@/lib/cart";

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>(() => readCart());

  const total = useMemo(() => getCartTotal(items), [items]);
  const count = useMemo(() => getCartCount(items), [items]);

  const onRemove = (handle: string) => {
    setItems(removeItem(handle));
  };

  const onQuantity = (handle: string, quantity: number) => {
    setItems(updateItemQuantity(handle, quantity));
  };

  if (items.length === 0) {
    return (
      <section className="pb-16 pt-24 text-center sm:pb-24 sm:pt-28">
        <h1 className="text-5xl font-semibold tracking-tight text-zinc-800 sm:text-7xl">
          Your cart is empty
        </h1>
        <div className="mt-8">
          <Link
            href="/collections/all"
            className="inline-flex h-12 items-center justify-center rounded-xl bg-black px-8 text-lg font-medium !text-white transition hover:bg-zinc-800 hover:!text-white visited:!text-white"
          >
            Continue shopping
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="pb-10 pt-24 sm:pb-14 sm:pt-28">
      <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
        Cart ({count})
      </h1>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-4">
          {items.map((item) => (
            <article
              key={item.handle}
              className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-5"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-zinc-900">{item.title}</h2>
                  <p className="mt-1 text-sm text-zinc-600">
                    Dh {item.priceMad.toFixed(2)} MAD
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onRemove(item.handle)}
                  className="text-sm font-medium text-zinc-500 hover:text-zinc-900"
                >
                  Remove
                </button>
              </div>

              <div className="mt-4 flex items-center gap-3">
                <label className="text-sm font-medium text-zinc-700">Qty</label>
                <input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(event) =>
                    onQuantity(item.handle, Math.max(1, Number(event.target.value) || 1))
                  }
                  className="h-10 w-20 rounded-lg border border-zinc-300 px-2 text-center text-zinc-900 outline-none focus:border-zinc-500"
                />
                <p className="text-sm text-zinc-700">
                  Subtotal: Dh {(item.priceMad * item.quantity).toFixed(2)}
                </p>
              </div>
            </article>
          ))}
        </div>

        <aside className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-2xl font-semibold text-zinc-900">Order Summary</h2>
          <div className="mt-4 flex items-center justify-between text-base text-zinc-700">
            <span>Total</span>
            <span className="font-semibold text-zinc-900">
              Dh {total.toFixed(2)} MAD
            </span>
          </div>

          <div className="mt-6 space-y-3">
            <Link
              href="/collections/all"
              className="inline-flex h-11 w-full items-center justify-center rounded-lg border border-zinc-300 bg-white text-sm font-medium text-zinc-900 transition hover:bg-zinc-50"
            >
              Continue shopping
            </Link>
            <Link
              href="/checkout"
              className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-black text-sm font-medium !text-white transition hover:bg-zinc-800 hover:!text-white visited:!text-white"
            >
              Proceed to checkout
            </Link>
          </div>
        </aside>
      </div>
    </section>
  );
}
