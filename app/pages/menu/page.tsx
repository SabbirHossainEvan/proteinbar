import { Suspense } from "react";
import ManuPageContainer from "./ManuPageContainer";
import { fetchWebsitePageContent } from "@/lib/homePageCms";

export default async function MenuPage() {
  const menuPage = await fetchWebsitePageContent("menu");

  return (
    <Suspense fallback={null}>
      <ManuPageContainer page={menuPage} />
    </Suspense>
  );
}
