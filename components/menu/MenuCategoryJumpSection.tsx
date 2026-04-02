"use client";

import Image from "next/image";
import { ListFilter } from "lucide-react";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import type { MenuCategory } from "@/types";

type MenuCategoryJumpSectionProps = {
  categories: MenuCategory[];
  filterOptions: string[];
  selectedFilter: string;
  onFilterChange: (value: string) => void;
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
  filterOptions,
  selectedFilter,
  onFilterChange,
}: MenuCategoryJumpSectionProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | globalThis.MouseEvent) => {
      if (
        filterRef.current &&
        event.target instanceof Node &&
        !filterRef.current.contains(event.target)
      ) {
        setIsFilterOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleJump = (
    event: MouseEvent<HTMLAnchorElement>,
    categoryId: string,
  ) => {
    event.preventDefault();

    const targetId = `menu-category-${categoryId}`;
    const target = document.getElementById(targetId);

    if (!target) {
      window.history.replaceState(null, "", `#${targetId}`);
      return;
    }

    const headerOffset = window.innerWidth >= 640 ? 120 : 98;
    const top =
      target.getBoundingClientRect().top + window.scrollY - headerOffset;

    window.history.replaceState(null, "", `#${targetId}`);
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <section className="rounded-2xl  px-5 py-10 sm:px-8 sm:py-14 lg:px-10 lg:py-16">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_auto_auto_auto] lg:items-start lg:gap-8">
        <h2 className="max-w-xl text-4xl font-semibold leading-tight tracking-tight text-zinc-900 sm:text-5xl">
          Healthy And Delicious Food Served To You...
        </h2>

        <div className="text-center sm:text-left">
          <svg
            viewBox="0 0 24 24"
            className="mx-auto h-10 w-10 text-zinc-900 sm:mx-0"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <rect x="4" y="5" width="16" height="15" rx="2" />
            <path d="M8 3v4M16 3v4M4 10h16" />
          </svg>
          <p className="mt-3 text-2xl text-zinc-500">Ouvert tous les jours</p>
          <p className="text-3xl font-semibold text-zinc-900">
            Lundi - Dimanche
          </p>
        </div>

        <div className="text-center sm:text-left">
          <svg
            viewBox="0 0 24 24"
            className="mx-auto h-10 w-10 text-zinc-900 sm:mx-0"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <circle cx="12" cy="12" r="8" />
            <path d="M12 8v5l3 2M9 2h6" />
          </svg>
          <p className="mt-3 text-2xl text-zinc-500">Horaire</p>
          <p className="text-3xl font-semibold text-zinc-900">9:30 - 00:00</p>
        </div>

        <div
          ref={filterRef}
          className="relative mx-auto w-full max-w-[220px] sm:mx-0"
        >
          <button
            type="button"
            aria-haspopup="menu"
            aria-expanded={isFilterOpen}
            onClick={() => setIsFilterOpen((prev) => !prev)}
            className="flex h-14 w-full items-center justify-between gap-3 rounded-2xl border border-zinc-300 bg-white px-4 text-left text-base font-medium text-zinc-900 shadow-[0_12px_30px_rgba(15,23,42,0.08)] transition hover:border-zinc-400"
          >
            <span className="flex min-w-0 items-center gap-2 whitespace-nowrap">
              <ListFilter className="h-5 w-5 shrink-0" strokeWidth={2} />
              <span className="truncate">{selectedFilter}</span>
            </span>
            <svg
              viewBox="0 0 24 24"
              className={`h-5 w-5 shrink-0 transition ${isFilterOpen ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>

          {isFilterOpen ? (
            <div className="absolute right-0 z-20 mt-2 w-full overflow-hidden rounded-2xl border border-zinc-200 bg-white py-2 shadow-[0_18px_40px_rgba(15,23,42,0.16)]">
              {filterOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    onFilterChange(option);
                    setIsFilterOpen(false);
                  }}
                  className="block w-full px-4 py-2 text-left text-base text-zinc-700 transition hover:bg-zinc-100 hover:text-zinc-900"
                >
                  {option}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <p className="mx-auto mt-10 max-w-4xl text-center text-base text-zinc-800 sm:mt-12 sm:text-lg">
        <span className="font-semibold">Important:</span> Nous travaillons
        qu&apos;avec des produits frais que nos fournisseurs nous livrent chaque
        matin. Les calories sont approximatives et a titre indicatif.
      </p>

      <div className="mt-10 grid gap-4 sm:mt-12 sm:grid-cols-2 xl:grid-cols-4">
        {categories.map((category) => {
          const image =
            category.image || categoryVisuals[category.id] || "/food/food2.png";
          const title =
            categoryLabels[category.id] ?? category.name.toUpperCase();
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
                  <h3 className="text-center text-[23px] font-semibold leading-tight tracking-wide">
                    {title}
                  </h3>
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}
