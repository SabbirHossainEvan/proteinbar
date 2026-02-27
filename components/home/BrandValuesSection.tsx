import Image from "next/image";

type ValueItem = {
  id: string;
  title: string;
  description: string;
  iconSrc: string;
};

const leftValues: ValueItem[] = [
  {
    id: "honest-business",
    title: "HONEST BUSINESS",
    description:
      "Fair trade practices and full transparency to earn your trust every step of the way.",
    iconSrc: "/icon/icon-1.webp",
  },
  {
    id: "fresh-healthy",
    title: "FRESH & HEALTHY FOOD",
    description:
      "Experience the goodness of our fresh, locally sourced ingredients promoting a healthier lifestyle..",
    iconSrc: "/icon/icon-2.webp",
  },
  {
    id: "no-oil",
    title: "NO OIL",
    description: "Our meals are light, clean, and perfect for a balanced diet.",
    iconSrc: "/icon/icon-3.webp",
  },
];

const rightValues: ValueItem[] = [
  {
    id: "cost-effective",
    title: "COST-EFFECTIVE",
    description:
      "Get nutritious meals that don't break the bank to suit every budget & preference.",
    iconSrc: "/icon/icon-4.webp",
  },
  {
    id: "made-with-love",
    title: "MADE WITH LOVE",
    description:
      "Prepared with care and passion, every meal reflects our dedication to quality.",
    iconSrc: "/icon/icon-5.webp",
  },
  {
    id: "no-trans-fat",
    title: "NO TRANS FAT",
    description: "Our meals are oil-free, healthy, and full of flavor.",
    iconSrc: "/icon/icon-6.webp",
  },
];

function ValueCard({ item, delay }: { item: ValueItem; delay: number }) {
  return (
    <article
      className="mx-auto max-w-[20rem] text-center"
      style={{ animation: `fadeUp 0.7s ease-out ${delay}s both` }}
    >
      <Image
        src={item.iconSrc}
        alt={item.title}
        width={52}
        height={52}
        className="mx-auto h-[52px] w-[52px] object-contain"
      />
      <h3 className="mt-4 text-[18px] font-semibold text-zinc-800">{item.title}</h3>
      <p className="mt-2 text-[16px] leading-relaxed text-zinc-500">
        {item.description}
      </p>
    </article>
  );
}

export default function BrandValuesSection() {
  return (
    <section className="relative left-1/2 right-1/2 -mx-[50vw] w-screen bg-[#efefef] px-6 py-20 sm:py-24 lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[1fr_auto_1fr] lg:items-center lg:gap-12">
        <div className="space-y-12">
          {leftValues.map((item, index) => (
            <ValueCard key={item.id} item={item} delay={index * 0.12} />
          ))}
        </div>

        <div className="mx-auto text-center" style={{ animation: "fadeUp 0.9s ease-out 0.2s both" }}>
          <p className="text-6xl font-bold tracking-tight text-black sm:text-7xl lg:text-6xl">
            PROTEIN<span className="font-light">BAR</span>
          </p>
        </div>

        <div className="space-y-12">
          {rightValues.map((item, index) => (
            <ValueCard key={item.id} item={item} delay={(index + 3) * 0.12} />
          ))}
        </div>
      </div>
    </section>
  );
}
