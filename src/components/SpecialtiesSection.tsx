import React, { useEffect, useRef } from "react";
import {
  Heart,
  Brain,
  Baby,
  UserRound,
  ActivitySquare,
  Stethoscope,
} from "lucide-react";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";

interface SpecialtyCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const SpecialtyCard: React.FC<SpecialtyCardProps> = ({
  icon,
  title,
  description,
}) => {
  return (
    <Card className="h-full border border-ally-blue/50 bg-gradient-to-b from-ally-blue/10 to-ally-blue/5 rounded-2xl">
      <CardHeader className="pb-0 text-center overflow-clip">
        <div className="flex justify-center">
          <div className="py-3 rounded-full text-ally-blue/20">{icon}</div>
        </div>
        <CardTitle className="text-xl font-bold text-ally-blue">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center pb-6 pt-2">
        <CardDescription className="text-ally-gray">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  );
};

const SpecialtiesSection: React.FC = () => {
  const isMobile = useIsMobile();
  const [carouselApi, setCarouselApi] = React.useState<CarouselApi | null>(
    null
  );

  useEffect(() => {
    if (!carouselApi) return;

    const interval = setInterval(() => {
      if (carouselApi.canScrollNext()) {
        carouselApi.scrollNext();
      } else {
        carouselApi.scrollTo(0); // loop back to start
      }
    }, 2000); // scroll every 3 seconds

    return () => clearInterval(interval);
  }, [carouselApi]);

  const specialties = [
    {
      icon: <Heart size={100} />,
      title: "Cardiologia",
      description: "Sintomas cardíacos, fatores de risco e histórico familiar",
    },
    {
      icon: <Brain size={100} />,
      title: "Neurologia",
      description: "Sinais neurológicos, reflexos e histórico neurológico",
    },
    {
      icon: <Baby size={100} />,
      title: "Pediatria",
      description:
        "Linguagem adaptada à idade, calendário vacinal e antecedentes",
    },
    {
      icon: <UserRound size={100} />,
      title: "Ginecologia",
      description: "Ciclo, queixas ginecológicas e saúde reprodutiva",
    },
    {
      icon: <ActivitySquare size={100} />,
      title: "Ortopedia",
      description: "Dor musculoesquelética, traumas e exames de imagem",
    },
    {
      icon: <Stethoscope size={100} />,
      title: "Clínica Geral",
      description: "Queixas variadas e rastreios comuns",
    },
  ];

  return (
    <section id="specialties" className="section-spacing bg-white relative">
      <div className="relative w-full">
        <div
          className="text-center max-w-3xl mx-auto mb-12 fade-in-section px-6 md:px-12"
          style={{ "--delay": "100ms" } as React.CSSProperties}
        >
          <h2 className="heading-lg mb-4">
            Personalizada para sua{" "}
            <span className="gradient-text">especialidade.</span>
          </h2>
          <p className="text-md md:text-xl text-ally-gray">
            A Ally adapta a estrutura da anamnese, termos clínicos e sugestões
            conforme sua área de atuação – para você ter mais precisão,
            relevância e agilidade em cada atendimento.
          </p>
        </div>

        <div
          className="fade-in-section relative overflow-hidden"
          style={{ "--delay": "200ms" } as React.CSSProperties}
        >
          {/* Vignette effect */}
          <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-white to-transparent pointer-events-none z-10"></div>
          <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-white to-transparent pointer-events-none z-10"></div>

          <Carousel
            opts={{
              align: "start",
              loop: true,
              active: true,
            }}
            setApi={setCarouselApi}
          >
            <CarouselContent className="flex">
              {specialties.map((specialty, index) => (
                <CarouselItem
                  key={index}
                  className={`pl-4 ${
                    isMobile
                      ? "basis-full px-12"
                      : "basis-1/2 md:basis-1/3 lg:bases-1/4  xl:basis-1/4"
                  }`}
                >
                  <div className="p-1 h-full">
                    <SpecialtyCard
                      icon={specialty.icon}
                      title={specialty.title}
                      description={specialty.description}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default SpecialtiesSection;
