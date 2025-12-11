"use client";

import { Globe, type Marker } from "@/components/ui/globe";
import { TextEffect } from "@/components/ui/text-effect";

// EU country capitals coordinates (latitude, longitude)
const EU_MARKERS: Marker[] = [
  { location: [52.52, 13.405], size: 0.05 }, // Berlin, Germany
  { location: [48.8566, 2.3522], size: 0.05 }, // Paris, France
  { location: [41.9028, 12.4964], size: 0.05 }, // Rome, Italy
  { location: [40.4168, -3.7038], size: 0.05 }, // Madrid, Spain
  { location: [52.3676, 4.9041], size: 0.05 }, // Amsterdam, Netherlands
  { location: [50.8503, 4.3517], size: 0.05 }, // Brussels, Belgium
  { location: [50.0755, 14.4378], size: 0.05 }, // Prague, Czech Republic
  { location: [59.3293, 18.0686], size: 0.05 }, // Stockholm, Sweden
  { location: [55.6761, 12.5683], size: 0.05 }, // Copenhagen, Denmark
  { location: [48.2082, 16.3738], size: 0.05 }, // Vienna, Austria
  { location: [52.2297, 21.0122], size: 0.05 }, // Warsaw, Poland
  { location: [47.4979, 19.0402], size: 0.05 }, // Budapest, Hungary
  { location: [38.7223, -9.1393], size: 0.05 }, // Lisbon, Portugal
  { location: [37.9838, 23.7275], size: 0.05 }, // Athens, Greece
  { location: [44.4268, 26.1025], size: 0.05 }, // Bucharest, Romania
  { location: [42.6977, 23.3219], size: 0.05 }, // Sofia, Bulgaria
  { location: [45.4642, 9.19], size: 0.05 }, // Milan, Italy (additional)
  { location: [53.3498, -6.2603], size: 0.05 }, // Dublin, Ireland
  { location: [60.1699, 24.9384], size: 0.05 }, // Helsinki, Finland
  { location: [59.9139, 10.7522], size: 0.05 }, // Oslo, Norway (not EU, but EEA)
  { location: [46.2044, 6.1432], size: 0.05 }, // Geneva, Switzerland (not EU, but central)
  { location: [45.815, 15.9819], size: 0.05 }, // Zagreb, Croatia
  { location: [35.8989, 14.5146], size: 0.05 }, // Valletta, Malta
  { location: [35.1856, 33.3823], size: 0.05 }, // Nicosia, Cyprus
];

export function GlobeSection() {
  return (
    <section className="relative overflow-hidden bg-background py-24 md:py-32">
      <div className="container mx-auto max-w-7xl px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left side - Text content */}
          <div className="flex flex-col justify-center space-y-6">
            <TextEffect
              preset="fade-in-blur"
              speedSegment={0.3}
              as="h2"
              className="font-semibold text-4xl tracking-tight md:text-5xl xl:text-6xl"
            >
              Connecting Europe for a Greener Future
            </TextEffect>

            <TextEffect
              per="line"
              preset="fade-in-blur"
              speedSegment={0.5}
              delay={0.2}
              as="p"
              className="max-w-xl text-balance text-lg text-muted-foreground leading-relaxed"
            >
              Our mission spans across the European Union, bringing together
              organizations, educators, and communities committed to environmental
              sustainability and carbon neutrality.
            </TextEffect>

            <TextEffect
              per="line"
              preset="fade-in-blur"
              speedSegment={0.5}
              delay={0.4}
              as="p"
              className="max-w-xl text-balance text-base text-muted-foreground leading-relaxed"
            >
              Join a network of forward-thinking partners working together to
              measure, reduce, and offset carbon emissions through education and
              practical action.
            </TextEffect>
          </div>

          {/* Right side - Globe */}
          <div className="relative flex items-center justify-center">
            <div className="relative aspect-square w-full max-w-[600px]">
              <Globe
                className="absolute inset-0"
                markers={EU_MARKERS}
                config={{
                  phi: 0,
                  theta: 0.3,
                  mapSamples: 20000,
                  mapBrightness: 6,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
