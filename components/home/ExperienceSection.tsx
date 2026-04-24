import Image from "next/image";
import Link from "next/link";
import MenuLocationTrigger from "@/components/menu/MenuLocationTrigger";

const experienceCards = [
  {
    title: "See Our Menu",
    cta: "see Menu",
    href: "/pages/menu",
    image: "/location-2.png",
  },
  {
    title: "Need A Meal Plan",
    cta: "Contact Us",
    href: "/pages/contact",
    image: "/location-1.png",
  },
  {
    title: "Catering Experiences",
    cta: "Contact Us",
    href: "/pages/contact",
    image: "/hero.png",
  },
];

export default function ExperienceSection() {
  return (
    <section className="relative left-1/2 right-1/2 -mx-[50vw] w-screen bg-[#111111] px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-[980px]">
        <div className="mb-12 text-center">
          <h2 className="text-[2rem] font-semibold tracking-[0.02em] text-white sm:text-[2.5rem]">
            THE PROTEINBAR EXPERIENCE
          </h2>
          <div className="mx-auto mt-4 h-px w-[140px] bg-[#b8942c]" />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {experienceCards.map((card) => (
            <article
              key={card.title}
              className="group relative overflow-hidden bg-zinc-900"
            >
              <div className="relative aspect-[0.78/1]">
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/45" />

                <h3 className="absolute left-4 top-4 pr-4 text-[1.35rem] font-semibold text-white sm:left-5 sm:top-5">
                  {card.title}
                </h3>

                {card.href === "/pages/menu" ? (
                  <MenuLocationTrigger className="absolute bottom-4 left-4 text-sm lowercase tracking-[0.04em] !text-white/85 transition hover:!text-[#b8942c] sm:bottom-5 sm:left-5">
                    {card.cta}
                  </MenuLocationTrigger>
                ) : (
                  <Link
                    href={card.href}
                    className="absolute bottom-4 left-4 text-sm lowercase tracking-[0.04em] !text-white/85 visited:!text-white hover:!text-[#b8942c] sm:bottom-5 sm:left-5"
                  >
                    {card.cta}
                  </Link>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
