"use client";

import createGlobe from "cobe";
import { useCallback, useEffect, useRef } from "react";
import { useTheme } from "next-themes";

interface Marker {
  location: [number, number]; // [latitude, longitude]
  size: number;
}

interface GlobeProps {
  className?: string;
  markers?: Marker[];
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
    offset?: [number, number];
    scale?: number;
  };
}

export function Globe({ className = "", markers = [], config = {} }: GlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);
  const { theme } = useTheme();

  const updatePointerInteraction = (value: number | null) => {
    pointerInteracting.current = value;
    if (canvasRef.current) {
      canvasRef.current.style.cursor = value ? "grabbing" : "grab";
    }
  };

  const updateMovement = (clientX: number) => {
    if (pointerInteracting.current !== null) {
      const delta = clientX - pointerInteracting.current;
      pointerInteractionMovement.current = delta;
      updatePointerInteraction(clientX);
    }
  };

  const onRender = useCallback(
    (state: Record<string, any>) => {
      if (!pointerInteracting.current) {
        // Auto-rotate when not interacting
        state.phi = state.phi + 0.003;
      }
      state.width = config.width || 600;
      state.height = config.height || 600;
    },
    [config.width, config.height]
  );

  useEffect(() => {
    let phi = config.phi || 0;
    let width = 0;
    const doublePi = Math.PI * 2;

    if (!canvasRef.current) return;

    const isDark = theme === "dark";

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: config.devicePixelRatio || 2,
      width: config.width || 600,
      height: config.height || 600,
      phi: config.phi || 0,
      theta: config.theta || 0.3,
      dark: isDark ? 1 : 0,
      diffuse: config.diffuse || 0.4,
      mapSamples: config.mapSamples || 16000,
      mapBrightness: isDark
        ? config.mapBrightness || 1.2
        : config.mapBrightness || 6,
      baseColor: config.baseColor || (isDark ? [0.3, 0.3, 0.3] : [1, 1, 1]),
      markerColor: config.markerColor || [0.1, 0.8, 1],
      glowColor: config.glowColor || (isDark ? [0.2, 0.2, 0.2] : [1, 1, 1]),
      markers: markers,
      onRender,
      scale: config.scale || 1,
      offset: config.offset || [0, 0],
    });

    setTimeout(() => {
      if (canvasRef.current) {
        canvasRef.current.style.opacity = "1";
      }
    });

    return () => {
      globe.destroy();
    };
  }, [
    theme,
    markers,
    config.devicePixelRatio,
    config.width,
    config.height,
    config.phi,
    config.theta,
    config.diffuse,
    config.mapSamples,
    config.mapBrightness,
    config.baseColor,
    config.markerColor,
    config.glowColor,
    config.scale,
    config.offset,
    onRender,
  ]);

  return (
    <div className={className}>
      <canvas
        ref={canvasRef}
        onPointerDown={(e) =>
          updatePointerInteraction(
            e.clientX - pointerInteractionMovement.current
          )
        }
        onPointerUp={() => updatePointerInteraction(null)}
        onPointerOut={() => updatePointerInteraction(null)}
        onMouseMove={(e) => updateMovement(e.clientX)}
        onTouchMove={(e) =>
          e.touches[0] && updateMovement(e.touches[0].clientX)
        }
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
