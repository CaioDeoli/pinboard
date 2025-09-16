import Link from "next/link";
import Image from "next/image";
import CloseSmallOutlineRoundedIcon from "@/components/svgs/material-symbols-light--close-small-outline-rounded.svg";
import SearchRoundedIcon from "@/components/svgs/iconoir--search.svg";

export default function Navbar() {
  return (
    <nav className="fixed left-18 right-0 top-0 z-10 h-20 p-4 flex gap-6 items-center">
      <form className="flex-1 inline-flex items-center bg-gray-100 rounded-full h-full font-[Mona_Sans] pl-4 pr-3 gap-3">
        <div className="flex-1 inline-flex justify-between h-full">
          <input className="flex-1 h-full overflow-hidden outline-none" placeholder="Search" />
          <button type="button" className="h-full px-3 inline-flex items-center cursor-pointer">
            <CloseSmallOutlineRoundedIcon className="w-6 h-6" />
          </button>
        </div>
        <button type="submit" className="w-9 h-9 bg-violet-400 rounded-full inline-flex items-center justify-center cursor-pointer">
          <SearchRoundedIcon className="w-5 h-5 text-white" />
        </button>
      </form>

      {/* <input type="text" className="flex-1 h-full rounded-full border border-gray-200 p-4" placeholder="Search" /> */}
      <button type="button" className="relative aspect-[1/1] h-10 overflow-hidden rounded-full cursor-pointer">
        <Image src={"https://picsum.photos/id/64/256"} fill alt="User" className="object-cover" />
      </button>
    </nav>
  );
}