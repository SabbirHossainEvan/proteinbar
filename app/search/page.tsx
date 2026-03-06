"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useGetProductsQuery } from "@/redux/api/publicApi";
import { mapApiProduct } from "@/lib/api-mappers";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const { data } = useGetProductsQuery();
  const products = (data?.data ?? []).map(mapApiProduct);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter((item) => item.title.toLowerCase().includes(q) || item.description.toLowerCase().includes(q));
  }, [products, query]);

  return (
    <section className="pt-24 pb-12">
      <h1 className="text-3xl font-semibold text-zinc-900">Search</h1>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products"
        className="mt-4 h-11 w-full max-w-xl rounded-lg border border-zinc-300 bg-white px-3 text-sm outline-none focus:border-zinc-500"
      />
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item) => (
          <Link key={item.id} href={`/products/${item.handle}`} className="rounded-xl border border-zinc-200 bg-white p-4 hover:bg-zinc-50">
            <p className="font-semibold text-zinc-900">{item.title}</p>
            <p className="mt-1 text-sm text-zinc-600">{item.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
