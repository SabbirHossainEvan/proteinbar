import Link from "next/link";
import AcceptedCards from "@/components/payments/AcceptedCards";

export default function Footer() {
  return (
    <footer className="relative bg-black px-6 py-20 text-white sm:py-24">
      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <div>
          <h2 className="text-[2.6rem] leading-[0.92] tracking-[0.08em] sm:text-[3.4rem]">
            <span className="font-semibold">PROTEIN</span>
            <span className="font-light tracking-[0.1em]">BAR</span>
          </h2>
          <p className="mt-2 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-white/95 sm:text-[1.16rem]">
            The Real Food Revolution
          </p>
          <div className="mx-auto mt-2 h-px w-full max-w-[22rem] bg-white/18 sm:max-w-[26rem]" />
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

        <div className="mt-7">
          <AcceptedCards />
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm uppercase tracking-[0.16em] text-white/72">
          <Link
            href="/pages/terms-and-conditions"
            className="transition hover:text-white"
          >
            Terms & Conditions
          </Link>
          <Link
            href="/pages/privacy-policy"
            className="transition hover:text-white"
          >
            Privacy Policy
          </Link>
        </div>
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
