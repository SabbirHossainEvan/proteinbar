"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { StoreProduct } from "@/data/products";
import { addToCart } from "@/lib/cart";

type ProductActionsProps = {
  product: StoreProduct;
};

export default function ProductActions({ product }: ProductActionsProps) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);

  const addItem = () => {
    addToCart(product, quantity);
  };

  const buyNow = () => {
    addToCart(product, quantity);
    router.push("/cart");
  };

  return (
    <div className="mt-6">
      <div className="flex items-center gap-3">
        <label htmlFor="qty" className="text-sm font-medium text-zinc-700">
          Quantity
        </label>
        <input
          id="qty"
          type="number"
          min={1}
          value={quantity}
          onChange={(event) => setQuantity(Math.max(1, Number(event.target.value) || 1))}
          className="h-10 w-20 rounded-lg border border-zinc-300 px-2 text-center text-zinc-900 outline-none focus:border-zinc-500"
        />
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={addItem}
          className="inline-flex h-11 items-center justify-center rounded-lg border border-zinc-300 bg-white px-5 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50"
        >
          Add to cart
        </button>
        <button
          type="button"
          onClick={buyNow}
          className="inline-flex h-11 items-center justify-center rounded-lg bg-black px-6 text-sm font-medium !text-white transition hover:bg-zinc-800 hover:!text-white"
        >
          Buy now
        </button>
      </div>
    </div>
  );
}
