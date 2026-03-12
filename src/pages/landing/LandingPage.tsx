import { useEffect } from "react";

import {
  CTASection,
  FeaturesSection,
  Footer,
  HeroSection,
  HowItWorks,
  Navbar,
  PricingSection,
  ProblemSection,
  SocialProof,
} from "./components";

export const LandingPage = () => {
  useEffect(() => {
    const scrollToPricing = () => {
      if (window.location.hash !== "#pricing") return;
      const section = document.getElementById("pricing");
      if (!section) return;
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    const timer = window.setTimeout(scrollToPricing, 250);
    window.addEventListener("hashchange", scrollToPricing);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("hashchange", scrollToPricing);
    };
  }, []);

  return (
    <div className="font-poppins min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <SocialProof />
      <ProblemSection />
      <FeaturesSection />
      <PricingSection />
      <HowItWorks />
      <CTASection />
      <Footer />
    </div>
  );
};
