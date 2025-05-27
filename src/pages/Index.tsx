import React, { useEffect } from "react";
import Header from "@/components/layouts/Header";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import BenefitsSection from "@/components/sections/BenefitsSection";
import SpecialtiesSection from "@/components/sections/SpecialtiesSection";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import PricingSection from "@/components/sections/PricingSection";
import Footer from "@/components/layouts/Footer";

import { useAnimationObserver } from "@/hooks/use-animation-observer";
import { useAnalytics } from "@/hooks/use-analytics";

const Index = () => {
  useAnimationObserver();
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    document.title = "Ally — Anamnese estruturada em segundos";
    trackEvent("page_view", { page: "landing_page" });
  }, [trackEvent]);

  return (
    <div className="min-h-screen flex flex-col bg-white w-screen mx-0 px-0">
      <Header />

      <main className="flex-grow pt-16 overflow-x-clip">
        <HeroSection />
        <HowItWorksSection />
        <AboutSection />
        <BenefitsSection />
        <SpecialtiesSection />
        <PricingSection />
      </main>

      <Footer />
    </div>
  );
};

export default Index;
