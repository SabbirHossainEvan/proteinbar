import Image from "next/image";
import Link from "next/link";
import Section from "@/components/ui/Section";
import { storeProducts } from "@/data/products";

export default function AllCollectionsPage() {
  return (
    <Section title="Our Products" className="pt-24 sm:pt-28">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {storeProducts.map((product) => (
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
  );
}
