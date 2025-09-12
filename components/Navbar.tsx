import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="p-4 bg-gray-100 border-b flex justify-between">
      <Link href="/" className="text-xl font-bold">Pinboard</Link>
      <Link href="/shots" className="text-gray-600 hover:text-black">Shots</Link>
    </nav>
  );
}