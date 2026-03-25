"use client";

import Image from "next/image";
import Link from "next/link";
import Section from "@/components/ui/Section";
import { useGetProductsQuery } from "@/redux/api/publicApi";
import { mapApiProduct } from "@/lib/api-mappers";

export default function AllCollectionsPage() {
  const { data, isLoading } = useGetProductsQuery();
  const products = (data?.data ?? []).map(mapApiProduct);

  return (
    <>
      <section className="relative left-1/2 right-1/2 -mx-[50vw] -mt-8 w-screen overflow-hidden sm:-mt-10">
        <div className="relative min-h-[58vh] w-full">
          <Image src="/location_hero.png" alt="Our products" fill priority className="object-cover" />
          <div className="absolute inset-0 bg-black/70" />
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/75 to-transparent" />

          <div className="relative z-10 flex min-h-[58vh] items-center justify-center px-6 pt-24 text-center text-white">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-white/70">Proteinbar Store</p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-7xl">
                OUR PRODUCTS
              </h1>
              <p className="mt-4 max-w-2xl text-sm text-white/85 sm:text-base">
                Discover protein-packed meals, snacks and essentials curated for your routine.
              </p>
              <p className="mt-8 text-sm text-white/90">
                <Link href="/" className="hover:text-white">Home</Link> <span className="px-1">{">"}</span>
                <span>Products</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      <Section title="Our Products" className="pt-12 sm:pt-16">
        {isLoading ? <p className="text-sm text-zinc-500">Loading products...</p> : null}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.handle}`}
              className="group rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="relative aspect-square overflow-hidden rounded-xl">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <h2 className="mt-3 text-center text-lg font-semibold text-zinc-900">
                {product.title}
              </h2>
              <p className="mt-1 text-center text-sm text-zinc-700">
                Dh {product.priceMad.toFixed(2)} MAD
              </p>
            </Link>
          ))}
        </div>
      </Section>
    </>
  );
}
