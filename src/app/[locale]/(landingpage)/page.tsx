import { EU_COUNTRIES_MARKERS } from "@/components/landingpage/globe/eu-markers";
import { GlobeSection } from "@/components/landingpage/globe/globe-section";
import { HeroSection } from "@/components/landingpage/hero-section";
import { WorkshopsHeroSection } from "@/components/landingpage/workshops/workshops-hero-section";

export default function LandingPage() {
  return (
    <main className="relative overflow-hidden">
      <HeroSection />

      <GlobeSection markers={EU_COUNTRIES_MARKERS} />

      <WorkshopsHeroSection />
    </main>
  );
}
