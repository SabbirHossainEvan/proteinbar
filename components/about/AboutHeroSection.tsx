import Image from "next/image";

export default function AboutHeroSection() {
  return (
    <section className="relative left-1/2 right-1/2 -mx-[50vw] -mt-8 w-screen overflow-hidden sm:-mt-10">
      <div className="relative min-h-[78vh] w-full sm:min-h-[84vh]">
        <Image
          src="/hero.png"
          alt="About Proteinbar"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/70" />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/75 to-transparent" />

        <div className="relative z-10 flex min-h-[78vh] items-center justify-center px-6 pt-24 text-center text-white sm:min-h-[84vh]">
          <h1 className="text-5xl font-semibold tracking-tight sm:text-6xl lg:text-8xl">
            About us
          </h1>
        </div>
      </div>
    </section>
  );
}
