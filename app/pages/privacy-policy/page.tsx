import LegalHeroSection from "@/components/legal/LegalHeroSection";
import Section from "@/components/ui/Section";

const sections = [
  {
    title: "Information We Collect",
    body:
      "We may collect information you provide directly when you place an order, create a meal plan, contact us, or subscribe to updates. This can include your name, email address, phone number, delivery details, and order preferences.",
  },
  {
    title: "How We Use Your Information",
    body:
      "We use your information to process orders, manage deliveries, support your account experience, respond to inquiries, and improve our menu, meal plans, and customer service experience.",
  },
  {
    title: "Payments And Orders",
    body:
      "Payment and order information may be used to complete transactions, confirm bookings, prevent fraud, and maintain internal business records related to your purchases.",
  },
  {
    title: "Sharing Of Information",
    body:
      "We do not sell your personal information. We may share limited information with service providers or operational partners only when needed to process orders, deliver meals, provide support, or comply with legal obligations.",
  },
  {
    title: "Data Security",
    body:
      "We take reasonable steps to protect personal information using appropriate technical and organizational measures. However, no online system can guarantee absolute security.",
  },
  {
    title: "Your Choices",
    body:
      "You may contact us to request updates or corrections to the personal information you have shared with us. You may also ask questions about how your information is handled.",
  },
  {
    title: "Policy Updates",
    body:
      "We may update this Privacy Policy from time to time to reflect operational, legal, or service changes. Continued use of our website or services after updates means you accept the revised policy.",
  },
];

export default function PrivacyPolicyPage() {
  return (
    <>
      <LegalHeroSection
        title="Privacy Policy"
        description="This page explains how Proteinbar collects, uses, and protects personal information when you use our website, place orders, or interact with our services."
      />
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-4xl">
          <div className="space-y-8">
            {sections.map((sectionItem) => (
              <Section
                key={sectionItem.title}
                className="border-b border-zinc-200 py-0 pb-8 sm:pb-10"
                title={sectionItem.title}
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
