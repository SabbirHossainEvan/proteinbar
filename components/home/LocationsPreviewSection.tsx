"use client";

import Image from "next/image";
import { useGetLocationsQuery } from "@/redux/api/publicApi";
import { mapApiLocation } from "@/lib/api-mappers";
import { locations as fallbackLocations } from "@/data/locations";

const locationImages = ["/location-1.png", "/location-2.png"];

export default function LocationsPreviewSection() {
  const { data } = useGetLocationsQuery();
  const locations = ((data?.data ?? []).map(mapApiLocation).length
    ? (data?.data ?? []).map(mapApiLocation)
    : fallbackLocations
  ).slice(0, 2);

  return (
    <section className="relative left-1/2 right-1/2 -mx-[50vw] w-screen bg-black px-6 py-28 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-[1180px]">
        <div className="mb-16 text-center sm:mb-18">
          <h2 className="text-[2.5rem] font-bold uppercase tracking-[-0.03em] text-white sm:text-[3.7rem]">
            Our Locations
          </h2>
          <div className="mx-auto mt-6 h-px w-[182px] bg-white" />
        </div>

        <div className="mx-auto grid max-w-[835px] gap-7 md:grid-cols-2 md:gap-7">
          {locations.map((location, index) => (
            <article key={location.id} className="text-white">
              <div className="relative h-[402px] overflow-hidden bg-zinc-900 sm:h-[430px]">
                <Image
                  src={
                    location.image && location.image.trim()
                      ? location.image
                      : locationImages[index] ?? locationImages[0]
                  }
                  alt={location.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="mt-5 space-y-1">
                <h3 className="text-[1.15rem] font-semibold leading-tight text-white sm:text-[1.28rem]">
                  {location.name}
                </h3>
                <p className="text-[1rem] leading-7 text-white/96 sm:text-[1.08rem]">
                  <span className="font-semibold text-white">Address:</span>{" "}
                  {location.address}
                </p>
                <p className="text-[1rem] leading-7 text-white/96 sm:text-[1.08rem]">
                  <span className="font-semibold text-white">Phone:</span>{" "}
                  {location.phone || "Contact in store"}
                </p>
              </div>

              {location.mapUrl ? (
                <a
                  href={location.mapUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1.5 inline-block text-[1rem] text-white underline underline-offset-4 transition hover:text-white/80"
                >
                  See on Google Maps
                </a>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
