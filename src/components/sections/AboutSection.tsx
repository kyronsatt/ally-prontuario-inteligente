import {
  FileText,
  Lamp,
  LampIcon,
  Lightbulb,
  Sparkle,
  Sparkles,
  WandSparkles,
} from "lucide-react";
import React from "react";

// FeatureBadge.tsx
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

type FeatureBadgeProps = {
  icon: LucideIcon;
  label: string;
};

export function FeatureBadge({ icon: Icon, label }: FeatureBadgeProps) {
  return (
    <div className="flex gap-3 ring-1 ring-ally-blue/20 shadow-md shadow-ally-blue/20 ring-offset-1 items-center whitespace-nowrap h-8 bg-[#effafc] border border-ally-blue/70 text-sm text-ally-blue w-full lg:w-fit rounded-full">
      <Icon className="h-full w-auto p-1.5 inline rounded-full bg-gradient-to-tr from-ally-blue to-[#00e6e6] text-white" />
      <p className="py-1 pr-4 font-light">{label}</p>
    </div>
  );
}

const AboutSection: React.FC = () => {
  const features = [
    { icon: WandSparkles, label: "Inteligência Artificial" },
    { icon: Lightbulb, label: "Insights Clínicos" },
    { icon: FileText, label: "Anamnese Estruturada" },
  ];

  return (
    <section id="about" className="section-spacing bg-white py-16 md:py-28">
      <div className="container-ally">
        <div className="flex flex-col gap-4 items-center justify-center">
          <div
            className="space-y-6 fade-in-section text-center h-fit mb-14 order-1"
            style={{ "--delay": "200ms" } as React.CSSProperties}
          >
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold leading-tight">
              Conheça sua nova{" "}
              <span className="gradient-text">parceira clínica</span>
            </h2>

            <div className="text-md md:text-xl text-ally-gray max-w-2xl">
              <p>
                A Ally usa{" "}
                <span className="bg-ally-blue/20 inline">
                  Inteligência Artificial
                </span>{" "}
                para transformar suas consultas em anamneses completas,
                automaticamente.
              </p>
            </div>
          </div>
          <div className="flex flex-col order-3 lg:order-2 lg:flex-row gap-4 lg:gap-6 mt-12 lg:mt-0 mb-4 w-full justify-center items-center">
            {features.map((feature, index) => (
              <FeatureBadge
                key={index}
                icon={feature.icon}
                label={feature.label}
              />
            ))}
          </div>
          <div
            className="fade-in-section relative flex order-3"
            style={{ "--delay": "100ms" } as React.CSSProperties}
          >
            <div className="rounded-2xl relative">
              <img
                src="/assets/mockups/desktop/ally-desktop-anamnese-insights.png"
                alt="Ally Med - Anamnese e Insights"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
