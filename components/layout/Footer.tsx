export default function Footer() {
  return (
    <footer className="relative bg-black px-6 py-24 text-white sm:py-28">
      <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
        <h2 className="text-4xl font-semibold tracking-wide sm:text-6xl">
          PROTEIN<span className="font-light">BAR</span>
        </h2>

        <div className="mt-10 space-y-1 text-xl sm:text-[20px]">
          <p>
            <span className="mr-2 text-[#f0c330]">T:</span>
            <span className="font-semibold">Bourgogne:</span> 05 20 20 63 66
          </p>
          <p>
            <span className="mr-2 text-transparent">T:</span>
            <span className="font-semibold">Val-Fleuri:</span> 05 22 23 55 39
          </p>
        </div>

        <p className="mt-8 text-xl sm:text-[20px]">
          <span className="mr-2 text-[#f0c330]">E:</span>
          Proteinbarmaroc@gmail.com
        </p>
      </div>

      <a
        href="#"
        aria-label="Back to top"
        className="absolute bottom-8 right-8 text-5xl leading-none text-white/90 transition hover:text-white"
      >
        ↑
      </a>
    </footer>
  );
}
