"use client";
import { useState } from "react";
import { dummyPins } from "@/components/mockups/dummyPins";
import PinMasonry, { Pin } from "@/components/PinMasonry";
import PinDetail from "@/components/PinDetail";

export default function Home() {
  const [selectedPin, setSelectedPin] = useState<Pin | null>(null);

  return (
    <main>
      <div className="flex flex-row h-[calc(100vh-40px)]">
        <div className="flex-1 p-4 overflow-auto custom-scrollbar-1">
          <PinMasonry
            items={dummyPins}
            gutter={16}
            onPinClick={setSelectedPin}
          />
        </div>
        <PinDetail
          open={!!selectedPin}
          onClose={() => setSelectedPin(null)}
          src={selectedPin?.src || ""}
          alt={selectedPin?.alt}
          title={selectedPin?.title}
          description={selectedPin?.alt}
        />
      </div>
    </main>
  );
}
