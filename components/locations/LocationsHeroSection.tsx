import Image from "next/image";

export default function LocationsHeroSection() {
  return (
    <section className="relative left-1/2 right-1/2 -mx-[50vw] -mt-8 w-screen overflow-hidden sm:-mt-10">
      <div className="relative min-h-[78vh] w-full">
        <Image
          src="/location_hero.png"
          alt="Proteinbar locations"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/65" />
        <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-black/70 to-transparent" />

        <div className="relative z-10 flex min-h-[78vh] items-center justify-center px-6 pt-24 text-center text-white">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-7xl">
            Proteinbar Locations
          </h1>
        </div>
      </div>
    </section>
  );
}
