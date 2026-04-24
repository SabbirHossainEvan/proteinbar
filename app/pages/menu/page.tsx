"use client";

import { useEffect, useMemo, useState } from "react";
import MenuCategoryJumpSection from "@/components/menu/MenuCategoryJumpSection";
import MenuHeroSection from "@/components/menu/MenuHeroSection";
import Section from "@/components/ui/Section";
import { useGetMenuCategoriesQuery, useGetRestaurantsQuery } from "@/redux/api/publicApi";
import type { MenuCategory, MenuItem, RestaurantInfo } from "@/types";

const categoryNotes: Record<string, string[]> = {
  "high-protein-breakfast": [
    "*Les macros ont ete calcules pour une omelette de 6 oeufs entiers.",
    "*NOS SUPPLEMENTS",
    "2 Blancs d'oeuf: +8 DH | 2 Oeufs complets: +10 DH",
  ],
};

type MenuItemWithDisplayFields = MenuItem & {
  image?: string | null;
};

type MenuCategoryWithDisplayFields = Omit<MenuCategory, "items"> & {
  categoryId?: string;
  items: MenuItemWithDisplayFields[];
};

function splitItemDescription(description: string | null | undefined) {
  const safeDescription = description ?? "";
  const macroStart = safeDescription.indexOf("Proteins:");
  if (macroStart === -1) {
    return { main: safeDescription, macros: "" };
  }

  return {
    main: safeDescription.slice(0, macroStart).trim(),
    macros: safeDescription.slice(macroStart).trim(),
  };
}

function getCategoryRestaurants(category: MenuCategoryWithDisplayFields): string[] {
  if (!Array.isArray(category?.restaurants)) {
    return [];
  }

  return category.restaurants
    .map((restaurant: unknown) => String(restaurant ?? "").trim())
    .filter(Boolean);
}

function matchesRestaurantFilter(
  category: MenuCategoryWithDisplayFields,
  selectedRestaurantName: string,
  selectedRestaurantAliases: string[],
) {
  if (!selectedRestaurantName) {
    return false;
  }

  const categoryRestaurants = getCategoryRestaurants(category).map((restaurant) =>
    restaurant.toLowerCase(),
  );

  return selectedRestaurantAliases.some((alias) =>
    categoryRestaurants.includes(alias.toLowerCase()),
  );
}

function toRestaurantAliases(restaurant: RestaurantInfo | null) {
  if (!restaurant) return [] as string[];

  const values = [
    restaurant.name,
    restaurant.restaurantId,
    restaurant.restaurantId?.replace(/-/g, " "),
  ]
    .map((value) => String(value ?? "").trim())
    .filter(Boolean);

  return Array.from(new Set(values));
}

