import LeftPanelOpenIcon from "@/public/svgs/material-symbols-light--left-panel-open-outline-rounded.svg";

export default function Header() {
  return (
    <header className="fixed top-0 right-0 left-0 z-10 flex h-10 items-center border-b border-[var(--color-base-300)] bg-[var(--color-base-200)] px-1.5">
      <button
        type="button"
        className="ms-0.5 inline-flex cursor-pointer items-center justify-center rounded-sm px-1.5 py-1 text-[var(--color-base-700)] transition hover:bg-white/7"
      >
        <LeftPanelOpenIcon className="h-4.5 w-4.5" />
      </button>
    </header>
  );
}
