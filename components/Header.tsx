import LeftPanelOpenIcon from "@/public/svgs/material-symbols-light--left-panel-open-outline-rounded.svg";

export default function Header() {
  return (
    <header className="bg-[var(--color-base-200)] border-b border-[var(--color-base-300)] fixed left-0 right-0 top-0 z-10 h-10 px-1.5 flex items-center">
      <button
        type="button"
        className="hover:bg-white/7 text-[var(--color-base-700)] ms-0.5 py-1 px-1.5 rounded-sm inline-flex items-center justify-center cursor-pointer transition"
      >
        <LeftPanelOpenIcon className="w-4.5 h-4.5" />
      </button>
    </header>
  );
}