export default function MenuPage() {
  const { data, isLoading } = useGetMenuCategoriesQuery();
  const { data: restaurantsData } = useGetRestaurantsQuery();
  const [selectedFilter, setSelectedFilter] = useState("");

  const menuCategories = useMemo(
    () =>
      ((data?.data ?? []) as MenuCategoryWithDisplayFields[]).map((category) => ({
        ...category,
        id: category.categoryId ?? category.id,
        items: Array.isArray(category.items) ? category.items : [],
      })),
    [data],
  );

  const restaurants = useMemo(
    () => (restaurantsData?.data ?? []) as RestaurantInfo[],
    [restaurantsData],
  );

  const filterOptions = useMemo(() => {
    const fromApi = restaurants
      .map((restaurant) => String(restaurant.name ?? "").trim())
      .filter(Boolean);

    if (fromApi.length) {
      return fromApi;
    }

    const seen = new Set<string>();
    return menuCategories.reduce<string[]>((acc, category) => {
      getCategoryRestaurants(category).forEach((restaurant) => {
        const key = restaurant.toLowerCase();
        if (seen.has(key)) {
          return;
        }

        seen.add(key);
        acc.push(restaurant);
      });

      return acc;
    }, []);
  }, [menuCategories, restaurants]);

  useEffect(() => {
    if (selectedFilter && !filterOptions.includes(selectedFilter)) {
      setSelectedFilter("");
    }
  }, [filterOptions, selectedFilter]);

  const selectedRestaurantInfo = useMemo(() => {
    if (!selectedFilter) {
      return null;
    }

    return (
      restaurants.find(
        (restaurant) =>
          String(restaurant.name ?? "").toLowerCase() ===
          selectedFilter.toLowerCase(),
      ) ?? null
    );
  }, [restaurants, selectedFilter]);

  const selectedRestaurantAliases = useMemo(
    () =>
      selectedRestaurantInfo
        ? toRestaurantAliases(selectedRestaurantInfo)
        : selectedFilter
          ? [selectedFilter]
          : [],
    [selectedFilter, selectedRestaurantInfo],
  );

  const filteredCategories = useMemo(
    () =>
      menuCategories.filter((category) =>
        matchesRestaurantFilter(
          category,
          selectedFilter,
          selectedRestaurantAliases,
        ),
      ),
    [menuCategories, selectedFilter, selectedRestaurantAliases],
  );

  const emptyMessage =
    !selectedFilter
      ? "Select a location to view its menu."
      : `No menu categories available for ${selectedFilter}.`;

  return (
    <>
      <MenuHeroSection />
      <MenuCategoryJumpSection
        categories={filteredCategories}
        filterOptions={filterOptions}
        selectedFilter={selectedFilter}
        onFilterChange={setSelectedFilter}
        selectedRestaurantInfo={selectedRestaurantInfo}
      />

      <Section id="menu-details" className="scroll-mt-28 sm:scroll-mt-32">
        {isLoading ? (
          <p className="text-sm text-zinc-500">Loading menu...</p>
        ) : null}
        {!isLoading && filteredCategories.length === 0 ? (
          <p className="text-sm text-zinc-500">{emptyMessage}</p>
        ) : null}
        <div className="space-y-16 sm:space-y-20">
          {filteredCategories.map((category, index: number) => {
            const isDark = index % 2 === 1;
            return (
              <div
                key={category.categoryId ?? category.id}
                id={`menu-category-${category.categoryId ?? category.id}`}
                className={`scroll-mt-28 rounded-2xl px-3 py-8 sm:scroll-mt-32 sm:px-6 sm:py-10 ${isDark ? "bg-black" : "bg-white"}`}
              >
                <div className="mx-auto max-w-6xl">
                  <h2
                    className={`text-center text-3xl font-semibold sm:text-4xl ${isDark ? "text-white" : "text-zinc-900"}`}
                  >
                    {category.description || category.name}
                  </h2>
                  <div
                    className={`mt-3 h-px w-full ${isDark ? "bg-white/35" : "bg-zinc-400"}`}
                  />
                </div>

                <div className="mx-auto mt-2 max-w-6xl">
                  {(category.items ?? []).map((item) => {
                    const details = splitItemDescription(item.description);
                    const hasPrice = item.priceMad > 0;
                    const hasNutrition =
                      item.calories > 0 || Boolean(details.macros);

                    return (
                      <div
                        key={item.id}
                        className={`border-b px-4 py-5 text-center sm:px-8 sm:py-6 ${isDark ? "border-white/25" : "border-zinc-400"}`}
                      >
                        {item.image ? (
                          <div className="mx-auto mb-4 h-28 w-28 overflow-hidden rounded-xl border border-zinc-300/50">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ) : null}
                        <p
                          className={`text-2xl font-semibold tracking-tight sm:text-3xl ${isDark ? "text-white" : "text-zinc-900"}`}
                        >
                          {item.name}
                          {hasPrice ? (
                            <span className="font-normal">
                              {" "}
                              - {item.priceMad} DH
                            </span>
                          ) : null}
                        </p>
                        {details.main ? (
                          <p
                            className={`mt-2 text-lg sm:text-xl ${isDark ? "text-zinc-100" : "text-zinc-800"}`}
                          >
                            {details.main}
                          </p>
                        ) : null}
                        {hasNutrition ? (
                          <div
                            className={`mt-2 text-base font-medium sm:text-lg ${isDark ? "text-zinc-100" : "text-zinc-900"}`}
                          >
                            {item.calories > 0
                              ? `Calories: ${item.calories} kcal`
                              : ""}
                            {item.calories > 0 && details.macros ? "  |  " : ""}
                            {details.macros}
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>

                {categoryNotes[category.categoryId ?? category.id]?.length ? (
                  <div className="mx-auto mt-6 max-w-6xl text-center">
                    {categoryNotes[category.categoryId ?? category.id].map(
                      (note) => (
                        <p
                          key={note}
                          className={`mt-2 text-lg font-medium sm:text-xl ${isDark ? "text-zinc-100" : "text-zinc-900"}`}
                        >
                          {note}
                        </p>
                      ),
                    )}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </Section>
    </>
  );
}
