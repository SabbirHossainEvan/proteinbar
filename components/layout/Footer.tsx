"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AcceptedCards from "@/components/payments/AcceptedCards";
import type { WebsitePageRecord, WebsiteRepeaterItem } from "@/types/cms";

type FooterApiResponse = {
  success: boolean;
  data: WebsitePageRecord;
};

const footerApiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL?.trim() || "/api/v1";

const fallbackFooterPage: WebsitePageRecord = {
  id: "footer",
  slug: "footer",
  title: "Footer",
  navLabel: "Footer",
  summary: "Global footer branding, contact details, and legal links.",
  kind: "system",
  status: "published",
  showInTopNav: false,
  heroTitle: "PROTEINBAR",
  heroSubtitle: "The Real Food Revolution",
  heroBody: "",
  seoTitle: "Proteinbar Footer",
  seoDescription: "Global Proteinbar footer content.",
  updatedAt: "2026-08-06T00:00:00.000Z",
  sections: [
    {
      id: "footer-contact-details",
      sectionKey: "contact-details",
      sectionType: "contactInfo",
      isVisible: true,
      sortOrder: 0,
      heading: "Contact Details",
      body: "",
      items: [
        { id: "footer-phone-bourgogne", title: "Bourgogne", label: "T:", value: "05 20 20 63 66", link: "tel:+212520206366" },
        { id: "footer-phone-val-fleuri", title: "Val-Fleuri", label: "T:", value: "05 22 23 55 39", link: "tel:+212522235539" },
        { id: "footer-email", title: "Email", label: "E:", value: "Proteinbarmaroc@gmail.com", link: "mailto:Proteinbarmaroc@gmail.com" }
      ]
    },
    {
      id: "footer-links",
      sectionKey: "footer-links",
      sectionType: "cards",
      isVisible: true,
      sortOrder: 1,
      heading: "Footer Links",
      body: "",
      items: [
        { id: "footer-terms", title: "Terms & Conditions", link: "/pages/terms-and-conditions" },
        { id: "footer-privacy", title: "Privacy Policy", link: "/pages/privacy-policy" }
      ]
    }
  ]
};

function getSafeHref(value: string | undefined, fallback: string) {
  const href = value?.trim();
  if (!href) return fallback;
  if (href.startsWith("/") && !href.startsWith("//")) return href;

  try {
    const url = new URL(href);
    return ["http:", "https:", "mailto:", "tel:"].includes(url.protocol)
      ? href
      : fallback;
  } catch {
    return fallback;
  }
}

function ContactItem({ item }: { item: WebsiteRepeaterItem }) {
  const content = item.value?.trim() || item.body?.trim() || "";
  if (!content) return null;

  const fallbackHref = item.title.toLowerCase() === "email"
    ? `mailto:${content}`
    : "";
  const href = getSafeHref(item.link, fallbackHref);

  return (
    <p>
      {item.label ? (
        <span className="mr-2 text-[#c79a33]">{item.label}</span>
      ) : null}
      {item.title && item.title.toLowerCase() !== "email" ? (
        <span className="font-semibold">{item.title}: </span>
      ) : null}
      {href ? <a href={href}>{content}</a> : <span>{content}</span>}
    </p>
  );
}

function FooterBrandName({ value }: { value: string }) {
  const normalized = value.trim();
  const suffix = normalized.slice(-3);

  if (normalized.length > 3 && suffix.toLowerCase() === "bar") {
    return (
      <>
        <span className="font-semibold">{normalized.slice(0, -3)}</span>
        <span className="font-light tracking-[0.1em]">{suffix}</span>
      </>
    );
  }

  return <span className="font-semibold">{normalized}</span>;
}

export default function Footer() {
  const [page, setPage] = useState<WebsitePageRecord>(fallbackFooterPage);

  useEffect(() => {
    const controller = new AbortController();

    const loadFooter = async () => {
      try {
        const response = await fetch(
          `${footerApiBaseUrl.replace(/\/$/, "")}/public/website-pages/footer`,
          {
            cache: "no-store",
            headers: { "Cache-Control": "no-cache" },
            signal: controller.signal,
          },
        );

        if (!response.ok) return;

        const payload = (await response.json()) as FooterApiResponse;
        if (payload.success && payload.data) {
          setPage(payload.data);
        }
      } catch (error) {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          // Keep the stable fallback footer when the public API is unavailable.
        }
      }
    };

    const refreshWhenVisible = () => {
      if (document.visibilityState === "visible") {
        void loadFooter();
      }
    };

    void loadFooter();
    window.addEventListener("focus", loadFooter);
    document.addEventListener("visibilitychange", refreshWhenVisible);

    return () => {
      controller.abort();
      window.removeEventListener("focus", loadFooter);
      document.removeEventListener("visibilitychange", refreshWhenVisible);
    };
  }, []);

  const contactSection = page.sections.find(
    (section) => section.sectionKey === "contact-details" && section.isVisible,
  );
  const linksSection = page.sections.find(
    (section) => section.sectionKey === "footer-links" && section.isVisible,
  );
  const brandName = page.heroTitle?.trim() || "PROTEINBAR";
  const tagline = page.heroSubtitle?.trim() || "The Real Food Revolution";

  return (
    <footer className="relative bg-black px-6 py-20 text-white sm:py-24">
      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <div>
          <h2 className="text-[2.6rem] leading-[0.92] tracking-[0.08em] sm:text-[3.4rem]">
            <FooterBrandName value={brandName} />
          </h2>
          <p className="mt-2 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-white/95 sm:text-[1.16rem]">
            {tagline}
          </p>
          {page.heroBody?.trim() ? (
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-white/72">
              {page.heroBody}
            </p>
          ) : null}
          <div className="mx-auto mt-2 h-px w-full max-w-[22rem] bg-white/18 sm:max-w-[26rem]" />
        </div>

        <div className="mt-6 space-y-1 text-[1.1rem] leading-[1.6] sm:text-[1.18rem]">
          {contactSection?.items.map((item) => (
            <ContactItem key={item.id} item={item} />
          ))}
        </div>

        <div className="mt-7">
          <AcceptedCards />
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm uppercase tracking-[0.16em] text-white/72">
          {linksSection?.items.map((item) => (
            <Link
              key={item.id}
              href={getSafeHref(item.link, "/")}
              className="transition hover:text-white"
            >
              {item.title}
            </Link>
          ))}
        </div>
      </div>

      <a
        href="#"
        aria-label="Back to top"
        className="absolute bottom-6 right-6 text-2xl leading-none text-white/90 transition hover:text-white"
      >
        ↑
      </a>
    </footer>
  );
}
