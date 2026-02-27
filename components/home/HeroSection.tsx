import Link from "next/link";
import Image from "next/image";
import Button from "@/components/ui/Button";

const heroContent = {
  title: "PROTEINBAR",
  subtitle: "Fuel Your Lifestyle With Premium Healthy Dining.",
  ctaPrimary: { href: "/pages/monthly-plan", label: "Start Monthly Plan" },
  ctaSecondary: { href: "/pages/menu", label: "View Menu" },
};

export default function HeroSection() {
  return (
    <section className="relative left-1/2 right-1/2 -mx-[50vw] -mt-8 w-screen overflow-hidden sm:-mt-10">
      <div className="relative min-h-[84vh] w-full">
        <Image
          src="/hero.png"
          alt="Proteinbar hero"
          fill
          priority
          className="hero-image-zoom object-cover"
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/60 to-transparent" />

        <div className="relative z-10 flex min-h-[84vh] flex-col items-center justify-center px-6 pt-16 text-center text-white">
          <p className="fade-up text-xs uppercase tracking-[0.35em] text-white/70 sm:text-sm">
            The Real Food Revolution
          </p>
          <h1 className="fade-up-delay mt-5 text-5xl font-semibold tracking-wide sm:text-7xl lg:text-8xl">
            {heroContent.title}
          </h1>
          <p className="fade-up-delay-2 mt-5 max-w-2xl text-sm text-white/85 sm:text-base">
            {heroContent.subtitle}
          </p>
          <div className="fade-up-delay-3 mt-7 flex flex-wrap items-center justify-center gap-3">
            <Link href={heroContent.ctaPrimary.href}>
              <Button className="hero-cta hero-cta-primary border border-white/20  hover:bg-zinc-900">
                {heroContent.ctaPrimary.label}
              </Button>
            </Link>
            <Link href={heroContent.ctaSecondary.href}>
              <Button
                variant="outline"
                className="hero-cta hero-cta-secondary border-white/20  hover:bg-zinc-900 "
              >
                {heroContent.ctaSecondary.label}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
