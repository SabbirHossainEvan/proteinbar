import Image from "next/image";
import Link from "next/link";
import MenuLocationTrigger from "@/components/menu/MenuLocationTrigger";
import type { WebsitePageRecord } from "@/types/cms";

const defaultHeroContent = {
  eyebrow: "Since 2018",
  title: "The Real Food Revolution",
  subtitle:
    "Fresh ingredients. No oil. No trans fat. Casablanca's favorite healthy restaurant since 2018.",
  body: "",
  image: "/hero.png",
  ctaPrimary: { href: "/pages/menu", label: "See Our Menu" },
  ctaSecondary: { href: "/mealprep", label: "Start A Monthly Plan" },
};

type HeroSectionProps = {
  page?: WebsitePageRecord;
};

export default function HeroSection({ page }: HeroSectionProps) {
  const heroContent = {
    eyebrow: page?.heroEyebrow || defaultHeroContent.eyebrow,
    title: page?.heroTitle || defaultHeroContent.title,
    subtitle: page?.heroSubtitle || defaultHeroContent.subtitle,
    body: page?.heroBody || defaultHeroContent.body,
    image: page?.heroImage || defaultHeroContent.image,
    ctaPrimary: {
      href: page?.heroPrimaryCtaLink || defaultHeroContent.ctaPrimary.href,
      label: page?.heroPrimaryCtaLabel || defaultHeroContent.ctaPrimary.label,
    },
    ctaSecondary: {
      href: page?.heroSecondaryCtaLink || defaultHeroContent.ctaSecondary.href,
      label: page?.heroSecondaryCtaLabel || defaultHeroContent.ctaSecondary.label,
    },
  };
  const primaryUsesMenuTrigger = heroContent.ctaPrimary.href.includes("menu");
  return (
    <section className="relative left-1/2 right-1/2 -mx-[50vw] -mt-8 w-screen overflow-hidden sm:-mt-10">
      <div className="relative min-h-[92vh] w-full">
        <Image
          src={heroContent.image}
          alt="Proteinbar hero"
          fill
          priority
          className="hero-image-zoom object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.28)_0%,rgba(0,0,0,0.22)_28%,rgba(0,0,0,0.66)_100%)]" />

        <div className="relative z-10 flex min-h-[92vh] flex-col items-center justify-center px-6 pt-24 text-center text-white sm:px-10">
          <p className="fade-up text-[0.8rem] uppercase tracking-[0.32em] text-white/80 sm:text-[0.9rem]">
            {heroContent.eyebrow}
          </p>
          <h1 className="fade-up-delay mt-4 max-w-[980px] text-[2.9rem] font-normal tracking-[-0.05em] sm:text-[4.4rem] lg:text-[5.1rem] lg:leading-[1.02]">
            <span className="inline-flex items-baseline">
              <span className="font-semibold">PROTEIN</span>
              <span className="font-extralight text-white/70">BAR</span>
            </span>
          </h1>
          <p className="fade-up-delay-2 mt-5 max-w-[760px] text-[1.05rem] leading-8 text-white/84 sm:text-[1.2rem] sm:leading-9">
            {heroContent.subtitle}
          </p>
          {heroContent.body ? (
            <p className="fade-up-delay-2 mt-4 max-w-[760px] text-sm leading-7 text-white/70 sm:text-base">
              {heroContent.body}
            </p>
          ) : null}
          <div className="fade-up-delay-3 mt-8 flex flex-wrap items-center justify-center gap-6">
            {primaryUsesMenuTrigger ? (
              <MenuLocationTrigger>
                <span className="hero-cta inline-flex h-[54px] min-w-[144px] items-center justify-center bg-white px-7 text-[0.96rem] font-medium text-zinc-950 transition hover:bg-[#f6eed5]">
                  {heroContent.ctaPrimary.label}
                </span>
              </MenuLocationTrigger>
            ) : (
              <Link href={heroContent.ctaPrimary.href}>
                <span className="hero-cta inline-flex h-[54px] min-w-[144px] items-center justify-center bg-white px-7 text-[0.96rem] font-medium text-zinc-950 transition hover:bg-[#f6eed5]">
                  {heroContent.ctaPrimary.label}
                </span>
              </Link>
            )}
            <Link href={heroContent.ctaSecondary.href}>
              <span className="inline-flex items-center justify-center gap-2 text-[1rem] font-medium text-white/92 transition hover:text-[#f1e7c5]">
                {heroContent.ctaSecondary.label}
                <span aria-hidden="true" className="text-lg">
                  →
                </span>
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
