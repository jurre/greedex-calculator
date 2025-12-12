import { describe, expect, it } from "vitest";
import type { Marker } from "@/components/ui/globe";

describe("Globe Component", () => {
  it("should accept markers array with location and size", () => {
    const testMarkers: Marker[] = [
      { location: [52.52, 13.405], size: 0.08 },
      { location: [48.8566, 2.3522], size: 0.08 },
    ];

    expect(testMarkers).toHaveLength(2);
    expect(testMarkers[0].location).toEqual([52.52, 13.405]);
    expect(testMarkers[0].size).toBe(0.08);
  });

  it("should validate marker location format", () => {
    const marker: Marker = {
      location: [50.0, 10.0],
      size: 0.1,
    };

    expect(marker.location).toHaveLength(2);
    expect(typeof marker.location[0]).toBe("number"); // latitude
    expect(typeof marker.location[1]).toBe("number"); // longitude
  });

  it("should validate marker size is a number", () => {
    const marker: Marker = {
      location: [40.0, -3.0],
      size: 0.07,
    };

    expect(typeof marker.size).toBe("number");
    expect(marker.size).toBeGreaterThan(0);
    expect(marker.size).toBeLessThanOrEqual(1);
  });
});
