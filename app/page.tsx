import { dummyPins } from "@/components/mockups/dummyPins";
import PinMasonry from "@/components/PinMasonry";

export default function Home() {
  return (
    <main>
      <div className="p-4">
        <PinMasonry items={dummyPins} gutter={16} />
      </div>
    </main>
  );
}
