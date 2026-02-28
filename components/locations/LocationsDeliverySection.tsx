"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type StatItem = {
  value: number;
  label: string;
  suffix?: string;
  icon: "users" | "calendar" | "thumbs-up";
};

const stats: StatItem[] = [
  { value: 14, suffix: "+", label: "Staff Members", icon: "users" },
  { value: 7, suffix: "/7", label: "Opens everyday", icon: "calendar" },
  { value: 411, suffix: "+", label: "Positive Reviews", icon: "thumbs-up" },
];

function StatIcon({ icon }: { icon: StatItem["icon"] }) {
  if (icon === "users") {
    return (
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="8" r="3.5" />
        <path d="M4.5 20c1.4-3.4 4.2-5 7.5-5s6.1 1.6 7.5 5" />
      </svg>
    );
  }

  if (icon === "calendar") {
    return (
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3.5" y="5.5" width="17" height="15" rx="2.5" />
        <path d="M8 3.5v4M16 3.5v4M3.5 10h17" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M14.5 10.5V5.8a2.3 2.3 0 0 0-2.3-2.3l-1.1 4.1-2.6 4V20h8.2c1.1 0 2-.8 2.3-1.9l1.2-5.2a2 2 0 0 0-2-2.4h-3.7ZM8.5 11.6H5.8A1.8 1.8 0 0 0 4 13.4v4.8A1.8 1.8 0 0 0 5.8 20h2.7" />
    </svg>
  );
}

export default function LocationsDeliverySection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const hasAnimatedRef = useRef(false);
  const [counts, setCounts] = useState<number[]>(stats.map(() => 0));

  useEffect(() => {
    const element = sectionRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        if (!firstEntry?.isIntersecting || hasAnimatedRef.current) return;

        hasAnimatedRef.current = true;
        const duration = 1400;
        const start = performance.now();

        const animate = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);

          setCounts(stats.map((item) => Math.round(item.value * eased)));

          if (progress < 1) {
            rafRef.current = requestAnimationFrame(animate);
          }
        };

        rafRef.current = requestAnimationFrame(animate);
      },
      { threshold: 0.35 }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative left-1/2 right-1/2 -mx-[50vw] w-screen bg-[#f1f1f1] py-14 sm:py-18 lg:py-24"
    >
      <div className="mx-auto grid w-full max-w-[1300px] gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,560px)_minmax(0,1fr)] lg:items-center lg:gap-14 lg:px-10">
        <div className="overflow-hidden rounded-sm">
          <Image
            src="/healthy/image-7.png"
            alt="Proteinbar delivery and location"
            width={800}
            height={800}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="text-zinc-900">
          <h2 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            2 Locations & Delivery All Over Casablanca
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-8 tracking-[0.04em] text-zinc-700 sm:text-lg">
            Besides Our 2 Locations, We Focus Bringing Healthy, Delicious Meals Right To Your Doorstep, Wherever You
            Are In Casablanca.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-8 text-center sm:grid-cols-3">
            {stats.map((item, index) => (
              <article key={item.label} className="flex flex-col items-center">
                <div className="text-zinc-900">
                  <StatIcon icon={item.icon} />
                </div>
                <p className="mt-2 text-5xl font-semibold leading-none tracking-tight">
                  {counts[index]}
                  {item.suffix ?? ""}
                </p>
                <p className="mt-2 text-sm tracking-[0.08em] text-zinc-600 sm:text-base">{item.label}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
