import MenuHeroSection from "@/components/menu/MenuHeroSection";
import Card from "@/components/ui/Card";
import Section from "@/components/ui/Section";
import { menuCategories } from "@/data/menu";

export default function MenuPage() {
  return (
    <>
      <MenuHeroSection />
      <Section>
        <div className="space-y-10">
          {menuCategories.map((category) => (
            <div key={category.id}>
              <div className="mb-4">
                <h2 className="text-xl font-semibold sm:text-2xl">{category.name}</h2>
                <p className="mt-1 text-sm text-zinc-600">{category.description}</p>
              </div>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {category.items.map((item) => (
                  <Card key={item.id}>
                    <h3 className="text-base font-semibold">{item.name}</h3>
                    <p className="mt-2 text-sm text-zinc-600">{item.description}</p>
                    <div className="mt-4 flex items-center justify-between text-sm">
                      <span className="font-medium">{item.priceMad} MAD</span>
                      <span className="text-zinc-500">{item.calories} kcal</span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
