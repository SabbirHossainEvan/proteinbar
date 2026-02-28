import MenuCategoryJumpSection from "@/components/menu/MenuCategoryJumpSection";
import MenuHeroSection from "@/components/menu/MenuHeroSection";
import Section from "@/components/ui/Section";
import { menuCategories } from "@/data/menu";

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
          {menuCategories.map((category) => (
            <div
              key={category.id}
              id={`menu-category-${category.id}`}
              className="scroll-mt-28 sm:scroll-mt-32"
            >
              <div className="mx-auto max-w-6xl">
                <h2 className="text-center text-3xl font-semibold text-zinc-900 sm:text-4xl">
                  {category.description || category.name}
                </h2>
                <div className="mt-3 h-px w-full bg-zinc-400" />
              </div>

              <div className="mx-auto mt-2 max-w-6xl">
                {category.items.map((item) => {
                  const details = splitItemDescription(item.description);
                  return (
                    <div key={item.id} className="border-b border-zinc-400 px-4 py-5 text-center sm:px-8 sm:py-6">
                      <p className="text-2xl font-semibold uppercase tracking-tight text-zinc-900 sm:text-3xl">
                        {item.name} <span className="font-normal">- {item.priceMad} DH</span>
                      </p>
                      <p className="mt-2 text-lg text-zinc-800 sm:text-xl">{details.main}</p>
                      <div className="mt-2 text-base font-medium text-zinc-900 sm:text-lg">
                        Calories: {item.calories} kcal
                        {details.macros ? `  |  ${details.macros}` : ""}
                      </div>
                    </div>
                  );
                })}
              </div>

              {category.id === "high-protein-breakfast" && (
                <div className="mx-auto mt-6 max-w-6xl text-center">
                  <p className="text-2xl font-semibold italic text-zinc-900 sm:text-3xl">*NOS SUPPLEMENTS</p>
                  <p className="mt-2 text-lg font-medium text-zinc-900 sm:text-xl">
                    2 Blancs d&apos;oeuf: +8 DH &nbsp;|&nbsp; 2 Oeufs complets: +10 DH
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
