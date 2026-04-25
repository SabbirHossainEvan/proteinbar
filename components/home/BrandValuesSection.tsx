import Image from "next/image";
import type { WebsitePageSection } from "@/types/cms";

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
      "Experience the goodness of our fresh, locally sourced ingredients promoting a healthier lifestyle.",
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
      "Get nutritious meals that do not break the bank to suit every budget & preference.",
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
      <h3 className="mt-4 text-[12px] font-semibold text-black">{item.title}</h3>
      <p className="mt-2 text-[11px] leading-relaxed text-black/55">
        {item.description}
      </p>
    </article>
  );
}

export default function BrandValuesSection({ section }: { section?: WebsitePageSection }) {
  if (section && !section.isVisible) return null;

  const items = section?.items.length
    ? section.items.map((item, index) => ({
        id: item.id || `value-${index}`,
        title: item.title,
        description: item.body || "",
        iconSrc:
          item.image ||
          [...leftValues, ...rightValues][index]?.iconSrc ||
          "/icon/icon-1.webp",
      }))
    : [...leftValues, ...rightValues];
  const leftColumn = items.slice(0, 3);
  const rightColumn = items.slice(3, 6);
  const brandTitle = section?.heading || "PROTEINBAR";

  return (
    <section className="relative left-1/2 right-1/2 -mx-[50vw] w-screen bg-white px-6 py-18 sm:py-20">
      <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[1fr_auto_1fr] lg:items-center lg:gap-12">
        <div className="space-y-12">
          {leftColumn.map((item, index) => (
            <ValueCard key={item.id} item={item} delay={index * 0.12} />
          ))}
        </div>

        <div
          className="mx-auto text-center"
          style={{ animation: "fadeUp 0.9s ease-out 0.2s both" }}
        >
          <p className="text-5xl tracking-tight text-black sm:text-6xl lg:text-5xl">{brandTitle}</p>
        </div>

        <div className="space-y-12">
          {rightColumn.map((item, index) => (
            <ValueCard key={item.id} item={item} delay={(index + 3) * 0.12} />
          ))}
        </div>
      </div>
    </section>
  );
}
