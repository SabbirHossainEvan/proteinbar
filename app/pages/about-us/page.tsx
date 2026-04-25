
import AboutHeroSection from "@/components/about/AboutHeroSection";
import AboutStorySection from "@/components/about/AboutStorySection";
import HealthyCustomersSection from "@/components/home/HealthyCustomersSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import { fetchWebsitePageContent } from "@/lib/homePageCms";

export default async function AboutUsPage() {
  const aboutPage = await fetchWebsitePageContent("about-us");

  return (
    <>
      <AboutHeroSection page={aboutPage} />
      <AboutStorySection />
      <HealthyCustomersSection />
      <TestimonialsSection />
    </>
  );
}
