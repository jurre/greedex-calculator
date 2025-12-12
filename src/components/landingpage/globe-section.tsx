import { getTranslations } from "next-intl/server";
import { AnimatedGroup } from "@/components/animated-group";
import Globe, { type Marker } from "@/components/ui/globe";

// EU country capitals/major cities coordinates
const EU_MARKERS: Marker[] = [
  { location: [52.52, 13.405], size: 0.08 }, // Berlin, Germany
  { location: [48.8566, 2.3522], size: 0.08 }, // Paris, France
  { location: [41.9028, 12.4964], size: 0.08 }, // Rome, Italy
  { location: [40.4168, -3.7038], size: 0.08 }, // Madrid, Spain
  { location: [52.3676, 4.9041], size: 0.07 }, // Amsterdam, Netherlands
  { location: [50.8503, 4.3517], size: 0.07 }, // Brussels, Belgium
  { location: [48.2082, 16.3738], size: 0.07 }, // Vienna, Austria
  { location: [59.3293, 18.0686], size: 0.07 }, // Stockholm, Sweden
  { location: [55.6761, 12.5683], size: 0.07 }, // Copenhagen, Denmark
  { location: [60.1699, 24.9384], size: 0.07 }, // Helsinki, Finland
  { location: [38.7223, -9.1393], size: 0.07 }, // Lisbon, Portugal
  { location: [53.3498, -6.2603], size: 0.07 }, // Dublin, Ireland
  { location: [50.0755, 14.4378], size: 0.07 }, // Prague, Czech Republic
  { location: [47.4979, 19.0402], size: 0.07 }, // Budapest, Hungary
  { location: [52.2297, 21.0122], size: 0.07 }, // Warsaw, Poland
  { location: [44.4268, 26.1025], size: 0.07 }, // Bucharest, Romania
  { location: [42.6977, 23.3219], size: 0.06 }, // Sofia, Bulgaria
  { location: [45.815, 15.9819], size: 0.06 }, // Zagreb, Croatia
  { location: [59.437, 24.7536], size: 0.06 }, // Tallinn, Estonia
  { location: [35.8989, 14.5146], size: 0.05 }, // Valletta, Malta
];

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

export async function GlobeSection() {
  const t = await getTranslations("LandingPage.globe");

  return (
    <section className="relative py-24 md:py-32">
      <div className="container relative z-10 mx-auto max-w-7xl px-6">
        <AnimatedGroup variants={transitionVariants}>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-6 font-semibold text-4xl tracking-tight md:text-5xl">
              {t("title")}
            </h2>
            <p className="mb-12 text-lg text-muted-foreground leading-relaxed">
              {t("description")}
            </p>
          </div>

          <div className="mx-auto max-w-4xl">
            <div className="relative aspect-square w-full overflow-hidden rounded-3xl border border-border/40 bg-card/30 p-4 shadow-2xl backdrop-blur-xl">
              <Globe
                markers={EU_MARKERS}
                className="h-full w-full"
                config={{
                  phi: 0.5,
                  theta: 0.3,
                  mapBrightness: 6,
                }}
              />
            </div>
          </div>

          <div className="mx-auto mt-12 max-w-2xl text-center">
            <p className="text-base text-muted-foreground">{t("subtitle")}</p>
          </div>
        </AnimatedGroup>
      </div>
    </section>
  );
}
