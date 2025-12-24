import { CTASection, FeaturesSection, Footer, HeroSection, HowItWorks, Navbar, ProblemSection, SocialProof } from "./components";

export const LandingPage = () => {
  return (
    <div className="font-poppins min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <SocialProof />
      <ProblemSection />
      <FeaturesSection />
      <HowItWorks />
      <CTASection />
      <Footer />
    </div>
  );
};
