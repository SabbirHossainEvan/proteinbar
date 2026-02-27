import Link from "next/link";
import Card from "@/components/ui/Card";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";
import { locations } from "@/data/locations";

const testimonials = [
  {
    id: "test-1",
    quote: "Best post-workout meals in Casablanca. Fast service and clean ingredients.",
    author: "Yassine, Amateur Boxer",
  },
  {
    id: "test-2",
    quote: "Macros are clear and portions are consistent. Makes meal planning much easier.",
    author: "Salma, CrossFit Coach",
  },
  {
    id: "test-3",
    quote: "Their smoothie options are excellent. Recovery feels smoother after every session.",
    author: "Mehdi, Marathon Runner",
  },
];

export default function HomePage() {
  return (
    <>
      <Section className="pb-6 pt-4 sm:pb-8 sm:pt-6">
        <div className="rounded-3xl bg-gradient-to-br from-zinc-900 to-zinc-700 p-8 text-white sm:p-12">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-300">
            The Real Food Revolution
          </p>
          <h1 className="mt-4 max-w-3xl text-3xl font-bold tracking-tight sm:text-5xl">
            Fuel performance with clean, protein-first meals.
          </h1>
          <p className="mt-4 max-w-2xl text-sm text-zinc-200 sm:text-base">
            Discover balanced bowls, fit burgers, and recovery drinks crafted
            for active lifestyles.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/pages/menu">
              <Button className="bg-white text-zinc-900 hover:bg-zinc-100">
                Explore Menu
              </Button>
            </Link>
            <Link href="/pages/nos-restaurants">
              <Button variant="outline" className="border-zinc-400 bg-transparent text-white hover:bg-zinc-800">
                View Locations
              </Button>
            </Link>
          </div>
        </div>
      </Section>

      <Section
        title="Locations Preview"
        subtitle="Find the nearest Proteinbar and enjoy fresh meals prepared daily."
      >
        <div className="grid gap-4 md:grid-cols-2">
          {locations.map((location) => (
            <Card key={location.id}>
              <h3 className="text-lg font-semibold">{location.name}</h3>
              <p className="mt-2 text-sm text-zinc-600">{location.address}</p>
              <p className="mt-1 text-sm text-zinc-600">{location.phone}</p>
              <a
                href={location.mapUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-block text-sm font-medium text-zinc-900 underline underline-offset-4"
              >
                Open in Maps
              </a>
            </Card>
          ))}
        </div>
      </Section>

      <Section
        title="Our Mission"
        subtitle="Make healthy eating practical, tasty, and accessible for busy people."
      >
        <Card className="grid gap-5 sm:grid-cols-3">
          <div>
            <h3 className="font-semibold">Quality Ingredients</h3>
            <p className="mt-2 text-sm text-zinc-600">
              We prioritize whole foods, lean proteins, and smart cooking methods.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Clear Nutrition</h3>
            <p className="mt-2 text-sm text-zinc-600">
              Every item is designed with performance and balanced macros in mind.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Consistent Experience</h3>
            <p className="mt-2 text-sm text-zinc-600">
              From prep to service, we keep standards high across all locations.
            </p>
          </div>
        </Card>
      </Section>

      <Section
        title="The Proteinbar Experience"
        subtitle="Built for athletes, professionals, and anyone who wants better daily fuel."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            "Fast meal prep workflow",
            "Chef-crafted fit recipes",
            "Flexible dine-in or takeaway",
            "Friendly nutrition-focused staff",
          ].map((item) => (
            <Card key={item}>
              <p className="text-sm font-medium text-zinc-800">{item}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section
        title="Testimonials"
        subtitle="What our community says after making Proteinbar part of their routine."
      >
        <div className="grid gap-4 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id}>
              <p className="text-sm text-zinc-700">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <p className="mt-4 text-sm font-semibold">{testimonial.author}</p>
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}
