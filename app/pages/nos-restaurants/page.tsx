import LocationsDeliverySection from "@/components/locations/LocationsDeliverySection";
import LocationsHeroSection from "@/components/locations/LocationsHeroSection";
import LocationsShowcaseSection from "@/components/locations/LocationsShowcaseSection";
import { fetchWebsitePageContent } from "@/lib/homePageCms";

export default async function RestaurantsPage() {
  const locationsPage = await fetchWebsitePageContent("locations");

  return (
    <>
      <LocationsHeroSection page={locationsPage} />
      <LocationsDeliverySection
        section={locationsPage?.sections.find((section) => section.sectionKey === "delivery-overview")}
      />
      <LocationsShowcaseSection />
    </>
  );
}
