"use client";

import { AnimatedGroup } from "@/components/animated-group";
import { EU_CITIES } from "@/components/landingpage/eu-cities";
import { Globe } from "@/components/ui/globe";

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

export function GlobeSection() {
  return (
    <section className="relative py-20 md:py-32">
      <div className="container mx-auto max-w-7xl px-6">
        <AnimatedGroup variants={transitionVariants}>
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <h2 className="mb-4 font-semibold text-3xl tracking-tight md:text-4xl lg:text-5xl">
              Connect Across Europe
            </h2>
            <p className="text-base text-muted-foreground md:text-lg">
              Join organizations from all EU countries working together for a
              sustainable future. Our platform connects environmental initiatives
              across borders.
            </p>
          </div>

          <div className="flex items-center justify-center">
            <Globe
              cities={EU_CITIES}
              className="mx-auto"
              config={{
                width: 600,
                height: 600,
              }}
            />
          </div>

          <div className="mx-auto mt-12 max-w-4xl">
            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-2xl border border-border/40 bg-card/30 p-6 text-center backdrop-blur-xl">
                <div className="mb-2 font-semibold text-3xl text-primary">27</div>
                <p className="text-muted-foreground text-sm">EU Countries</p>
              </div>
              <div className="rounded-2xl border border-border/40 bg-card/30 p-6 text-center backdrop-blur-xl">
                <div className="mb-2 font-semibold text-3xl text-primary">
                  100+
                </div>
                <p className="text-muted-foreground text-sm">
                  Active Organizations
                </p>
              </div>
              <div className="rounded-2xl border border-border/40 bg-card/30 p-6 text-center backdrop-blur-xl">
                <div className="mb-2 font-semibold text-3xl text-primary">
                  1000+
                </div>
                <p className="text-muted-foreground text-sm">
                  Environmental Projects
                </p>
              </div>
            </div>
          </div>
        </AnimatedGroup>
      </div>
    </section>
  );
}
