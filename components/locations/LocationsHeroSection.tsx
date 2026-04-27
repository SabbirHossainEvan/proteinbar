import Image from "next/image";
import type { WebsitePageRecord } from "@/types/cms";

export default function LocationsHeroSection({ page }: { page?: WebsitePageRecord | null }) {
  const heroEyebrow = page?.heroEyebrow || "Visit Us";
  const heroTitle = page?.heroTitle || "Locations";
  const heroSubtitle = page?.heroSubtitle || "";
  const heroBody = page?.heroBody || "";
  const heroImage = page?.heroImage || "/location_hero.png";

  return (
    <section className="relative left-1/2 right-1/2 -mx-[50vw] -mt-8 w-screen overflow-hidden sm:-mt-10">
      <div className="relative min-h-[92vh] w-full">
        <Image
          src={heroImage}
          alt="Proteinbar locations"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/65" />
        <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-black/70 to-transparent" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.3)_0%,rgba(0,0,0,0.2)_28%,rgba(0,0,0,0.66)_100%)]" />

        <div className="relative z-10 flex min-h-[92vh] flex-col items-center justify-center px-6 pt-24 text-center text-white sm:px-10">
          <p className="fade-up text-[0.8rem] uppercase tracking-[0.32em] text-white/80 sm:text-[0.9rem]">
            {heroEyebrow}
          </p>
          <h1 className="fade-up-delay mt-4 max-w-[980px] text-[2.9rem] font-normal tracking-[-0.05em] sm:text-[4.4rem] lg:text-[5.1rem] lg:leading-[1.02]">
            {heroTitle}
          </h1>
          {heroSubtitle ? (
            <p className="fade-up-delay mt-5 max-w-[760px] text-[1.05rem] leading-8 text-white/84 sm:text-[1.2rem] sm:leading-9">
              {heroSubtitle}
            </p>
          ) : null}
          {heroBody ? (
            <p className="fade-up-delay mt-4 max-w-[760px] text-sm leading-7 text-white/70 sm:text-base">
              {heroBody}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
