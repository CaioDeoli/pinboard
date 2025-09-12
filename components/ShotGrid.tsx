"use client";

import Image from "next/image";

const dummyShots = [
  {
    id: 1,
    title: "Modern Dashborad UI",
    author: "Alex Doe",
    likes: 124,
    image: "https://picsum.photos/600/400?random=1"
  },
  {
    id: 2,
    title: "Stylish UI for Task Management",
    author: "Jane Smith",
    likes: 98,
    image: "https://picsum.photos/600/400?random=2"
  },
  {
    id: 3,
    title: "Minimalist Portfolio Design",
    author: "John Doe",
    likes: 156,
    image: "https://picsum.photos/600/400?random=3"
  },
];

export default function ShotGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {dummyShots.map((shot) => (
        <div
          key={shot.id}
          className="bg-white rounded-2xl shadow hover:shadow-lg transition p-2"
        >
          <div className="relative w-full h-48 overflow-hidden rounded-xl">
            <Image
              src={shot.image}
              alt={shot.title}
              fill
              className="object-cover hover:scale-105 transition"
            />
          </div>
          <div className="mt-3">
            <h2 className="text-lg font-semibold">{shot.title}</h2>
            <p className="text-sm text-gray-500">{shot.author}</p>
            <p className="text-xs text-gray-500">{shot.likes} likes</p>
          </div>
        </div>
      ))}
    </div>
  );
}