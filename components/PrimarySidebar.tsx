import DocumentSearchIcon from "@/components/svgs/material-symbols-light--document-search-outline-rounded.svg";
import CalendarTodayIcon from "@/components/svgs/material-symbols-light--calendar-today-outline-rounded.svg";
import FileCopyIcon from "@/components/svgs/material-symbols-light--file-copy-outline-rounded.svg";
import TerminalIcon from "@/components/svgs/material-symbols-light--terminal-rounded.svg";
import ListAltIcon from "@/components/svgs/material-symbols-light--list-alt-outline-rounded.svg";

export default function PrimarySidebar() {
  const items = [
    { href: "#", Icon: DocumentSearchIcon },
    { href: "#", Icon: CalendarTodayIcon },
    { href: "#", Icon: FileCopyIcon },
    { href: "#", Icon: TerminalIcon },
    { href: "#", Icon: ListAltIcon },
  ];

  return (
    <div className="bg-[var(--color-base-200)] border-r border-[var(--color-base-300)] fixed top-0 left-0 z-9 h-screen mt-10 pt-2 pb-3 px-1 w-11 flex justify-content-center overflow-y-auto overflow-x-hidden">
      <div className="h-full w-full ">
        <ul className="h-full flex flex-col gap-1.5">
          {items.map((item, index) => (
            <li key={index} className="mx-auto">
              <a
                href={item.href}
                className="hover:bg-white/7 text-[var(--color-base-700)] py-1 px-1.5 rounded-sm inline-flex items-center justify-center transition"
              >
                <item.Icon className="w-4.5 h-4.5" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}