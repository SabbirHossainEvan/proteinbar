import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Container from "@/components/ui/Container";
import Providers from "./providers";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

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
      <body className={`${poppins.className} min-h-screen overflow-x-hidden bg-white text-zinc-900 antialiased`}>
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
