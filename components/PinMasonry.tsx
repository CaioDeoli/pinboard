"use client";
import React, { useEffect, useRef, useState } from "react";
import DownloadIcon from "@/public/svgs/material-symbols-light--download-rounded.svg";
import MoreHorizIcon from "@/public/svgs/material-symbols-light--more-horiz.svg";
import BookmarkIcon from "@/public/svgs/material-symbols-light--bookmark-outline-rounded.svg";
import BookmarkAddIcon from "@/public/svgs/material-symbols-light--bookmark-add-outline-rounded.svg";
import Dropdown from "@/components/Dropdown";
import tagsData from "@/public/jsons/tags.json";

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

export type Pin = {
  id: string | number;
  src: string;
  alt?: string;
  width?: number; // optional intrinsic width
  height?: number; // optional intrinsic height
  title?: string;
  link?: string;
};

type Props = {
  items: Pin[];
  gutter?: number; // px
  onPinClick?: (pin: Pin) => void;
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

export default function PinMasonry({ items, gutter = 16, onPinClick }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [columnsCount, setColumnsCount] = useState<number>(2);
  const [columns, setColumns] = useState<Pin[][]>([]);
  const [tagListItems, setTagListItems] = useState<
    Array<{ id: string; label: string; onClick: () => void }>
  >([]);

  // Process tags data on component mount
  useEffect(() => {
    const processedTags = tagsData.map((tag, index) => ({
      id: (index + 1).toString(),
      label: tag.text,
      onClick: () => console.log(`Tag clicked: ${tag.href}`),
    }));
    setTagListItems(processedTags);
  }, []);

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
    const colWidth =
      (containerWidth - (columnsCount - 1) * gutter) / columnsCount;

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
            resolve({
              pin,
              ratio: (img.naturalHeight || 1) / (img.naturalWidth || 1),
            });
            return;
          }
          img.onload = () => {
            resolve({
              pin,
              ratio: (img.naturalHeight || 1) / (img.naturalWidth || 1),
            });
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

  const buttonClass =
    "outline-0 rounded-[5px] text-[var(--foreground)] text-[13px] font-[Mona_Sans] inline-flex items-center justify-center h-[var(--input-height)] transition";

  return (
    <div ref={containerRef} className="w-full" aria-live="polite">
      <div className="flex" style={{ columnGap: `${gutter}px` }}>
        {
          // If columns state isn't ready, render fallback columns to avoid layout shift
          (columns.length === columnsCount
            ? columns
            : Array.from({ length: columnsCount }, () => [])
          ).map((col, i) => (
            <div
              key={i}
              className="flex flex-1 flex-col"
              style={{ rowGap: `${gutter}px` }}
            >
              {col.map((pin) => (
                <figure
                  key={pin.id}
                  className="group relative cursor-pointer rounded-lg"
                  onClick={() => onPinClick && onPinClick(pin)}
                >
                  <img
                    src={pin.src}
                    alt={pin.alt ?? pin.title ?? "pin"}
                    loading="lazy"
                    className="block w-full rounded-lg"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 flex flex-col justify-between rounded-lg bg-black/50 p-3 opacity-0 transition-opacity group-hover:opacity-100">
                    {/* Top Save button */}
                    <div className="flex justify-end">
                      <Dropdown
                        searchable
                        searchPlaceholder="Search for a tag"
                        primaryAction={{
                          label: "New tag",
                          onClick: () => console.log("New Tag"),
                          icon: <BookmarkAddIcon className="mt-0.5 h-4 w-4" />,
                        }}
                        listItems={tagListItems}
                        menuAriaLabel="Save to tag menu"
                        menuWidthClass="w-[300px] max-w-[350px] p-1.5"
                      >
                        <button
                          type="button"
                          aria-haspopup="menu"
                          aria-expanded="false"
                          aria-label="Open save menu"
                          className={`${buttonClass} focus-visible:shadow-[0 0 0 3px var(--background-modifier-border-focus)] w-7.5 cursor-pointer bg-[var(--color-accent-600)] p-1 text-white shadow-[var(--input-shadow-small)] hover:bg-[var(--color-accent-500)] hover:shadow-[var(--input-shadow-hover)]`}
                        >
                          <BookmarkIcon className="h-4.5 w-4.5" />
                        </button>
                      </Dropdown>
                    </div>

                    {/* Bottom row buttons */}
                    <div className="flex justify-end gap-2">
                      {pin.link && (
                        <a
                          href={pin.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`${buttonClass} focus-visible:shadow-[0 0 0 3px var(--background-modifier-border-focus)] flex-1 bg-[var(--color-base-300)] px-3 py-1 shadow-[var(--input-shadow)] hover:bg-[var(--color-base-350)] hover:shadow-[var(--input-shadow-hover)]`}
                        >
                          Visit site
                        </a>
                      )}
                      <button
                        type="button"
                        className={`${buttonClass} focus-visible:shadow-[0 0 0 3px var(--background-modifier-border-focus)] w-7.5 cursor-pointer bg-[var(--color-base-300)] p-1 shadow-[var(--input-shadow-small)] hover:bg-[var(--color-base-350)] hover:shadow-[var(--input-shadow-hover)]`}
                      >
                        <DownloadIcon className="h-4.5 w-4.5" />
                      </button>
                      <Dropdown
                        items={[
                          { label: "Edit", onClick: () => console.log("Edit") },
                          {
                            label: "Delete",
                            onClick: () => console.log("Delete"),
                          },
                          {
                            label: "Share",
                            onClick: () => console.log("Share"),
                          },
                        ]}
                      >
                        <button
                          type="button"
                          className={`${buttonClass} focus-visible:shadow-[0 0 0 3px var(--background-modifier-border-focus)] w-7.5 cursor-pointer bg-[var(--color-base-300)] p-1 shadow-[var(--input-shadow-small)] hover:bg-[var(--color-base-350)] hover:shadow-[var(--input-shadow-hover)]`}
                        >
                          <MoreHorizIcon className="h-4.5 w-4.5" />
                        </button>
                      </Dropdown>
                    </div>
                  </div>
                </figure>
              ))}
            </div>
          ))
        }
      </div>
    </div>
  );
}
