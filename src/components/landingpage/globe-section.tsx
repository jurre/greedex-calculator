"use client";

import { useTranslations } from "next-intl";
import { AnimatedGroup } from "@/components/animated-group";
import { Globe } from "@/components/ui/globe";

// Major EU cities with coordinates [latitude, longitude]
// These can be passed as props to make the component reusable
const DEFAULT_EU_MARKERS = [
  { location: [52.52, 13.405] as [number, number], size: 0.05 }, // Berlin, Germany
  { location: [48.8566, 2.3522] as [number, number], size: 0.05 }, // Paris, France
  { location: [41.9028, 12.4964] as [number, number], size: 0.05 }, // Rome, Italy
  { location: [40.4168, -3.7038] as [number, number], size: 0.05 }, // Madrid, Spain
  { location: [52.3676, 4.9041] as [number, number], size: 0.05 }, // Amsterdam, Netherlands
  { location: [50.8503, 4.3517] as [number, number], size: 0.05 }, // Brussels, Belgium
  { location: [48.2082, 16.3738] as [number, number], size: 0.05 }, // Vienna, Austria
  { location: [50.0755, 14.4378] as [number, number], size: 0.05 }, // Prague, Czech Republic
  { location: [59.3293, 18.0686] as [number, number], size: 0.05 }, // Stockholm, Sweden
  { location: [55.6761, 12.5683] as [number, number], size: 0.05 }, // Copenhagen, Denmark
  { location: [38.7223, -9.1393] as [number, number], size: 0.05 }, // Lisbon, Portugal
  { location: [53.3498, -6.2603] as [number, number], size: 0.05 }, // Dublin, Ireland
  { location: [47.4979, 19.0402] as [number, number], size: 0.05 }, // Budapest, Hungary
  { location: [44.4268, 26.1025] as [number, number], size: 0.05 }, // Bucharest, Romania
  { location: [52.2297, 21.0122] as [number, number], size: 0.05 }, // Warsaw, Poland
];

interface GlobeSectionProps {
  markers?: Array<{ location: [number, number]; size: number }>;
  className?: string;
}

const transitionVariants = {
  item: {
    hidden: {
      opacity: 0,
      filter: "blur(12px)",
      y: 12,
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: {
        type: "spring",
        bounce: 0.3,
        duration: 1.5,
      },
    },
  },
} as const;

export function GlobeSection({
  markers = DEFAULT_EU_MARKERS,
  className = "",
}: GlobeSectionProps) {
  const t = useTranslations("LandingPage.globe");

  return (
    <section className={`relative overflow-hidden py-16 md:py-24 ${className}`}>
      <div className="container mx-auto max-w-7xl px-6">
        <AnimatedGroup
          variants={{
            container: {
              visible: {
                transition: {
                  staggerChildren: 0.05,
                  delayChildren: 0.2,
                },
              },
            },
            ...transitionVariants,
          }}
        >
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <h2 className="mb-4 font-semibold text-4xl tracking-tight md:text-5xl">
              {t("title", { defaultValue: "Our European Network" })}
            </h2>
            <p className="text-balance text-lg text-muted-foreground">
              {t("description", {
                defaultValue:
                  "Connecting environmental initiatives across Europe, fostering collaboration and sustainable growth.",
              })}
            </p>
          </div>

          <div className="relative mx-auto flex aspect-square w-full max-w-[600px] items-center justify-center">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--primary)_0%,_transparent_70%)] opacity-20" />
            <Globe
              className="h-full w-full"
              markers={markers}
              config={{
                width: 600,
                height: 600,
                phi: 0.5,
                theta: 0.3,
                mapBrightness: 6,
                scale: 1.1,
              }}
            />
          </div>
        </AnimatedGroup>
      </div>
    </section>
  );
}
