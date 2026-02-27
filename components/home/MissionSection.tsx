export default function MissionSection() {
  return (
    <section className=" px-6 py-20 sm:py-24 lg:py-28">
      <div className="mx-auto grid w-full max-w-5xl gap-14 lg:grid-cols-2 lg:gap-16">
        <div>
          <h2 className="text-4xl font-semibold tracking-tight text-zinc-800">
            Our Mission
          </h2>
          <div className="mt-8 h-px w-60 bg-zinc-700" />
          <p className="mt-10 text-lg leading-relaxed text-zinc-600">
            Proteinbar&apos;s core vision and mission is not just about providing
            delicious healthy meals to its customers, but also providing and
            promoting <span className="text-zinc-800">good health</span> and make
            it accessible to whoever, wherever.
          </p>
        </div>

        <div className="space-y-8 pt-1">
          <div>
            <h3 className="text-2xl font-semibold text-zinc-800">
              Delicious &amp; Healthy
            </h3>
            <p className="mt-3 text-lg leading-relaxed text-zinc-500">
              Provide delicious healthy meals to customers.
            </p>
          </div>

          <div>
            <h3 className="text-2xl font-semibold text-zinc-800">
              Promote good health
            </h3>
            <p className="mt-3 text-lg leading-relaxed text-zinc-500">
              Encourage well-being and fitness.
            </p>
          </div>

          <div>
            <h3 className="text-2xl font-semibold text-zinc-800">
              Accessibility
            </h3>
            <p className="mt-3 text-lg leading-relaxed text-zinc-500">
              Make health accessible to everyone, everywhere.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
