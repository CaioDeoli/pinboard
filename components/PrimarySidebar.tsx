"use client";
import React, { useState } from "react";
import Modal from "./Modal";
import DocumentSearchIcon from "@/public/svgs/material-symbols-light--document-search-outline-rounded.svg";
import CalendarTodayIcon from "@/public/svgs/material-symbols-light--calendar-today-outline-rounded.svg";
import FileCopyIcon from "@/public/svgs/material-symbols-light--file-copy-outline-rounded.svg";
import TerminalIcon from "@/public/svgs/material-symbols-light--terminal-rounded.svg";
import ListAltIcon from "@/public/svgs/material-symbols-light--list-alt-outline-rounded.svg";
import SettingsIcon from "@/public/svgs/material-symbols-light--settings-outline-rounded.svg";

// Novo tipo para aceitar href ou onClick
interface SidebarItem {
  Icon: React.ComponentType<{ className?: string }>;
  href?: string;
  onClick?: () => void;
  label?: string;
}

export default function PrimarySidebar() {
  const [modalOpen, setModalOpen] = useState(false);

  const items: SidebarItem[] = [
    { onClick: () => setModalOpen(true), Icon: DocumentSearchIcon },
    { href: "#", Icon: CalendarTodayIcon },
    { href: "#", Icon: FileCopyIcon },
    { onClick: () => alert("Terminal!"), Icon: TerminalIcon },
    { href: "#", Icon: ListAltIcon },
  ];

  const bottomItems: SidebarItem[] = [{ href: "#", Icon: SettingsIcon }];

  return (
    <>
      <div className="justify-content-center fixed top-0 left-0 z-9 mt-10 flex h-[calc(100vh-40px)] w-11 overflow-x-hidden overflow-y-auto border-r border-[var(--color-base-300)] bg-[var(--color-base-200)] px-1 pt-2 pb-3">
        <div className="flex h-full w-full flex-col justify-between gap-1.5">
          <ul className="flex flex-col gap-1.5">
            {items.map((item, index) => (
              <li key={index} className="mx-auto inline-flex">
                {item.href ? (
                  <a
                    href={item.href}
                    className="inline-flex items-center justify-center rounded-sm px-1.5 py-1 text-[var(--color-base-700)] transition hover:bg-white/7"
                    aria-label={item.label}
                  >
                    <item.Icon className="h-4.5 w-4.5" />
                  </a>
                ) : item.onClick ? (
                  <button
                    type="button"
                    onClick={item.onClick}
                    className="inline-flex items-center justify-center rounded-sm px-1.5 py-1 text-[var(--color-base-700)] transition hover:bg-white/7 focus-visible:outline-none"
                    aria-label={item.label}
                  >
                    <item.Icon className="h-4.5 w-4.5" />
                  </button>
                ) : null}
              </li>
            ))}
          </ul>
          <ul className="flex flex-col gap-1.5">
            {bottomItems.map((item, index) => (
              <li key={index} className="mx-auto inline-flex">
                {item.href ? (
                  <a
                    href={item.href}
                    className="inline-flex items-center justify-center rounded-sm px-1.5 py-1 text-[var(--color-base-700)] transition hover:bg-white/7"
                    aria-label={item.label}
                  >
                    <item.Icon className="h-4.5 w-4.5" />
                  </a>
                ) : item.onClick ? (
                  <button
                    type="button"
                    onClick={item.onClick}
                    className="inline-flex items-center justify-center rounded-sm px-1.5 py-1 text-[var(--color-base-700)] transition hover:bg-white/7 focus-visible:outline-none"
                    aria-label={item.label}
                  >
                    <item.Icon className="h-4.5 w-4.5" />
                  </button>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Busca de Documentos"
      />
    </>
  );
}
