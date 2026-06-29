
import { HeroSection, ArchitectureSection } from "../components/HeroSection";

function Index() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <HeroSection />
        <ArchitectureSection />
      </main>
    </div>
  );
}

export default Index;
