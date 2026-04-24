export default function Footer() {
  return (
    <footer className="relative bg-black px-6 py-20 text-white sm:py-24">
      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <div>
          <h2 className="text-[3.6rem] leading-none tracking-[0.02em] sm:text-[4.2rem]">
            <span className="font-semibold">PROTEIN</span>
            <span className="font-light">BAR</span>
          </h2>
          <p className="mt-2 text-[0.92rem] uppercase tracking-[0.18em] text-white/92 sm:text-[1rem]">
            The Real Food Revolution
          </p>
        </div>

        <div className="mt-6 space-y-1 text-[1.1rem] leading-[1.6] sm:text-[1.18rem]">
          <p>
            <span className="mr-2 text-[#c79a33]">T:</span>
            <span className="font-semibold">Bourgone:</span> 05 20 20 63 66
          </p>
          <p>
            <span className="mr-2 text-transparent">T:</span>
            <span className="font-semibold">Val-Fleuri:</span> 05 22 23 55 39
          </p>
        </div>

        <p className="mt-5 text-[1.1rem] sm:text-[1.18rem]">
          <span className="mr-2 text-[#c79a33]">E:</span>
          Proteinbarmaroc@gmail.com
        </p>
      </div>

      <a
        href="#"
        aria-label="Back to top"
        className="absolute bottom-6 right-6 text-2xl leading-none text-white/90 transition hover:text-white"
      >
        ↑
      </a>
    </footer>
  );
}
