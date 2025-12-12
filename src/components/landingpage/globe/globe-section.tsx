"use client";

import { useTranslations } from "next-intl";
import { AnimatedGroup } from "@/components/animated-group";
import { Globe, type Marker } from "@/components/ui/globe";
import { TextEffect } from "@/components/ui/text-effect";

interface GlobeSectionProps {
  markers?: Marker[];
}

export function GlobeSection({ markers = [] }: GlobeSectionProps) {
  const t = useTranslations("LandingPage.globe");

  return (
    <section className="relative bg-background py-20 md:py-32">
      <div className="container mx-auto max-w-7xl px-6">
        <AnimatedGroup
          variants={{
            container: {
              visible: {
                transition: {
                  staggerChildren: 0.1,
                },
              },
            },
            item: {
              hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
              visible: {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                transition: {
                  duration: 0.6,
                  ease: "easeOut",
                },
              },
            },
          }}
        >
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Left side - Text content */}
            <div className="flex flex-col justify-center space-y-6">
              <TextEffect
                preset="fade-in-blur"
                speedSegment={0.3}
                as="h2"
                className="text-balance font-semibold text-4xl tracking-tight md:text-5xl lg:text-6xl"
              >
                {t("title")}
              </TextEffect>

              <TextEffect
                per="line"
                preset="fade-in-blur"
                speedSegment={0.5}
                delay={0.2}
                as="p"
                className="text-balance text-base text-muted-foreground leading-relaxed md:text-lg"
              >
                {t("description")}
              </TextEffect>

              <div className="flex flex-wrap gap-4 pt-4">
                <div className="rounded-full border border-primary/50 bg-primary/10 px-6 py-3">
                  <span className="font-semibold text-primary text-sm">
                    {t("stat1")}
                  </span>
                </div>
                <div className="rounded-full border border-border bg-muted/50 px-6 py-3">
                  <span className="font-medium text-muted-foreground text-sm">
                    {t("stat2")}
                  </span>
                </div>
              </div>
            </div>

            {/* Right side - Globe */}
            <div className="flex items-center justify-center">
              <div className="relative aspect-square w-full max-w-[600px]">
                <Globe
                  className="h-full w-full"
                  markers={markers}
                  config={{
                    phi: 0.5,
                    theta: 0.3,
                  }}
                />
              </div>
            </div>
          </div>
        </AnimatedGroup>
      </div>
    </section>
  );
}
