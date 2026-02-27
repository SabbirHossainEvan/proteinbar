import Image from "next/image";
import { locations } from "@/data/locations";

const locationImages = ["/location-1.png", "/location-2.png"];

export default function LocationsPreviewSection() {
  return (
    <section className="relative left-1/2 right-1/2 -mx-[50vw] w-screen bg-black px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 text-center sm:mb-14">
          <h2 className="text-2xl font-semibold tracking-wide text-white sm:text-4xl">
            OUR LOCATIONS
          </h2>
          <div className="mx-auto mt-4 h-px w-44 bg-white/70" />
        </div>

        <div className="grid gap-8 md:grid-cols-2 md:gap-0">
          {locations.map((location, index) => (
            <article key={location.id}>
              <div className="relative aspect-[4/5] w-[90%] overflow-hidden bg-zinc-900">
                <Image
                  src={locationImages[index] ?? locationImages[0]}
                  alt={location.name}
                  fill
                  className="object-cover"
                />
              </div>

              <h3 className="mt-4 text-2xl font-semibold text-white">
                {location.name}
              </h3>
              <p className="mt-2 text-xl text-white">
                <span className="font-semibold">Address:</span> {location.address}
              </p>
              <p className="mt-1 text-xl text-white">
                <span className="font-semibold">Phone:</span> {location.phone}
              </p>

              <a
                href={location.mapUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-block text-lg !text-white underline underline-offset-4 visited:!text-white hover:!text-white"
              >
                See on Google Maps
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
