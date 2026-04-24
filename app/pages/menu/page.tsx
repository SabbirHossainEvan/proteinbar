import { Suspense } from "react";
import ManuPageContainer from "./ManuPageContainer";

export default function MenuPage() {
  return (
    <Suspense fallback={null}>
      <ManuPageContainer />
    </Suspense>
  );
}