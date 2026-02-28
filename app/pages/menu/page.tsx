import MenuCategoryJumpSection from "@/components/menu/MenuCategoryJumpSection";
import MenuHeroSection from "@/components/menu/MenuHeroSection";
import Section from "@/components/ui/Section";
import { menuCategories } from "@/data/menu";

const categoryNotes: Record<string, string[]> = {
  "high-protein-breakfast": [
    "*Les macros ont été calculés pour une omelette de 6 œufs entiers.",
    "*NOS SUPPLEMENTS",
    "2 Blancs d'oeuf: +8 DH | 2 Oeufs complets: +10 DH",
  ],
  "fit-burgers-wraps": [
    "*Coulis au choix",
    "Miel, caramel, fruits rouges: +05 DH",
    "Beurre de cacahuète, chocolat protéiné: +07 DH",
  ],
  "smoothies-drinks": [
    "Supplément: Double prots - 60g Thon, 17g de protéines - 15 DH",
    "Supplément: Double prots - 100g poulet crispy au four, 21g de protéines - 20 DH",
    "Tous nos Wrap sont accompagnés de 100 gr de pomme de terre ou de patates douces au four et d’un mesclun salade.",
  ],
  "healthy-burgers": [
    "Supplément: Steak de poisson blanc pané au four, 21g de protéines - 20 DH",
    "Supplément Mr Olympia: 1 galette +5 DH / 2 galettes +10 DH",
    "Tous nos burgers (hormis le keto burger) sont accompagnés de pommes de terre ou de patates douces au four.",
  ],
  "healthy-desserts": ["(Desserts Maison)"],
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
  return (
    <>
      <MenuHeroSection />
      <MenuCategoryJumpSection categories={menuCategories} />

      <Section id="menu-details" className="scroll-mt-28 sm:scroll-mt-32">
        <div className="space-y-16 sm:space-y-20">
          {menuCategories.map((category, index) => {
            const isDark = index % 2 === 1;
            return (
            <div
              key={category.id}
              id={`menu-category-${category.id}`}
              className={`scroll-mt-28 rounded-2xl px-3 py-8 sm:scroll-mt-32 sm:px-6 sm:py-10 ${isDark ? "bg-black" : "bg-white"}`}
            >
              <div className="mx-auto max-w-6xl">
                <h2 className={`text-center text-3xl font-semibold sm:text-4xl ${isDark ? "text-white" : "text-zinc-900"}`}>
                  {category.description || category.name}
                </h2>
                <div className={`mt-3 h-px w-full ${isDark ? "bg-white/35" : "bg-zinc-400"}`} />
              </div>

              <div className="mx-auto mt-2 max-w-6xl">
                {category.items.map((item) => {
                  const details = splitItemDescription(item.description);
                  const hasPrice = item.priceMad > 0;
                  const hasNutrition = item.calories > 0 || Boolean(details.macros);
                  return (
                    <div key={item.id} className={`border-b px-4 py-5 text-center sm:px-8 sm:py-6 ${isDark ? "border-white/25" : "border-zinc-400"}`}>
                      <p className={`text-2xl font-semibold tracking-tight sm:text-3xl ${isDark ? "text-white" : "text-zinc-900"}`}>
                        {item.name}
                        {hasPrice ? <span className="font-normal"> - {item.priceMad} DH</span> : null}
                      </p>
                      {details.main ? <p className={`mt-2 text-lg sm:text-xl ${isDark ? "text-zinc-100" : "text-zinc-800"}`}>{details.main}</p> : null}
                      {hasNutrition ? (
                        <div className={`mt-2 text-base font-medium sm:text-lg ${isDark ? "text-zinc-100" : "text-zinc-900"}`}>
                          {item.calories > 0 ? `Calories: ${item.calories} kcal` : ""}
                          {item.calories > 0 && details.macros ? "  |  " : ""}
                          {details.macros}
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
              {categoryNotes[category.id]?.length ? (
                <div className="mx-auto mt-6 max-w-6xl text-center">
                  {categoryNotes[category.id].map((note) => (
                    <p key={note} className={`mt-2 text-lg font-medium sm:text-xl ${isDark ? "text-zinc-100" : "text-zinc-900"}`}>
                      {note}
                    </p>
                  ))}
                </div>
              ) : null}
            </div>
          )})}
        </div>
      </Section>
    </>
  );
}
