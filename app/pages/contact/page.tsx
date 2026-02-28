import ContactForm from "@/components/contact/ContactForm";
import ContactHeroSection from "@/components/contact/ContactHeroSection";

export default function ContactPage() {
  return (
    <>
      <ContactHeroSection />
      <section className=" py-14 sm:py-20 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[1fr_minmax(0,600px)] lg:gap-16">
          <div className="pt-2">
            <h2 className="text-5xl font-semibold tracking-tight text-zinc-900 sm:text-6xl">
              Contact Us
            </h2>
            <div className="mt-5 h-px w-52 bg-zinc-800/70" />

            <div className="mt-10 space-y-4 text-base text-zinc-700 sm:text-lg">
              <p>
                <span className="font-semibold text-zinc-900">Bourgogne Phone:</span> 05 20 20 63 66
              </p>
              <p>
                <span className="font-semibold text-zinc-900">Val Fleuri Phone:</span> 05 22 23 55 39
              </p>
              <p>
                <span className="font-semibold text-zinc-900">Our Website:</span> Proteinbar.ma
              </p>
            </div>
          </div>

          <div>
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
