"use client";

import createGlobe from "cobe";
import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

export interface Marker {
  location: [number, number]; // [latitude, longitude]
  size: number;
}

export interface GlobeProps {
  className?: string;
  markers?: Marker[];
  config?: {
    devicePixelRatio?: number;
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
    scale?: number;
    offset?: [number, number];
  };
}

export function Globe({ className, markers = [], config = {} }: GlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    let phi = config.phi ?? 0;
    let width = 0;
    const onResize = () =>
      canvasRef.current && (width = canvasRef.current.offsetWidth);
    window.addEventListener("resize", onResize);
    onResize();

    if (!canvasRef.current) return;

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: config.devicePixelRatio ?? 2,
      width: config.width ?? 600 * 2,
      height: config.height ?? 600 * 2,
      phi: phi,
      theta: config.theta ?? 0.3,
      dark: config.dark ?? (isDark ? 1 : 0),
      diffuse: config.diffuse ?? 1.2,
      mapSamples: config.mapSamples ?? 16000,
      mapBrightness: config.mapBrightness ?? (isDark ? 4 : 6),
      baseColor: config.baseColor ?? (isDark ? [0.3, 0.3, 0.3] : [1, 1, 1]),
      markerColor: config.markerColor ?? [0.1, 0.8, 1],
      glowColor: config.glowColor ?? (isDark ? [1, 1, 1] : [0.5, 0.5, 0.5]),
      markers: markers,
      scale: config.scale ?? 1,
      offset: config.offset ?? [0, 0],
      onRender: (state) => {
        // Called on every animation frame.
        // `state` will be an empty object, return updated params.
        if (!pointerInteracting.current) {
          // Auto-rotate when not interacting
          phi += 0.005;
        }
        state.phi = phi + pointerInteractionMovement.current;
        state.width = width * 2;
        state.height = width * 2;
      },
    });

    setTimeout(() => (canvasRef.current!.style.opacity = "1"));

    return () => {
      globe.destroy();
      window.removeEventListener("resize", onResize);
    };
  }, [
    markers,
    isDark,
    config.devicePixelRatio,
    config.width,
    config.height,
    config.phi,
    config.theta,
    config.dark,
    config.diffuse,
    config.mapSamples,
    config.mapBrightness,
    config.baseColor,
    config.markerColor,
    config.glowColor,
    config.scale,
    config.offset,
  ]);

  return (
    <div className={className}>
      <canvas
        ref={canvasRef}
        onPointerDown={(e) => {
          pointerInteracting.current =
            e.clientX - pointerInteractionMovement.current;
          canvasRef.current!.style.cursor = "grabbing";
        }}
        onPointerUp={() => {
          pointerInteracting.current = null;
          canvasRef.current!.style.cursor = "grab";
        }}
        onPointerOut={() => {
          pointerInteracting.current = null;
          canvasRef.current!.style.cursor = "grab";
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
