import Image from "next/image";
import Link from "next/link";

const experienceCards = [
  {
    title: "See Our Menu",
    cta: "See Menu",
    href: "/menu",
    image: "/location-2.png",
  },
  {
    title: "Need A Meal Plan",
    cta: "Contact Us",
    href: "/contact",
    image: "/location-1.png",
  },
  {
    title: "Catering Experiences",
    cta: "Contact Us",
    href: "/contact",
    image: "/hero.png",
  },
];

export default function ExperienceSection() {
  return (
    <section className="relative left-1/2 right-1/2 -mx-[50vw] w-screen bg-[#090a0d] px-6 py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 text-center sm:mb-16">
          <h2 className="text-3xl font-semibold tracking-wide text-white sm:text-5xl">
            THE PROTEINBAR EXPERIENCE
          </h2>
          <div className="mx-auto mt-6 h-px w-56 bg-white/80" />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {experienceCards.map((card) => (
            <article
              key={card.title}
              className="group relative overflow-hidden bg-zinc-900"
            >
              <div className="relative aspect-[3/4]">
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/45" />

                <h3 className="absolute left-5 top-5 pr-4 text-3xl font-semibold text-white sm:left-6 sm:top-6">
                  {card.title}
                </h3>

                <Link
                  href={card.href}
                  className="absolute bottom-5 left-5 text-2xl !text-white visited:!text-white hover:!text-white transition duration-300 group-hover:translate-x-1 sm:bottom-6 sm:left-6"
                >
                  {card.cta} <span aria-hidden="true">-&gt;</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
