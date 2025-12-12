"use client";

import createGlobe from "cobe";
import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

export interface Marker {
  location: [number, number]; // [latitude, longitude]
  size: number;
}

interface GlobeProps {
  className?: string;
  markers?: Marker[];
  config?: {
    width?: number;
    height?: number;
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

export default function Globe({
  className = "",
  markers = [],
  config = {},
}: GlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);
  const { theme } = useTheme();

  useEffect(() => {
    let phi = config.phi || 0;
    let width = 0;
    const onResize = () =>
      canvasRef.current && (width = canvasRef.current.offsetWidth);
    window.addEventListener("resize", onResize);
    onResize();

    if (!canvasRef.current) return;

    const isDark = theme === "dark";

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: config.width || width * 2,
      height: config.height || width * 2,
      phi: phi,
      theta: config.theta || 0.3,
      dark: config.dark !== undefined ? config.dark : isDark ? 1 : 0,
      diffuse: config.diffuse || 1.2,
      mapSamples: config.mapSamples || 16000,
      mapBrightness: config.mapBrightness || (isDark ? 6 : 6),
      baseColor: config.baseColor || (isDark ? [0.3, 0.3, 0.3] : [1, 1, 1]),
      markerColor: config.markerColor || [0.1, 0.8, 1],
      glowColor: config.glowColor || (isDark ? [1, 1, 1] : [0.5, 0.5, 0.5]),
      markers: markers,
      onRender: (state) => {
        // Auto-rotate the globe
        if (!pointerInteracting.current) {
          phi += 0.005;
        }
        state.phi = phi + pointerInteractionMovement.current;
        state.width = config.width || width * 2;
        state.height = config.height || width * 2;
      },
    });

    setTimeout(() => {
      if (canvasRef.current) {
        canvasRef.current.style.opacity = "1";
      }
    });

    return () => {
      globe.destroy();
      window.removeEventListener("resize", onResize);
    };
  }, [theme, markers, config]);

  return (
    <div className={className}>
      <canvas
        ref={canvasRef}
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
          if (pointerInteracting.current !== null && e.targetTouches[0]) {
            const delta = e.targetTouches[0].clientX - pointerInteracting.current;
            pointerInteractionMovement.current = delta;
          }
        }}
        style={{
          width: "100%",
          height: "100%",
          cursor: "grab",
          contain: "layout paint size",
          opacity: 0,
          transition: "opacity 1s ease",
        }}
      />
    </div>
  );
}
