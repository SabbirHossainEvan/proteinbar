"use client";

import Image from "next/image";
import { useGetLocationsQuery } from "@/redux/api/publicApi";
import { mapApiLocation } from "@/lib/api-mappers";
import { locations as fallbackLocations } from "@/data/locations";
import type { WebsitePageSection } from "@/types/cms";

const locationImages = ["/location-1.png", "/location-2.png"];

export default function LocationsPreviewSection({ section }: { section?: WebsitePageSection }) {
  const { data } = useGetLocationsQuery();
  if (section && !section.isVisible) return null;

  const locations = ((data?.data ?? []).map(mapApiLocation).length
    ? (data?.data ?? []).map(mapApiLocation)
    : fallbackLocations
  ).slice(0, 2);
  const heading = section?.heading || "Our Locations";
  const body = section?.body || "";

  return (
    <section className="relative left-1/2 right-1/2 -mx-[50vw] w-screen bg-black px-6 py-20 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-[980px]">
        <div className="mb-14 text-center">
          <h2 className="text-[2rem] font-semibold uppercase tracking-[0.02em] text-white sm:text-[2.8rem]">
            {heading}
          </h2>
          <div className="mx-auto mt-4 h-px w-[110px] bg-[#b8942c]" />
          {body ? <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/70">{body}</p> : null}
        </div>

        <div className="mx-auto grid max-w-[720px] gap-4 md:grid-cols-2">
          {locations.map((location, index) => (
            <article key={location.id} className="text-white">
              <div className="relative h-[270px] overflow-hidden bg-zinc-900 sm:h-[320px]">
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

              <div className="mt-4 space-y-1">
                <h3 className="text-[0.95rem] font-semibold leading-tight text-white sm:text-[1rem]">
                  {location.name}
                </h3>
                <p className="text-[0.78rem] leading-6 text-white/92 sm:text-[0.82rem]">
                  <span className="font-semibold text-[#b8942c]">Address:</span>{" "}
                  {location.address}
                </p>
                <p className="text-[0.78rem] leading-6 text-white/92 sm:text-[0.82rem]">
                  <span className="font-semibold text-[#b8942c]">Phone:</span>{" "}
                  {location.phone || "Contact in store"}
                </p>
              </div>

              {location.mapUrl ? (
                <a
                  href={location.mapUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1.5 inline-block text-[0.78rem] text-white underline underline-offset-4 transition hover:text-[#b8942c]"
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
