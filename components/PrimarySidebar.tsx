import DocumentSearchIcon from "@/components/svgs/material-symbols-light--document-search-outline-rounded.svg";
import CalendarTodayIcon from "@/components/svgs/material-symbols-light--calendar-today-outline-rounded.svg";
import FileCopyIcon from "@/components/svgs/material-symbols-light--file-copy-outline-rounded.svg";
import TerminalIcon from "@/components/svgs/material-symbols-light--terminal-rounded.svg";
import ListAltIcon from "@/components/svgs/material-symbols-light--list-alt-outline-rounded.svg";
import SettingsIcon from "@/components/svgs/material-symbols-light--settings-outline-rounded.svg";

export default function PrimarySidebar() {
  const items = [
    { href: "#", Icon: DocumentSearchIcon },
    { href: "#", Icon: CalendarTodayIcon },
    { href: "#", Icon: FileCopyIcon },
    { href: "#", Icon: TerminalIcon },
    { href: "#", Icon: ListAltIcon },
  ];

  return (
    <div className="bg-zinc-900 border-r border-zinc-700 fixed top-0 left-0 z-9 h-screen pt-10 w-11 flex justify-center overflow-y-auto overflow-x-hidden">
      <div className="h-full py-1.75">
        <ul className="flex flex-col items-center gap-1.75 h-full">
          {items.map((item, index) => (
            <li key={index} className="block">
              {/* Note 8px x 5px -> (-2px x -2px) -> 6px x 3px because of the size of the svg*/}
              <a
                href={item.href}
                className="text-zinc-400 hover:bg-zinc-700 transition py-0.75 px-1.5 rounded-sm inline-flex items-center justify-center"
              >
                <item.Icon className="w-5 h-5" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}