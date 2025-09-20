"use client";
import React, { useState, useRef, useEffect, ReactNode } from "react";

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
  // useEffect(() => {
  //   const dropdownEl = ref.current;
  //   if (!dropdownEl) return;
  //   const figureEl = dropdownEl.closest("figure");
  //   if (!figureEl) return;

  //   const handleFigureMouseLeave = () => setOpen(false);

  //   figureEl.addEventListener("mouseleave", handleFigureMouseLeave);
  //   return () => {
  //     figureEl.removeEventListener("mouseleave", handleFigureMouseLeave);
  //   };
  // }, []);

  return (
    <div className="relative inline-block" ref={ref}>
      <div onClick={() => setOpen(!open)}>{children}</div>

      {open && (
        <div
          className={`bg-[var(--color-base-200)] border border-[var(--color-base-350)] rounded-lg absolute right-0 mt-1 z-50 ${
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
                <li role="presentation" className="mb-2">
                  <div role="menuitem" className="relative">
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
                      className="w-full h-[32px] rounded-[6px] px-3 text-[13px] font-[Mona_Sans] bg-[var(--color-base-150)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] outline-0 shadow-[var(--input-shadow)] focus:shadow-[var(--input-shadow-hover)]"
                    />
                  </div>
                </li>
              )}

              {primaryAction && (
                <li role="presentation" className="mb-2">
                  <button
                    type="button"
                    role="menuitem"
                    aria-label={primaryAction.ariaLabel ?? primaryAction.label}
                    onClick={() => {
                      primaryAction.onClick();
                      setOpen(false);
                    }}
                    className="w-full inline-flex items-center gap-2 px-2 py-2 rounded-md text-[13px] font-[Mona_Sans] text-[var(--foreground)] bg-[var(--color-base-200)] hover:bg-white/7 transition"
                  >
                    {primaryAction.icon && <span className="flex-shrink-0">{primaryAction.icon}</span>}
                    <span className="truncate">{primaryAction.label}</span>
                  </button>
                </li>
              )}

              {(listItems && listItems.length >= 0) && (
                <>
                  <div role="separator" aria-orientation="horizontal" className="h-px bg-[var(--color-base-350)] my-2" />
                  <li role="presentation">
                    <div className="max-h-[calc(100vh-24px)] overflow-y-auto pr-1">
                      <ul>
                        {(listItems || [])
                          .filter((it) => {
                            if (!localQuery) return true;
                            return it.label.toLowerCase().includes(localQuery.trim().toLowerCase());
                          })
                          .map((it) => (
                          <li key={it.id} role="presentation">
                            <button
                              type="button"
                              role="menuitem"
                              onClick={() => {
                                it.onClick?.();
                                setOpen(false);
                              }}
                              className="w-full text-left text-[13px] font-[Mona_Sans] text-[var(--foreground)] px-2 py-2 rounded-sm hover:bg-white/7 transition"
                            >
                              <span className="truncate">{it.label}</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>
                </>
              )}
            </ul>
          ) : (
            <div>
              {(items ?? []).map((item, idx) => {
                const baseClass =
                  "text-[var(--foreground)] text-[13px]/[1.3] font-[Mona_Sans] flex gap-2 items-center px-2 py-1 rounded-sm overflow-hidden text-ellipsis whitespace-nowrap cursor-pointer transition";
                const hoverClass = "hover:bg-white/7";

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
