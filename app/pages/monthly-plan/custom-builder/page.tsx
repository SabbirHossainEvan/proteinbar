import Image from "next/image";
import Link from "next/link";
import CustomMealBuilder from "@/components/monthly-plan/CustomMealBuilder";

export default function CustomBuilderPage() {
  return (
    <>
      <section className="relative left-1/2 right-1/2 -mx-[50vw] -mt-8 w-screen overflow-hidden sm:-mt-10">
        <div className="relative min-h-[54vh] w-full">
          <Image
            src="/location_hero.png"
            alt="Custom meal builder"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/70" />
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/75 to-transparent" />

          <div className="relative z-10 flex min-h-[54vh] items-center justify-center px-6 pt-24 text-center text-white">
            <div>
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                Build Your Own Meal
              </h1>
              <p className="mt-3 text-sm text-white/85 sm:text-base">
                Select ingredients and portions with live macro calculation
              </p>
              <p className="mt-8 text-sm text-white/90">
                <Link href="/" className="hover:text-white">
                  Home
                </Link>{" "}
                <span className="px-1">{">"}</span>
                <Link href="/pages/monthly-plan" className="hover:text-white">
                  Monthly Plans
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      <CustomMealBuilder />
    </>
  );
}
