"use client";

import Image from "next/image";
import type { MouseEvent } from "react";
import type { MenuCategory } from "@/types";

type MenuCategoryJumpSectionProps = {
  categories: MenuCategory[];
};

const categoryVisuals: Record<string, string> = {
  "high-protein-breakfast": "/food/food.png",
  "signature-bowls": "/food/food3.webp",
  "fit-burgers-wraps": "/food/food7.webp",
  "smoothies-drinks": "/food/food11.webp",
  "compose-ton-plat": "/food/food9.webp",
  "hot-bowls": "/food/food6.webp",
  "healthy-burgers": "/food/food10.webp",
  "healthy-pizzas": "/food/food14.webp",
  "poke-bowls": "/food/food13.webp",
  "shakers-a-la-carte": "/food/food8.webp",
  "detox-soft-drinks": "/food/food12.webp",
  "hot-drinks": "/food/food5.webp",
  "ice-tea": "/food/food4.webp",
  "healthy-desserts": "/food/food2.png",
};

const categoryLabels: Record<string, string> = {
  "high-protein-breakfast": "BREAKFAST",
  "signature-bowls": "COMPOSE TON PORRIDGE",
  "fit-burgers-wraps": "PETITS PLAISIRS HEALTHY",
  "smoothies-drinks": "HEALTHY WRAPS",
  "compose-ton-plat": "COMPOSE TON PLAT",
  "hot-bowls": "HOT BOWLS",
  "healthy-burgers": "HEALTHY BURGERS",
  "healthy-pizzas": "HEALTHY PIZZAS",
  "poke-bowls": "POKE BOWLS",
  "shakers-a-la-carte": "SHAKERS A LA CARTE",
  "detox-soft-drinks": "DETOX & SOFT DRINKS",
  "hot-drinks": "HOT DRINKS",
  "ice-tea": "ICE TEA",
  "healthy-desserts": "HEALTHY DESSERTS",
};

export default function MenuCategoryJumpSection({
  categories,
}: MenuCategoryJumpSectionProps) {
  const handleJump = (event: MouseEvent<HTMLAnchorElement>, categoryId: string) => {
    event.preventDefault();

    const targetId = `menu-category-${categoryId}`;
    const target = document.getElementById(targetId);

    if (!target) {
      window.history.replaceState(null, "", `#${targetId}`);
      return;
    }

    const headerOffset = window.innerWidth >= 640 ? 120 : 98;
    const top = target.getBoundingClientRect().top + window.scrollY - headerOffset;

    window.history.replaceState(null, "", `#${targetId}`);
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <section className="rounded-2xl  px-5 py-10 sm:px-8 sm:py-14 lg:px-10 lg:py-16">
      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr] lg:items-start">
        <h2 className="max-w-xl text-4xl font-semibold leading-tight tracking-tight text-zinc-900 sm:text-5xl">
          Healthy And Delicious Food Served To You...
        </h2>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="text-center sm:text-left">
            <svg viewBox="0 0 24 24" className="mx-auto h-10 w-10 text-zinc-900 sm:mx-0" fill="none" stroke="currentColor" strokeWidth="1.8">
              <rect x="4" y="5" width="16" height="15" rx="2" />
              <path d="M8 3v4M16 3v4M4 10h16" />
            </svg>
            <p className="mt-3 text-2xl text-zinc-500">Ouvert tous les jours</p>
            <p className="text-3xl font-semibold text-zinc-900">Lundi - Dimanche</p>
          </div>

          <div className="text-center sm:text-left">
            <svg viewBox="0 0 24 24" className="mx-auto h-10 w-10 text-zinc-900 sm:mx-0" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="12" cy="12" r="8" />
              <path d="M12 8v5l3 2M9 2h6" />
            </svg>
            <p className="mt-3 text-2xl text-zinc-500">Horaire</p>
            <p className="text-3xl font-semibold text-zinc-900">9:30 - 00:00</p>
          </div>
        </div>
      </div>

      <p className="mx-auto mt-10 max-w-4xl text-center text-base text-zinc-800 sm:mt-12 sm:text-lg">
        <span className="font-semibold">Important:</span>{" "}
        Nous travaillons qu&apos;avec des produits frais que nos fournisseurs nous livrent chaque matin.
        Les calories sont approximatives et a titre indicatif.
      </p>

      <div className="mt-10 grid gap-4 sm:mt-12 sm:grid-cols-2 xl:grid-cols-4">
        {categories.map((category) => {
          const image = categoryVisuals[category.id] ?? "/food/food2.png";
          const title = categoryLabels[category.id] ?? category.name.toUpperCase();
          return (
            <a
              key={category.id}
              href={`#menu-category-${category.id}`}
              onClick={(event) => handleJump(event, category.id)}
              className="group relative block overflow-hidden rounded-2xl shadow-sm"
            >
              <div className="relative h-[260px] w-full sm:h-[330px]">
                <Image
                  src={image}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/5" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <h3 className="text-center text-[23px] font-semibold leading-tight tracking-wide">{title}</h3>
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}
