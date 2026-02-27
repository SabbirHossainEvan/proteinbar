import ContactForm from "@/components/contact/ContactForm";
import Card from "@/components/ui/Card";
import Section from "@/components/ui/Section";

export default function ContactPage() {
  return (
    <Section
      title="Contact Us"
      subtitle="Questions, catering requests, or partnership opportunities. Send us a message."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="text-lg font-semibold">Get in touch</h2>
          <p className="mt-2 text-sm text-zinc-600">
            We usually reply within one business day.
          </p>
          <div className="mt-4 space-y-2 text-sm text-zinc-700">
            <p>Email: contact@proteinbar.ma</p>
            <p>Phone: +212 522-000-111</p>
            <p>Hours: Mon-Sun, 8:00 AM - 10:00 PM</p>
          </div>
        </Card>
        <Card>
          <ContactForm />
        </Card>
      </div>
    </Section>
  );
}
