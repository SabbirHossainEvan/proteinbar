import HeroSection from "@/components/home/HeroSection";
import IntroStatementSection from "@/components/home/IntroStatementSection";
import LocationsPreviewSection from "@/components/home/LocationsPreviewSection";
import MissionSection from "@/components/home/MissionSection";
import ExperienceSection from "@/components/home/ExperienceSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import HealthyCustomersSection from "@/components/home/HealthyCustomersSection";
import BrandValuesSection from "@/components/home/BrandValuesSection";
import { fetchHomePageContent, getHomeSection } from "@/lib/homePageCms";

export default async function HomePage() {
  const homePage = await fetchHomePageContent();

  return (
    <>
      <HeroSection page={homePage} />
      <IntroStatementSection section={getHomeSection(homePage, "intro-statement")} />
      <LocationsPreviewSection section={getHomeSection(homePage, "locations-preview")} />
      <MissionSection section={getHomeSection(homePage, "mission")} />
      <ExperienceSection section={getHomeSection(homePage, "experience")} />
      <BrandValuesSection section={getHomeSection(homePage, "brand-values")} />
      <HealthyCustomersSection section={getHomeSection(homePage, "healthy-customers")} />
      <TestimonialsSection section={getHomeSection(homePage, "testimonials")} />
    </>
  );
}
