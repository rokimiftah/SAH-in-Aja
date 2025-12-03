import { Footer, Header } from "@shared/components/layout";

import { FeaturesSection, HeroSection, ImportantNote, SectionDivider, StepsSection, WhyImportantSection } from "./components";

export const LandingPage = () => {
  return (
    <div className="bg-bg-cream font-poppins text-text-dark min-h-screen">
      <Header />

      <section className="px-4 pt-5 pb-6 sm:pt-5">
        <div className="mx-auto max-w-5xl">
          <HeroSection />

          <SectionDivider label="Kenapa Ini Penting Banget?" accentClasses="border-accent-pink text-accent-pink" />
          <WhyImportantSection />

          <SectionDivider label="3 Jurus SAH-in Aja!" accentClasses="border-primary-blue text-primary-blue" />
          <FeaturesSection />

          <SectionDivider label="Semudah 1-2-3" accentClasses="border-primary-orange text-primary-orange" />
          <StepsSection />

          <SectionDivider label="Important Note" accentClasses="border-yellow-500 text-yellow-600" />
          <ImportantNote />

          <Footer />
        </div>
      </section>
    </div>
  );
};
