import Image from "next/image";
import { locations } from "@/data/locations";

const locationVisuals: Record<
  string,
  {
    image: string;
    reviews: number;
  }
> = {
  "anfa-casablanca": {
    image: "/location-1.png",
    reviews: 318,
  },
  "maarif-casablanca": {
    image: "/location_hero.png",
    reviews: 95,
  },
};

export default function LocationsShowcaseSection() {
  return (
    <section className="relative left-1/2 right-1/2 -mx-[50vw] -mb-8 w-screen sm:-mb-10">
      {locations.map((location) => {
        const visual = locationVisuals[location.id] ?? {
          image: "/location_hero.png",
          reviews: 95,
        };

        return (
          <article key={location.id} className="relative min-h-[62vh] overflow-hidden sm:min-h-[72vh] lg:min-h-[78vh]">
            <Image src={visual.image} alt={location.name} fill className="object-cover" />
            <div className="absolute inset-0 bg-black/65" />
            <div className="absolute inset-x-0 bottom-0 z-10 px-4 pb-10 sm:px-8 sm:pb-14 lg:px-12">
              <div className="mx-auto w-full max-w-[1300px] text-white">
                <p className="text-xs font-medium tracking-wide text-white/90 sm:text-sm">
                  *****
                  <span className="ml-2 text-[11px] sm:text-sm">
                    Rated 4.5/5 Based on {visual.reviews} Reviews
                  </span>
                </p>
                <h3 className="mt-2 text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">
                  {location.name}
                </h3>
                <p className="mt-2 text-base sm:text-3xl">
                  <span className="font-semibold">Address:</span> {location.address}
                </p>
                <p className="mt-1 text-base sm:text-3xl">
                  <span className="font-semibold">Phone:</span> {location.phone}
                </p>
                <a
                  href={location.mapUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-block text-base font-semibold underline underline-offset-4 sm:text-3xl"
                >
                  See on Google Maps
                </a>
                <div className="mt-2 h-px w-28 bg-white/70 sm:mt-3 sm:w-36" />
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}

