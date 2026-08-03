import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Meal Prep | Proteinbar",
  description: "Choose a Proteinbar meal prep plan built around your goals.",
  alternates: {
    canonical: "https://mealprep.proteinbargroup.com",
  },
  openGraph: {
    url: "https://mealprep.proteinbargroup.com",
  },
};

export { default } from "@/app/pages/monthly-plan/page";
