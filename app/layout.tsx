import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Container from "@/components/ui/Container";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "Proteinbar",
  description: "Proteinbar storefront"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="overflow-x-hidden">
      <body className="min-h-screen overflow-x-hidden bg-zinc-50 text-zinc-900 antialiased">
        <Providers>
          <div className="flex min-h-screen max-w-full flex-col overflow-x-hidden">
            <Header />
            <main className="flex-1 py-8 sm:py-10">
              <Container>{children}</Container>
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
