import SectionNav from "@/components/SectionNav";
import Section01_Intro from "@/sections/Section01_Intro";
import Section02_Spectrum from "@/sections/Section02_Spectrum";
import Section03_ZoomedSegments from "@/sections/Section03_ZoomedSegments";
import Section04_Comparisons from "@/sections/Section04_Comparisons";
import Section05_ConcernedSplit from "@/sections/Section05_ConcernedSplit";
import Section06_Conclusion from "@/sections/Section06_Conclusion";

export default function Home() {
  return (
    <>
      <SectionNav />
      <main>
        <Section01_Intro />
        <Section02_Spectrum />
        <Section03_ZoomedSegments />
        <Section04_Comparisons />
        <Section05_ConcernedSplit />
        <Section06_Conclusion />
      </main>
    </>
  );
}
