import Card from "@/components/ui/Card";
import Section from "@/components/ui/Section";
import { locations } from "@/data/locations";

export default function RestaurantsPage() {
  return (
    <Section
      title="Our Locations"
      subtitle="Visit us in Casablanca. Fresh meals are prepared all day."
    >
      <div className="grid gap-4 md:grid-cols-2">
        {locations.map((location) => (
          <Card key={location.id}>
            <h2 className="text-lg font-semibold">{location.name}</h2>
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
  );
}
