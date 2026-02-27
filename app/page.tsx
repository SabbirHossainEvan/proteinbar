import HeroSection from "@/components/home/HeroSection";
import IntroStatementSection from "@/components/home/IntroStatementSection";

import LocationsPreviewSection from "@/components/home/LocationsPreviewSection";
import MissionSection from "@/components/home/MissionSection";
import ExperienceSection from "@/components/home/ExperienceSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import HealthyCustomersSection from "@/components/home/HealthyCustomersSection";
import BrandValuesSection from "@/components/home/BrandValuesSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <IntroStatementSection />

      <LocationsPreviewSection />
      <MissionSection />
      <ExperienceSection />
      <BrandValuesSection />
      <HealthyCustomersSection />
      <TestimonialsSection />
    </>
  );
}
