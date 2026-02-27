import type { HTMLAttributes, ReactNode } from "react";

type SectionProps = HTMLAttributes<HTMLElement> & {
  title?: string;
  subtitle?: string;
  children: ReactNode;
};

export default function Section({
  title,
  subtitle,
  className = "",
  children,
  ...props
}: SectionProps) {
  return (
    <section className={`py-10 sm:py-14 ${className}`.trim()} {...props}>
      {(title || subtitle) && (
        <div className="mb-6 sm:mb-8">
          {title && <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h2>}
          {subtitle && <p className="mt-2 max-w-2xl text-sm text-zinc-600 sm:text-base">{subtitle}</p>}
        </div>
      )}
      {children}
    </section>
  );
}
