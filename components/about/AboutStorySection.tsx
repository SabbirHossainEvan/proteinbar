import Image from "next/image";

export default function AboutStorySection() {
  return (
    <section className="py-12 sm:py-16 lg:py-20">
      <div className="grid gap-8 lg:grid-cols-2 lg:items-start lg:gap-12">
        <div>
          <h2 className="text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
            The Proteinbar Story
          </h2>
          <div className="mt-5 h-px w-56 max-w-full bg-zinc-800/70" />
        </div>

        <p className="max-w-2xl text-base leading-8 tracking-[0.01em] text-zinc-600 sm:text-lg">
          Founded in 2018, Proteinbar is dedicated to offering a wide array of wholesome and nutritious meals. Our
          restaurant prides itself on crafting delicious dishes that prioritize health and well-being, catering to a
          diverse clientele seeking flavorful options that support a balanced lifestyle.
        </p>
      </div>

      <div className="mt-10 overflow-hidden sm:mt-12">
        <Image
          src="/healthy/image-4.png"
          alt="Happy Proteinbar customers"
          width={1280}
          height={1000}
          className="h-auto w-full object-cover"
        />
      </div>
    </section>
  );
}
