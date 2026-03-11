/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import MenuCategoryJumpSection from "@/components/menu/MenuCategoryJumpSection";
import MenuHeroSection from "@/components/menu/MenuHeroSection";
import Section from "@/components/ui/Section";
import { useGetMenuCategoriesQuery } from "@/redux/api/publicApi";

const categoryNotes: Record<string, string[]> = {
  "high-protein-breakfast": [
    "*Les macros ont ete calcules pour une omelette de 6 oeufs entiers.",
    "*NOS SUPPLEMENTS",
    "2 Blancs d'oeuf: +8 DH | 2 Oeufs complets: +10 DH",
  ],
};

function splitItemDescription(description: string) {
  const macroStart = description.indexOf("Proteins:");
  if (macroStart === -1) {
    return { main: description, macros: "" };
  }

  return {
    main: description.slice(0, macroStart).trim(),
    macros: description.slice(macroStart).trim(),
  };
}

export default function MenuPage() {
  const { data, isLoading } = useGetMenuCategoriesQuery();
  const menuCategories = (data?.data ?? []).map((category: any) => ({
    ...category,
    id: category.categoryId ?? category.id,
  }));

  return (
    <>
      <MenuHeroSection />
      <MenuCategoryJumpSection categories={menuCategories} />

      <Section id="menu-details" className="scroll-mt-28 sm:scroll-mt-32">
        {isLoading ? (
          <p className="text-sm text-zinc-500">Loading menu...</p>
        ) : null}
        <div className="space-y-16 sm:space-y-20">
          {menuCategories.map((category: any, index: number) => {
            const isDark = index % 2 === 1;
            return (
              <div
                key={category.categoryId ?? category.id}
                id={`menu-category-${category.categoryId ?? category.id}`}
                className={`scroll-mt-28 rounded-2xl px-3 py-8 sm:scroll-mt-32 sm:px-6 sm:py-10 ${isDark ? "bg-black" : "bg-white"}`}
              >
                <div className="mx-auto max-w-6xl">
                  {/* {category.image ? (
                    <div className="mb-6 overflow-hidden rounded-2xl">
                      <img
                        src={category.image}
                        alt={
                          category.name ||
                          category.description ||
                          "Menu category"
                        }
                        className="h-44 w-full object-cover sm:h-56"
                      />
                    </div>
                  ) : null} */}
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
                  {(category.items ?? []).map((item: any) => {
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
