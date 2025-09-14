import FilterSubnav from "@/components/FilterSubnav";
import PinGrid from "@/components/PinGrid";

export default function Home() {
  return (
    <main>
      <FilterSubnav />
      <div className="pt-6 pb-8">
        <PinGrid />
      </div>
    </main>
  );
}
