export default function MissionSection() {
  return (
    <section className="bg-white px-6 py-20 sm:py-24">
      <div className="mx-auto grid w-full max-w-[980px] gap-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)] lg:gap-28">
        <div className="max-w-[470px]">
          <h2 className="text-[3.35rem] font-semibold tracking-[-0.045em] text-[#111111] sm:text-[3.75rem]">
            Our Mission
          </h2>
          <div className="mt-6 h-px w-[196px] bg-[#1f1f1f]" />
          <p className="mt-8 text-[1.05rem] leading-[2] text-[#8e8e8e]">
            Proteinbar&apos;s core vision and mission is not just about providing
            delicious healthy meals to its customers, but also providing and
            promoting good health and make it accessible to whoever,
            wherever.
          </p>
        </div>

        <div className="space-y-10 pt-1">
          <div>
            <h3 className="text-[1.22rem] font-semibold tracking-[-0.02em] text-[#1a1a1a]">
              Delicious &amp; Healthy
            </h3>
            <p className="mt-1.5 text-[1rem] leading-[1.8] text-[#9b9b9b]">
              Provide delicious healthy meals to customers.
            </p>
          </div>

          <div>
            <h3 className="text-[1.22rem] font-semibold tracking-[-0.02em] text-[#1a1a1a]">
              Promote good health
            </h3>
            <p className="mt-1.5 text-[1rem] leading-[1.8] text-[#9b9b9b]">
              Encourage well-being and fitness.
            </p>
          </div>

          <div>
            <h3 className="text-[1.22rem] font-semibold tracking-[-0.02em] text-[#1a1a1a]">
              Accessibility
            </h3>
            <p className="mt-1.5 text-[1rem] leading-[1.8] text-[#9b9b9b]">
              Make health accessible to everyone, everywhere.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
