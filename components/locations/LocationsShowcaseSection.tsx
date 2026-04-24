"use client";

import Image from "next/image";
import { useGetLocationsQuery } from "@/redux/api/publicApi";
import { mapApiLocation } from "@/lib/api-mappers";

const locationVisuals: Record<string, { image: string; reviews: number }> = {
  "anfa-casablanca": { image: "/location-1.png", reviews: 318 },
  "maarif-casablanca": { image: "/location_hero.png", reviews: 95 },
};

export default function LocationsShowcaseSection() {
  const { data, isLoading, isError } = useGetLocationsQuery();
  const locations = (data?.data ?? [])
    .map(mapApiLocation)
    .filter((location) => location.name && location.address);

  if (isLoading) {
    return (
      <section className="relative left-1/2 right-1/2 -mx-[50vw] -mb-8 w-screen bg-zinc-950 px-4 py-20 text-white sm:-mb-10 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1300px]">
          <p className="text-sm text-white/80">Loading locations...</p>
        </div>
      </section>
    );
  }

  if (isError || locations.length === 0) {
    return (
      <section className="relative left-1/2 right-1/2 -mx-[50vw] -mb-8 w-screen bg-zinc-950 px-4 py-20 text-white sm:-mb-10 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1300px]">
          <p className="text-sm text-white/80">
            No pickup locations are available right now.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative left-1/2 right-1/2 -mx-[50vw] -mb-8 w-screen sm:-mb-10">
      {locations.map((location, index) => {
        const visual = locationVisuals[location.id] ?? {
          image:
            location.image && location.image.trim()
              ? location.image
              : index % 2 === 0
                ? "/location_hero.png"
                : "/location-1.png",
          reviews: 95,
        };

        return (
          <article
            key={location.id}
            className="relative min-h-[62vh] overflow-hidden sm:min-h-[72vh] lg:min-h-[78vh]"
          >
            <Image
              src={visual.image}
              alt={location.name}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/65" />
            <div className="absolute inset-x-0 bottom-0 z-10 px-4 pb-10 sm:px-8 sm:pb-14 lg:px-12">
              <div className="mx-auto w-full max-w-[1300px] text-white lg:pl-8">
                <p className="text-[11px] font-medium tracking-[0.18em] text-white/90 sm:text-xs">
                  <span className="text-white">*****</span>
                  <span className="ml-2 text-[10px] tracking-normal text-white/90 sm:text-xs">
                    {location.ratingText?.trim()
                      ? location.ratingText
                      : `Rated 4.5/5 Based on ${visual.reviews} Reviews`}
                  </span>
                </p>
                <h3 className="mt-3 text-[2rem] font-semibold leading-[1.05] tracking-[-0.03em] sm:text-[2.7rem] lg:text-[3.2rem]">
                  {location.name}
                </h3>
                <p className="mt-3 text-base leading-relaxed text-white/95 sm:text-xl lg:text-[1.1rem]">
                  <span className="font-semibold">Address:</span>{" "}
                  {location.address}
                </p>
                <p className="mt-1.5 text-base leading-relaxed text-white/95 sm:text-xl lg:text-[1.1rem]">
                  <span className="font-semibold">Phone:</span>{" "}
                  {location.phone?.trim() || "Contact in store"}
                </p>
                {location.timeSlots?.length ? (
                  <p className="mt-1.5 text-sm text-white/85 sm:text-base lg:text-[0.95rem]">
                    Time slots: {location.timeSlots.join(", ")}
                  </p>
                ) : null}
                {location.cutoffTime?.trim() ? (
                  <p className="mt-1.5 text-sm text-white/85 sm:text-base lg:text-[0.95rem]">
                    Cutoff time: {location.cutoffTime}
                  </p>
                ) : null}
                {location.mapUrl ? (
                  <a
                    href={location.mapUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-block text-base font-semibold text-white underline underline-offset-4 sm:text-lg lg:text-[1.05rem]"
                  >
                    See on Google Maps
                  </a>
                ) : null}
                <div className="mt-3 h-px w-40 bg-white/60 sm:w-52" />
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}
