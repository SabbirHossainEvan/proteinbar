import Card from "@/components/ui/Card";
import Section from "@/components/ui/Section";

const pillars = [
  {
    title: "Nutrition-First",
    text: "Every recipe starts with functional nutrition, then flavor and texture.",
  },
  {
    title: "Performance Mindset",
    text: "Our menu supports training goals, workdays, and consistent healthy habits.",
  },
  {
    title: "Community Driven",
    text: "We listen to our customers and evolve with their fitness and lifestyle needs.",
  },
];

export default function AboutUsPage() {
  return (
    <>
      <Section
        title="About Proteinbar"
        subtitle="We create convenient, high-quality meals for people who care about what they eat."
      >
        <Card>
          <p className="text-sm leading-7 text-zinc-700 sm:text-base">
            Proteinbar started with a simple idea: healthy food should be easy to
            access, exciting to eat, and reliable enough to fit into a demanding
            routine. Our team blends culinary creativity with practical nutrition
            so customers can stay consistent without sacrificing taste.
          </p>
        </Card>
      </Section>

      <Section
        title="What We Stand For"
        subtitle="Three core principles guide our daily work."
      >
        <div className="grid gap-4 md:grid-cols-3">
          {pillars.map((pillar) => (
            <Card key={pillar.title}>
              <h2 className="text-lg font-semibold">{pillar.title}</h2>
              <p className="mt-2 text-sm text-zinc-600">{pillar.text}</p>
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}
