import Link from "next/link";
import Image from "next/image";

const heroContent = {
  eyebrow: "Since 2018",
  title: "The Real Food Revolution",
  subtitle:
    "Fresh ingredients. No oil. No trans fat. Casablanca's favorite healthy restaurant since 2018.",
  ctaPrimary: { href: "/pages/menu", label: "See Our Menu" },
  ctaSecondary: { href: "/plans", label: "Start A Monthly Plan" },
};

export default function HeroSection() {
  return (
    <section className="relative left-1/2 right-1/2 -mx-[50vw] -mt-8 w-screen overflow-hidden sm:-mt-10">
      <div className="relative min-h-[92vh] w-full">
        <Image
          src="/hero.png"
          alt="Proteinbar hero"
          fill
          priority
          className="hero-image-zoom object-cover"
        />
        <div className="absolute inset-0 bg-black/68" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.04),transparent_42%),linear-gradient(180deg,rgba(0,0,0,0.30)_0%,rgba(0,0,0,0.38)_28%,rgba(0,0,0,0.72)_100%)]" />

        <div className="relative z-10 flex min-h-[92vh] flex-col items-center justify-center px-6 pt-24 text-center text-white sm:px-10">
          <p className="fade-up text-[0.72rem] uppercase tracking-[0.38em] text-white/72 sm:text-xs">
            {heroContent.eyebrow}
          </p>
          <h1 className="fade-up-delay mt-5 max-w-5xl text-5xl font-medium tracking-[-0.03em] sm:text-6xl lg:text-[5.3rem] lg:leading-[1.02]">
            {heroContent.title}
          </h1>
          <p className="fade-up-delay-2 mt-5 max-w-3xl text-base leading-8 text-white/82 sm:text-lg sm:leading-9">
            {heroContent.subtitle}
          </p>
          <div className="fade-up-delay-3 mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link href={heroContent.ctaPrimary.href}>
              <span className="hero-cta inline-flex h-16 min-w-[190px] items-center justify-center bg-white px-8 text-base font-semibold text-zinc-950 transition hover:bg-zinc-100">
                {heroContent.ctaPrimary.label}
              </span>
            </Link>
            <Link href={heroContent.ctaSecondary.href}>
              <span className="inline-flex items-center justify-center gap-2 text-base font-medium text-white/92 transition hover:text-white">
                {heroContent.ctaSecondary.label}
                <span aria-hidden="true" className="text-lg">
                  ↗
                </span>
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
