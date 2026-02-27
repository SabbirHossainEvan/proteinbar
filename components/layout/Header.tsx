import Link from "next/link";
import Container from "@/components/ui/Container";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/pages/monthly-plan", label: "Monthly Plan" },
  { href: "/pages/menu", label: "Menu" },
  { href: "/pages/nos-restaurants", label: "Locations" },
  { href: "/pages/about-us", label: "About" },
  { href: "/pages/contact", label: "Contact" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/90 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link href="/" className="text-base font-bold tracking-wide sm:text-lg">
          PROTEINBAR
        </Link>
        <nav className="flex items-center gap-2 overflow-x-auto text-sm font-medium sm:gap-4 sm:text-base">
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap rounded-lg px-2 py-1 text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </Container>
    </header>
  );
}
