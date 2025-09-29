"use client";
import React, { useState, useRef, useEffect, ReactNode } from "react";
import SearchIcon from "@/public/svgs/material-symbols-light--search-rounded.svg";

type DropdownItem = {
  label: string;
  onClick?: () => void;
  href?: string;
  icon?: ReactNode; // ícone opcional antes do texto
};

type DropdownProps = {
  // Modo simples
  items?: DropdownItem[];
  children: ReactNode; // botão que será o toggle
  // Modo avançado
  searchable?: boolean;
  searchPlaceholder?: string;
  onSearchChange?: (value: string) => void;
  primaryAction?: { label: string; onClick: () => void; icon?: ReactNode; ariaLabel?: string };
  listItems?: Array<{ id: string | number; label: string; onClick?: () => void }>;
  menuAriaLabel?: string;
  menuWidthClass?: string; // permite ajustar largura
};

export default function Dropdown({ items, children, searchable, searchPlaceholder, onSearchChange, primaryAction, listItems, menuAriaLabel, menuWidthClass }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [localQuery, setLocalQuery] = useState<string>("");

  // fecha dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

    // fecha dropdown ao sair do figure ancestral
    useEffect(() => {
      const dropdownEl = ref.current;
      if (!dropdownEl) return;
      const figureEl = dropdownEl.closest("figure");
      if (!figureEl) return;

      const handleFigureMouseLeave = () => setOpen(false);

      figureEl.addEventListener("mouseleave", handleFigureMouseLeave);
      return () => {
        figureEl.removeEventListener("mouseleave", handleFigureMouseLeave);
      };
    }, []);

  const filteredItems = (listItems || []).filter((it) => {
    if (!localQuery) return true;
    return it.label.toLowerCase().includes(localQuery.trim().toLowerCase());
  });

  const baseClass = "text-[var(--foreground)] text-[13px]/[1.3] font-[Mona_Sans] inline-flex gap-2 items-center px-2 py-1 rounded-sm overflow-hidden text-ellipsis whitespace-nowrap cursor-pointer transition w-full";
  const hoverClass = "hover:bg-white/7";

  return (
    <div className="relative inline-block" ref={ref}>
      <div onClick={() => setOpen(!open)}>{children}</div>

      {open && (
        <div
          className={`bg-[var(--color-base-200)] border border-[var(--color-base-350)] rounded-lg absolute right-0 mt-1 z-50 shadow-[var(--shadow-s)] ${
            (searchable || primaryAction || (listItems && listItems.length >= 0))
              ? (menuWidthClass ?? "w-[280px] max-w-[350px] p-2")
              : "w-[146px] max-w-[146px] p-[6px]"
          }`}
          role="menu"
          aria-label={menuAriaLabel ?? "Menu"}
        >
          {(searchable || primaryAction || (listItems && listItems.length >= 0)) ? (
            <ul>
              {searchable && (
                <li role="presentation" className="mb-1.5">
                  <div role="menuitem" className="relative">
                    <div className="relative flex items-center">
                      <SearchIcon className="absolute text-[var(--foreground)] left-2 mt-0.5" />
                      <input
                        role="searchbox"
                        type="text"
                        aria-label={searchPlaceholder ?? "Search for a playlist"}
                        placeholder={searchPlaceholder ?? "Search for a playlist"}
                        maxLength={80}
                        value={localQuery}
                        onChange={(e) => {
                          setLocalQuery(e.target.value);
                          onSearchChange?.(e.target.value);
                        }}
                        className="bg-[var(--color-base-250)] border border-[var(--color-base-300)] hover:border-[var(--color-base-350)] outline-0 h-[30px] w-full rounded-[5px] ps-8 pe-2 py-1 text-[Mona_Sans] text-[13px] text-[var(--color-base-950)] transition"
                      />
                    </div>
                  </div>
                </li>
              )}

              {primaryAction && (
                <li role="presentation" className="mb-1.5">
                  <button
                    type="button"
                    role="menuitem"
                    aria-label={primaryAction.ariaLabel ?? primaryAction.label}
                    onClick={() => {
                      primaryAction.onClick();
                      setOpen(false);
                    }}
                    className={`${baseClass} ${hoverClass}`}
                  >
                    {primaryAction.icon && <span className="flex-shrink-0">{primaryAction.icon}</span>}
                    <span className="truncate">{primaryAction.label}</span>
                  </button>
                </li>
              )}

              {(listItems && listItems.length >= 0) && (
                <>
                  <div role="separator" aria-orientation="horizontal" className="h-0 border-b border-[var(--color-base-350)] my-1.5 -mx-1.5" />
                  <li role="presentation">
                    <div className="max-h-[calc(60vh-48px)] overflow-y-auto pr-1 scrollbar-custom-1 -me-1.5">
                      <ul>
                        {filteredItems.length === 0 ? (
                          <li role="presentation">
                            <div
                              role="menuitem"
                              aria-disabled="true"
                              className={`${baseClass} select-none text-[var(--foreground)]`}
                              style={{ cursor: "auto" }}
                            >
                              <span className="truncate">Tag not found</span>
                            </div>
                          </li>
                        ) : (
                          filteredItems.map((it) => (
                            <li key={it.id} role="presentation">
                              <button
                                type="button"
                                role="menuitem"
                                onClick={() => {
                                  it.onClick?.();
                                  setOpen(false);
                                }}
                                className={`${baseClass} ${hoverClass}`}
                              >
                                <span className="truncate">{it.label}</span>
                              </button>
                            </li>
                          ))
                        )}
                      </ul>
                    </div>
                  </li>
                </>
              )}
            </ul>
          ) : (
            <div>
              {(items ?? []).map((item, idx) => {
                // const baseClass =
                //   "text-[var(--foreground)] text-[13px]/[1.3] font-[Mona_Sans] flex gap-2 items-center px-2 py-1 rounded-sm overflow-hidden text-ellipsis whitespace-nowrap cursor-pointer transition";
                // const hoverClass = "hover:bg-white/7";

                const content = (
                  <>
                    {item.icon && <span className="mr-2 flex-shrink-0">{item.icon}</span>}
                    <span className="overflow-hidden text-ellipsis">{item.label}</span>
                  </>
                );

                return item.href ? (
                  <a
                    key={idx}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`${baseClass} ${hoverClass}`}
                    role="menuitem"
                  >
                    {content}
                  </a>
                ) : (
                  <button
                    key={idx}
                    onClick={() => {
                      item.onClick?.();
                      setOpen(false);
                    }}
                    className={`${baseClass} ${hoverClass} w-full text-left`}
                    role="menuitem"
                  >
                    {content}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
