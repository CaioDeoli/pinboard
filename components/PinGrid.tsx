"use client";

import { useState } from "react"; 
import Image from "next/image";
import MoreHorizontalIcon from "@/components/svgs/geist-more-horizontal.svg";

const dummyPins = [
  {
    id: 1,
    title: "Modern Dashborad UI",
    author: "Alex Doe",
    image: "https://picsum.photos/id/1011/1200/900",
  },
  {
    id: 2,
    title: "Stylish UI for Task Management",
    author: "Jane Smith",
    image: "https://picsum.photos/id/1012/1200/900",
  },
  {
    id: 3,
    title: "Minimalist Portfolio Design",
    author: "John Doe",
    image: "https://picsum.photos/id/900/1200/900",
  },
  {
    id: 4,
    title: "Code3-Web3 Developer Tools Website",
    author: "Fahema Yesmin",
    image: "https://picsum.photos/id/1014/1200/900",
  },
  {
    id: 5,
    title: "Timeless Furniture Interior Design Website",
    author: "Phenomenon Product",
    image: "https://picsum.photos/id/1015/1200/900",
  },
  {
    id: 6,
    title: "Modern Dashborad UI",
    author: "Alex Doe",
    image: "https://picsum.photos/id/1016/1200/900",
  },
  {
    id: 7,
    title: "Stylish UI for Task Management",
    author: "Jane Smith",
    image: "https://picsum.photos/id/1021/1200/900",
  },
  {
    id: 8,
    title: "Minimalist Portfolio Design",
    author: "John Doe",
    image: "https://picsum.photos/id/1018/1200/900",
  },
  {
    id: 9,
    title: "Code3-Web3 Developer Tools Website",
    author: "Fahema Yesmin",
    image: "https://picsum.photos/id/1019/1200/900",
  },
  {
    id: 10,
    title: "Timeless Furniture Interior Design Website",
    author: "Phenomenon Product",
    image: "https://picsum.photos/id/1020/1200/900",
  },
];

function Modal({ pin, onClose }: { pin: typeof dummyPins[0]; onClose: () => void }) {
  if (!pin) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg max-w-3xl w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-700 font-bold text-xl"
        >
          x
        </button>
        <h2 className="text-2xl font-bold mb-4">{pin.title}</h2>
        <p className="text-sm text-gray-500 mb-4">{pin.author}</p>
        <div className="relative w-full aspect-[4/3]">
          <Image src={pin.image} alt={pin.title} fill className="object-cover rounded-lg" />
        </div>
      </div>
    </div>
  )
}

export default function PinGrid() {
  const [selectedPin, setSelectedPin] = useState<typeof dummyPins[0] | null>(null);
  
  return (
    <>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 px-4">
        {dummyPins.map((pin) => (
          <li
            key={pin.id}
            className="relative w-full aspect-[4/3] overflow-hidden rounded-lg cursor-pointer group"
            onClick={(() => setSelectedPin(pin))}
          >
            <Image
              src={pin.image}
              alt={pin.title}
              fill
              className="object-cover transition"
            />
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition flex items-end pointer-events-none p-5"
              style={{
                background: `linear-gradient(180deg, rgba(0,0,0,0) 62%, rgba(0,0,0,0.00345888) 63.94%, rgba(0,0,0,0.014204) 65.89%, rgba(0,0,0,0.0326639) 67.83%, rgba(0,0,0,0.0589645) 69.78%, rgba(0,0,0,0.0927099) 71.72%, rgba(0,0,0,0.132754) 73.67%, rgba(0,0,0,0.177076) 75.61%, rgba(0,0,0,0.222924) 77.56%, rgba(0,0,0,0.267246) 79.5%, rgba(0,0,0,0.30729) 81.44%, rgba(0,0,0,0.341035) 83.39%, rgba(0,0,0,0.367336) 85.33%, rgba(0,0,0,0.385796) 87.28%, rgba(0,0,0,0.396541) 89.22%, rgba(0,0,0,0.4) 91.17%)`,
              }}
            >
              <div className="flex flex-1 items-center justify-between min-w-0">
                <h3 className={"text-white font-medium overflow-hidden text-ellipsis whitespace-nowrap font-[Mona_Sans]"}>{pin.title}</h3>
                <ul className="flex justify-end">
                  <li className="ms-3">
                    <a href="#" className="bg-white hover:text-gray-500 pointer-events-auto w-10 h-10 inline-flex items-center justify-center rounded-xl">
                      <MoreHorizontalIcon />
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {selectedPin && <Modal pin={selectedPin} onClose={() => setSelectedPin(null)} />}
    </>
  );
}