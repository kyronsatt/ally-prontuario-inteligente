
import React, { useEffect } from "react";
import Header from "@/components/layouts/Header";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import BenefitsSection from "@/components/sections/BenefitsSection";
import SpecialtiesSection from "@/components/sections/SpecialtiesSection";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import WaitlistForm from "@/components/sections/WaitlistForm";
import Footer from "@/components/layouts/Footer";
import { Toaster } from "@/components/ui/toaster";
import { useAnimationObserver } from "@/hooks/use-animation-observer";

const Index = () => {
  useAnimationObserver();

  useEffect(() => {
    // Set custom page title
    document.title = "Ally — Anamnese estruturada em segundos";
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-grow">
        <HeroSection />
        <BenefitsSection />
        <AboutSection />
        <HowItWorksSection />
        <SpecialtiesSection />
        <WaitlistForm />
      </main>

      <Footer />
      <Toaster />
    </div>
  );
};

export default Index;
