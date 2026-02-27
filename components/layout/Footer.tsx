import Container from "@/components/ui/Container";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white">
      <Container className="grid gap-6 py-8 sm:grid-cols-2 sm:gap-8 sm:py-10">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">Proteinbar</h3>
          <p className="mt-2 text-sm text-zinc-600">
            Healthy food and performance-first meals.
          </p>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">Contact</h3>
          <div className="mt-2 space-y-1 text-sm text-zinc-600">
            <p>Email: contact@proteinbar.ma</p>
            <p>Phone: +212 000-000000</p>
            <p>Address: Casablanca, Morocco</p>
          </div>
        </div>
        <p className="text-xs text-zinc-500 sm:col-span-2">
          Copyright {new Date().getFullYear()} Proteinbar. All rights reserved.
        </p>
      </Container>
    </footer>
  );
}
