"use client";

import { useRef, useState, useEffect } from "react";
import ListFilterIcon from "@/components/svgs/geist-list-filter.svg";
import ChevronLeftIcon from "@/components/svgs/geist-chevron-left.svg";
import ChevronRightIcon from "@/components/svgs/geist-chevron-right.svg";

export default function FilterSubnav() {
  const containerRef = useRef<HTMLUListElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const categories = [
    "Discover",
    "Animation",
    "Branding",
    "Illustration",
    "Mobile",
    "Print",
    "Product Design",
    "Typography",
    "Web Design",
  ];

  function checkScroll() {
    if (!containerRef.current) return;
    const el = containerRef.current;
    const tolerance = 1;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - tolerance);
  }
  

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    function handleResize() {
      clearTimeout(timeout);
      timeout = setTimeout(checkScroll, 100);
    }

    checkScroll();
    window.addEventListener("resize", handleResize);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener("resize", handleResize);
    }
  }, []);

  function scrollByOffset(offset: number) {
    containerRef.current?.scrollBy({ left: offset, behavior: "smooth" });
  }
  
  return (
    <div className="px-4 pt-6">
      <div className="flex items-center justify-between">
        <div className="mr-10" style={{ flex: "0 0 150px" }}>

        </div>
        <div className="relative overflow-x-auto overflow-y-hidden">
          {canScrollLeft && (
            <span>
              <button
                type="button"
                className="text-center leading-5 py-2.5 absolute z-1 left-0 w-10 h-10 cursor-pointer"
                style={{ backgroundImage: "linear-gradient(to left, rgba(255, 255, 255, 0) 0%, white 50%)" }}
                onClick={() => scrollByOffset(-150)}
              >
                <ChevronLeftIcon className="inline w-3 h-3" />
              </button>
            </span>
          )}

          {canScrollRight && (
            <span>
              <button
                type="button"
                className="text-center leading-5 py-2.5 absolute z-1 right-0 w-10 h-10 cursor-pointer"
                style={{ backgroundImage: "linear-gradient(to right, rgba(255, 255, 255, 0) 0%, white 50%)" }}
                onClick={() => scrollByOffset(150)}
              >
                <ChevronRightIcon className="inline w-3 h-3" />
              </button>
            </span>
          )}
          <ul ref={containerRef} onScroll={checkScroll} className="font-[Mona_Sans] text-sm font-semibold overflow-x-auto overflow-y-hidden flex gap-2 px-0.5 whitespace-nowrap scrollbar-hide">
            {categories.map((categorie) => (
              <li key={categorie} className="block">
                <a 
                  href="#" 
                  className="inline-flex items-center h-9 px-4 hover:text-gray-500 transition rounded-full">
                    {categorie}  
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex justify-end h-10" style={{ flex: "0 0 200px" }}>
          <button type="button" className="text-[13px]/4 block border border-[1.5px] border-gray-200 px-5 py-2.5 rounded-full cursor-pointer">
            <ListFilterIcon className="inline-block w-3.25 mr-1 -mt-[3px]" />
            <span className="hidden">0</span>
            <span className="font-[Mona_Sans]">Filters</span>
          </button>
        </div>
      </div>
    </div>
  );
}