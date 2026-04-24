import Link from "next/link";

export default function IntroStatementSection() {
  return (
    <section className="relative left-1/2 right-1/2 -mx-[50vw] w-screen bg-white px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-4xl text-center">
        <p className="mx-auto max-w-3xl text-[13px] leading-7 tracking-[0.01em] text-black sm:text-[14px] sm:leading-8">
          Founded in 2018, Proteinbar is dedicated to offering a wide array of
          wholesome and nutritious meals. Our restaurant prides itself on
          crafting delicious dishes that prioritize health and well-being,
          catering to a diverse clientele seeking flavorful options that support
          a balanced lifestyle.
        </p>

        <div className="mt-10">
          <Link
            href="/pages/menu"
            className="inline-flex h-10 min-w-[120px] items-center justify-center bg-black px-6 text-[11px] uppercase tracking-[0.14em] !text-white transition-all duration-200 hover:bg-[#b8942c]"
            style={{ color: "#ffffff" }}
          >
            See Our Menu
          </Link>
        </div>
      </div>
    </section>
  );
}
