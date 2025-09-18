"use client";
import React, { useEffect, useRef, useState } from "react";

/**
 * PinMasonry.tsx
 * React + TypeScript component that creates a masonry layout
 * Uses Tailwind classes for styling. No CSS Grid used.
 *
 * How it works:
 * - Observes container width (ResizeObserver) and maps it to 'columns' using your breakpoints
 * - Loads image natural sizes (unless width/height are provided) to compute aspect ratios
 * - Distributes items into columns by the "shortest column" heuristic using estimated heights
 *
 * Usage:
 * <PinMasonry items={dummyPins} gutter={16} />
 *
 * Items shape:
 * { id: string|number, src: string, alt?: string, width?: number, height?: number, title?: string }
 */

type Pin = {
  id: string | number;
  src: string;
  alt?: string;
  width?: number; // optional intrinsic width
  height?: number; // optional intrinsic height
  title?: string;
};

type Props = {
  items: Pin[];
  gutter?: number; // px
};

// Breakpoints mapping based on the table you provided
function columnsForWidth(width: number) {
  if (width >= 2458) return 10;
  if (width >= 2221) return 9;
  if (width >= 1984) return 8;
  if (width >= 1747) return 7;
  if (width >= 1510) return 6;
  if (width >= 1273) return 5;
  if (width >= 1036) return 4;
  if (width >= 799) return 3;
  if (width >= 562) return 2;
  return 1;
}

export default function PinMasonry({ items, gutter = 16 }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [columnsCount, setColumnsCount] = useState<number>(2);
  const [columns, setColumns] = useState<Pin[][]>([]);

  // Observe container width and update columnsCount
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = entry.contentRect.width;
        const cols = columnsForWidth(Math.round(w));
        setColumnsCount(cols);
      }
    });

    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // When items or columnsCount change, compute aspect ratios and distribute
  useEffect(() => {
    if (!containerRef.current) return;
    const containerWidth = containerRef.current.clientWidth;
    const colWidth = (containerWidth - (columnsCount - 1) * gutter) / columnsCount;

    // helper to get ratio (height/width) for a pin
    const loadAll = async () => {
      // create array of promises that resolve to {pin, ratio}
      const promises = items.map((pin) => {
        return new Promise<{ pin: Pin; ratio: number }>((resolve) => {
          if (pin.width && pin.height) {
            resolve({ pin, ratio: pin.height / pin.width });
            return;
          }

          // load image to read natural dimensions
          const img = new Image();
          img.src = pin.src;
          if (img.complete) {
            // already cached
            resolve({ pin, ratio: (img.naturalHeight || 1) / (img.naturalWidth || 1) });
            return;
          }
          img.onload = () => {
            resolve({ pin, ratio: (img.naturalHeight || 1) / (img.naturalWidth || 1) });
          };
          img.onerror = () => {
            // fallback: square
            resolve({ pin, ratio: 1 });
          };
        });
      });

      const loaded = await Promise.all(promises);

      // distribute into shortest column (balance by est. height)
      const cols: Pin[][] = Array.from({ length: columnsCount }, () => []);
      const heights: number[] = Array.from({ length: columnsCount }, () => 0);

      for (const entry of loaded) {
        const estH = colWidth * entry.ratio;
        // pick shortest column index
        let idx = 0;
        let min = heights[0];
        for (let i = 1; i < heights.length; i++) {
          if (heights[i] < min) {
            min = heights[i];
            idx = i;
          }
        }
        cols[idx].push(entry.pin);
        heights[idx] += estH + gutter; // include gutter as spacing
      }

      setColumns(cols);
    };

    loadAll();
  }, [items, columnsCount, gutter]);

  return (
    <div ref={containerRef} className="w-full" aria-live="polite">
      <div className="flex gap-4" style={{ columnGap: `${gutter}px` }}>
        { // If columns state isn't ready, render fallback columns to avoid layout shift
          (columns.length === columnsCount ? columns : Array.from({ length: columnsCount }, () => [])).map((col, i) => (
          <div key={i} className="flex-1 flex flex-col gap-4">
            {col.map((pin) => (
              <figure key={pin.id} className="rounded-2xl overflow-hidden bg-gray-100">
                <img
                  src={pin.src}
                  alt={pin.alt ?? pin.title ?? "pin"}
                  loading="lazy"
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                  className="block w-full"
                />
                {/* {pin.title && (
                  <figcaption className="p-2 text-sm text-gray-700">{pin.title}</figcaption>
                )} */}
              </figure>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
