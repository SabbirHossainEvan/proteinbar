import LegalHeroSection from "@/components/legal/LegalHeroSection";
import Section from "@/components/ui/Section";

const sections = [
  {
    title: "Use Of Website",
    body:
      "By using the Proteinbar website, you agree to use it only for lawful purposes and in a way that does not interfere with the experience, security, or availability of the platform for other users.",
  },
  {
    title: "Orders And Availability",
    body:
      "All orders are subject to availability, operational capacity, and confirmation. We reserve the right to update menu items, meal plan options, pricing, and availability without prior notice.",
  },
  {
    title: "Pricing",
    body:
      "Prices displayed on the website are provided in good faith and may change when required. Taxes, delivery fees, or applicable service charges may be added depending on the order type and delivery zone.",
  },
  {
    title: "Meal Plans And Custom Selections",
    body:
      "Meal plan and custom meal selections are based on the options available at the time of purchase. Product composition, macros, and ingredients may vary when supply or operational needs require substitutions.",
  },
  {
    title: "Cancellations And Changes",
    body:
      "Requests to change or cancel an order are handled based on preparation status, delivery scheduling, and operational feasibility. Once preparation has started, changes may be limited or unavailable.",
  },
  {
    title: "Allergies And Dietary Responsibility",
    body:
      "Customers are responsible for reviewing ingredient and nutrition information before ordering. If you have allergies, intolerances, or specific dietary restrictions, please contact us before completing your purchase.",
  },
  {
    title: "Liability",
    body:
      "Proteinbar is not liable for indirect, incidental, or consequential damages resulting from use of the website, order delays, third-party service interruptions, or circumstances outside our reasonable control.",
  },
  {
    title: "Changes To These Terms",
    body:
      "We may revise these Terms & Conditions from time to time. Continued use of the website or services after updates means you agree to the revised terms.",
  },
];

export default function TermsAndConditionsPage() {
  return (
    <>
      <LegalHeroSection
        title="Terms & Conditions"
        description="These terms explain the basic rules, responsibilities, and service conditions that apply when using Proteinbar, placing orders, or purchasing meal plans through our website."
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
