import LegalHeroSection from "@/components/legal/LegalHeroSection";
import Section from "@/components/ui/Section";
import { fetchWebsitePageContent } from "@/lib/homePageCms";

export const dynamic = "force-dynamic";

export default async function PrivacyPolicyPage() {
  const page = await fetchWebsitePageContent("privacy-policy");
  const sections = page?.sections.filter((section) => section.isVisible) ?? [];

  return (
    <>
      <LegalHeroSection
        eyebrow={page?.heroEyebrow || "Legal"}
        title={page?.heroTitle || "Privacy Policy"}
        description={
          page?.heroSubtitle ||
          page?.heroBody ||
          "This page explains how Proteinbar collects, uses, and protects personal information when you use our website, place orders, or interact with our services."
        }
      />
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-4xl">
          <div className="space-y-8">
            {sections.map((sectionItem) => (
              <Section
                key={sectionItem.id}
                className="border-b border-zinc-200 py-0 pb-8 sm:pb-10"
                title={sectionItem.heading}
              >
                <p className="max-w-3xl text-sm leading-7 text-zinc-600 sm:text-base sm:leading-8">
                  {sectionItem.body}
                </p>
              </Section>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
