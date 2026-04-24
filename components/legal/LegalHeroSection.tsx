import Image from "next/image";

type LegalHeroSectionProps = {
  eyebrow?: string;
  title: string;
  description: string;
};

export default function LegalHeroSection({
  eyebrow = "Legal",
  title,
  description,
}: LegalHeroSectionProps) {
  return (
    <section className="relative left-1/2 right-1/2 -mx-[50vw] -mt-8 w-screen overflow-hidden sm:-mt-10">
      <div className="relative min-h-[68vh] w-full sm:min-h-[74vh]">
        <Image
          src="/hero.png"
          alt={title}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/72" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.38)_0%,rgba(0,0,0,0.24)_30%,rgba(0,0,0,0.76)_100%)]" />

        <div className="relative z-10 flex min-h-[68vh] flex-col items-center justify-center px-6 pt-28 text-center text-white sm:min-h-[74vh] sm:px-10">
          <p className="fade-up text-[0.78rem] uppercase tracking-[0.32em] text-white/76 sm:text-[0.9rem]">
            {eyebrow}
          </p>
          <h1 className="fade-up-delay mt-4 max-w-[980px] text-[2.8rem] font-normal tracking-[-0.05em] sm:text-[4.2rem] lg:text-[4.9rem] lg:leading-[1.02]">
            {title}
          </h1>
          <p className="fade-up-delay-2 mt-5 max-w-[760px] text-[1rem] leading-8 text-white/82 sm:text-[1.15rem] sm:leading-9">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}
