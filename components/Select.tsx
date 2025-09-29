"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import tagsData from "@/public/jsons/tags.json";

type TagItem = {
  text: string;
  href: string;
};

type SelectProps = {
  placeholder?: string;
  className?: string;
  defaultSelected?: TagItem[];
  onChange?: (selected: TagItem[]) => void;
  disabled?: boolean;
};

export default function Select({
  placeholder = "Tags",
  className = "",
  defaultSelected,
  onChange,
  disabled = false,
}: SelectProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const listboxId = useMemo(
    () => `select-listbox-${Math.random().toString(36).slice(2)}`,
    [],
  );

  const [open, setOpen] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const [selected, setSelected] = useState<TagItem[]>(
    () => defaultSelected ?? [],
  );
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const allOptions: TagItem[] = useMemo(() => {
    return (tagsData as TagItem[]).filter(
      (t) => t && typeof t.text === "string",
    );
  }, []);

  const available = useMemo(() => {
    const lowerQuery = query.trim().toLowerCase();
    const selectedSet = new Set(selected.map((s) => `${s.text}|${s.href}`));
    return allOptions
      .filter((opt) => !selectedSet.has(`${opt.text}|${opt.href}`))
      .filter((opt) =>
        lowerQuery ? opt.text.toLowerCase().includes(lowerQuery) : true,
      );
  }, [allOptions, query, selected]);

  useEffect(() => {
    onChange?.(selected);
  }, [selected, onChange]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setActiveIndex(0);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function addTag(tag: TagItem) {
    setSelected((prev) => [...prev, tag]);
    setQuery("");
    setOpen(true);
    setActiveIndex(0);
    inputRef.current?.focus();
  }

  function removeTag(tag: TagItem) {
    setSelected((prev) =>
      prev.filter((t) => !(t.text === tag.text && t.href === tag.href)),
    );
    setOpen(true);
    inputRef.current?.focus();
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && query.length === 0 && selected.length > 0) {
      e.preventDefault();
      setSelected((prev) => prev.slice(0, -1));
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActiveIndex((i) => Math.min(i + 1, Math.max(available.length - 1, 0)));
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();
      if (available.length > 0) {
        addTag(
          available[Math.max(Math.min(activeIndex, available.length - 1), 0)],
        );
      }
      return;
    }

    if (e.key === "Escape") {
      setOpen(false);
      return;
    }
  }

  // bg-[var(--color-base-250)] border border-[var(--color-base-300)] hover:border-[var(--color-base-350)] outline-0 h-[30px] w-full rounded-[5px] px-2 py-1 text-[Mona_Sans] text-[13px] text-[var(--color-base-950)] transition mb-[15px]
  const wrapperBase =
    "bg-[var(--color-base-250)] border border-[var(--color-base-300)] hover:border-[var(--color-base-350)] outline-0 w-full rounded-[5px] text-[Mona_Sans] text-[13px] text-[var(--color-base-950)] transition";
  const inputBase =
    "bg-transparent outline-0 border-0 flex-1 min-w-[120px] text-[13px] text-[var(--color-base-950)]";
  const chipBase =
    "bg-[var(--color-base-300)] text-[var(--foreground)] rounded-[4px] px-1.5 py-0.5 inline-flex items-center gap-1";
  const optionBase = "px-2 py-1 rounded-sm cursor-pointer text-[13px]";

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div
        className={`${wrapperBase} ${disabled ? "pointer-events-none opacity-60" : ""}`}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-owns={listboxId}
        onClick={() => {
          if (disabled) return;
          setOpen(true);
          inputRef.current?.focus();
        }}
      >
        <div className="flex min-h-[30px] flex-wrap items-center gap-1 px-2 py-1">
          {selected.map((tag) => (
            <span key={`${tag.text}|${tag.href}`} className={chipBase}>
              <span className="max-w-[160px] truncate">{tag.text}</span>
              <button
                type="button"
                aria-label={`Remover ${tag.text}`}
                className="line-height-[0] flex h-[16px] w-[16px] items-center justify-center rounded-[3px] hover:bg-white/10"
                onClick={(e) => {
                  e.stopPropagation();
                  removeTag(tag);
                }}
              >
                ×
              </button>
            </span>
          ))}

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (!open) setOpen(true);
            }}
            onKeyDown={onKeyDown}
            className={inputBase}
            placeholder={selected.length === 0 ? placeholder : ""}
            disabled={disabled}
            aria-autocomplete="list"
            aria-controls={listboxId}
          />
        </div>
      </div>

      {open && (
        <ul
          id={listboxId}
          role="listbox"
          className="custom-scrollbar-1 absolute top-[calc(100%+4px)] right-0 left-0 z-50 max-h-[240px] overflow-y-auto rounded-md border border-[var(--color-base-350)] bg-[var(--color-base-200)] p-1 shadow-[var(--shadow-s)]"
        >
          {available.length === 0 ? (
            <li
              aria-disabled
              className="px-2 py-2 text-[13px] text-[var(--color-base-700)]"
            >
              Nenhuma tag encontrada
            </li>
          ) : (
            available.map((opt, idx) => (
              <li
                key={`${opt.text}|${opt.href}`}
                role="option"
                aria-selected={false}
              >
                <button
                  type="button"
                  className={`${optionBase} ${idx === activeIndex ? "bg-white/10" : "hover:bg-white/7"} w-full text-left`}
                  onMouseEnter={() => setActiveIndex(idx)}
                  onClick={() => addTag(opt)}
                >
                  {opt.text}
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
