import MenuLocationTrigger from "@/components/menu/MenuLocationTrigger";
import type { WebsitePageSection } from "@/types/cms";

const defaultContent = {
  body:
    "Founded in 2018, Proteinbar is dedicated to offering a wide array of wholesome and nutritious meals. Our restaurant prides itself on crafting delicious dishes that prioritize health and well-being, catering to a diverse clientele seeking flavorful options that support a balanced lifestyle.",
  buttonLabel: "See Our Menu",
  buttonLink: "/menu",
};

export default function IntroStatementSection({ section }: { section?: WebsitePageSection }) {
  if (section && !section.isVisible) return null;

  const body = section?.body || defaultContent.body;
  const buttonLabel = section?.buttonLabel || defaultContent.buttonLabel;
  const buttonLink = section?.buttonLink || defaultContent.buttonLink;
  const useMenuTrigger = buttonLink.includes("menu");

  return (
    <section className="relative left-1/2 right-1/2 -mx-[50vw] w-screen bg-white px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-4xl text-center">
        <p className="mx-auto max-w-3xl font-semibold text-[15px] leading-7 tracking-[0.01em] text-black sm:text-[14px] sm:leading-8">
          {body}
        </p>

        <div className="mt-10">
          {useMenuTrigger ? (
            <MenuLocationTrigger
              className="inline-flex h-10 min-w-[120px] items-center justify-center bg-black px-6 text-[11px] uppercase tracking-[0.14em] !text-white transition-all duration-200 hover:bg-black"
            >
              {buttonLabel}
            </MenuLocationTrigger>
          ) : (
            <a
              href={buttonLink}
              className="inline-flex h-10 min-w-[120px] items-center justify-center bg-black px-6 text-[11px] uppercase tracking-[0.14em] text-white transition-all duration-200 hover:bg-black"
            >
              {buttonLabel}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
