import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductActions from "@/components/products/ProductActions";
import { getProductByHandle } from "@/data/products";

type ProductPageProps = {
  params: Promise<{ handle: string }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { handle } = await params;
  const product = getProductByHandle(handle);

  if (!product) notFound();

  return (
    <section className="pb-10 pt-24 sm:pb-14 sm:pt-28">
      <Link href="/collections/all" className="text-sm text-zinc-600 hover:text-zinc-900">
        {"<"} Back to products
      </Link>

      <div className="mt-5 grid gap-8 lg:grid-cols-[minmax(0,520px)_minmax(0,1fr)] lg:items-start">
        <div className="relative aspect-square overflow-hidden rounded-2xl border border-zinc-200 bg-white">
          <Image src={product.image} alt={product.title} fill className="object-cover" />
        </div>

        <div>
          <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
            {product.title}
          </h1>
          <p className="mt-3 text-lg text-zinc-600">{product.description}</p>
          <p className="mt-5 text-2xl font-semibold text-zinc-900">
            Dh {product.priceMad.toFixed(2)} MAD
          </p>
          <ProductActions product={product} />
        </div>
      </div>
    </section>
  );
}
