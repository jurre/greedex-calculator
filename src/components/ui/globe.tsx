"use client";

import createGlobe from "cobe";
import { useCallback, useEffect, useRef } from "react";
import { useTheme } from "next-themes";

export interface City {
  name: string;
  lat: number;
  lng: number;
}

interface GlobeProps {
  cities?: City[];
  className?: string;
  config?: {
    width?: number;
    height?: number;
    devicePixelRatio?: number;
    phi?: number;
    theta?: number;
    dark?: number;
    diffuse?: number;
    mapSamples?: number;
    mapBrightness?: number;
    baseColor?: [number, number, number];
    markerColor?: [number, number, number];
    glowColor?: [number, number, number];
  };
}

export function Globe({ cities = [], className = "", config = {} }: GlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const onRender = useCallback(
    (state: Record<string, any>) => {
      // Auto-rotate the globe
      if (!pointerInteracting.current) {
        state.phi = state.phi + 0.003;
      }
      state.width = config.width ?? 600;
      state.height = config.height ?? 600;
    },
    [config.width, config.height]
  );

  useEffect(() => {
    let phi = config.phi ?? 0;
    let width = 0;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const globe = createGlobe(canvas, {
      devicePixelRatio: config.devicePixelRatio ?? 2,
      width: config.width ?? 600 * 2,
      height: config.height ?? 600 * 2,
      phi: phi,
      theta: config.theta ?? 0.3,
      dark: config.dark ?? (isDark ? 1 : 0),
      diffuse: config.diffuse ?? (isDark ? 0.4 : 1.2),
      mapSamples: config.mapSamples ?? 16000,
      mapBrightness: config.mapBrightness ?? (isDark ? 1.2 : 6),
      baseColor: config.baseColor ?? (isDark ? [0.1, 0.1, 0.1] : [1, 1, 1]),
      markerColor: config.markerColor ?? [0.1, 0.8, 1],
      glowColor: config.glowColor ?? (isDark ? [0.1, 0.1, 0.1] : [1, 1, 1]),
      markers: cities.map((city) => ({
        location: [city.lat, city.lng],
        size: 0.05,
      })),
      onRender,
    });

    return () => {
      globe.destroy();
    };
  }, [cities, onRender, isDark, config]);

  return (
    <div className={className}>
      <canvas
        ref={canvasRef}
        style={{
          width: config.width ?? 600,
          height: config.height ?? 600,
          maxWidth: "100%",
          aspectRatio: "1",
        }}
        onPointerDown={(e) => {
          pointerInteracting.current =
            e.clientX - pointerInteractionMovement.current;
          if (canvasRef.current) {
            canvasRef.current.style.cursor = "grabbing";
          }
        }}
        onPointerUp={() => {
          pointerInteracting.current = null;
          if (canvasRef.current) {
            canvasRef.current.style.cursor = "grab";
          }
        }}
        onPointerOut={() => {
          pointerInteracting.current = null;
          if (canvasRef.current) {
            canvasRef.current.style.cursor = "grab";
          }
        }}
        onMouseMove={(e) => {
          if (pointerInteracting.current !== null) {
            const delta = e.clientX - pointerInteracting.current;
            pointerInteractionMovement.current = delta;
          }
        }}
        onTouchMove={(e) => {
          if (pointerInteracting.current !== null && e.touches[0]) {
            const delta = e.touches[0].clientX - pointerInteracting.current;
            pointerInteractionMovement.current = delta;
          }
        }}
      />
    </div>
  );
}
