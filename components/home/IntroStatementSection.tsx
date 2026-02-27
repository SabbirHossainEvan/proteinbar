import Link from "next/link";

export default function IntroStatementSection() {
  return (
    <section className="relative left-1/2 right-1/2 -mx-[50vw] w-screen bg-white px-6 py-24 sm:py-28">
      <div className="mx-auto max-w-5xl text-center">
        <p className="mx-auto max-w-4xl text-lg font-semibold leading-[1.7] tracking-tight text-black sm:text-[22px]">
          Founded in 2018, Proteinbar is dedicated to offering a wide array of
          wholesome and nutritious meals. Our restaurant prides itself on
          crafting delicious dishes that prioritize health and well-being,
          catering to a diverse clientele seeking flavorful options that support
          a balanced lifestyle.
        </p>

        <div className="mt-10">
          <Link
            href="/pages/menu"
            className="inline-flex h-10 min-w-[220px] items-center justify-center bg-black px-8 text-lg font-medium !text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-zinc-900"
            style={{ color: "#ffffff" }}
          >
            See Our Menu
          </Link>
        </div>
      </div>
    </section>
  );
}
