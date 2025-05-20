import React, { useEffect } from "react";
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
  const isMobile = useIsMobile();

  return (
    <Card className="h-full border border-ally-blue/50 bg-gradient-to-r from-ally-blue/15 to-[#00e6e630] rounded-2xl">
      <CardHeader className="pb-0 text-center overflow-clip bg-transparent">
        <div className="flex justify-center">
          <div className="py-3 rounded-full text-ally-blue/20">{icon}</div>
        </div>
        <CardTitle className="text-lg md:text-xl font-bold text-ally-blue">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center pb-6 pt-2">
        <CardDescription className="text-xs md:text-sm text-ally-gray">
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
    }, 2000); // scroll every 2 seconds

    return () => clearInterval(interval);
  }, [carouselApi]);

  const iconSize = isMobile ? 60 : 100;

  const specialties = [
    {
      icon: <Heart size={iconSize} />,
      title: "Cardiologia",
      description: "Sintomas cardíacos, fatores de risco e histórico familiar",
    },
    {
      icon: <Brain size={iconSize} />,
      title: "Neurologia",
      description: "Sinais neurológicos, reflexos e histórico neurológico",
    },
    {
      icon: <Baby size={iconSize} />,
      title: "Pediatria",
      description:
        "Linguagem adaptada à idade, calendário vacinal e antecedentes",
    },
    {
      icon: <UserRound size={iconSize} />,
      title: "Ginecologia",
      description: "Ciclo, queixas ginecológicas e saúde reprodutiva",
    },
    {
      icon: <ActivitySquare size={iconSize} />,
      title: "Ortopedia",
      description: "Dor musculoesquelética, traumas e exames de imagem",
    },
    {
      icon: <Stethoscope size={iconSize} />,
      title: "Clínica Geral",
      description: "Queixas variadas e rastreios comuns",
    },
  ];

  return (
    <section id="specialties" className="py-16 md:py-24 bg-white relative">
      <div className="relative w-full px-4 md:px-0">
        <div
          className="text-center max-w-3xl mx-auto mb-8 md:mb-12 fade-in-section"
          style={{ "--delay": "100ms" } as React.CSSProperties}
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-4">
            Personalizada para sua{" "}
            <span className="gradient-text">especialidade.</span>
          </h2>
          <p className="text-sm md:text-md lg:text-xl text-ally-gray px-4">
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
          <div className="absolute inset-y-0 left-0 w-6 md:w-12 bg-gradient-to-r from-white to-transparent pointer-events-none z-10"></div>
          <div className="absolute inset-y-0 right-0 w-6 md:w-12 bg-gradient-to-l from-white to-transparent pointer-events-none z-10"></div>

          <Carousel
            opts={{
              align: "start",
              loop: true,
              active: true,
            }}
            setApi={setCarouselApi}
          >
            <CarouselContent className="flex mx-4 md:mx-0">
              {specialties.map((specialty, index) => (
                <CarouselItem
                  key={index}
                  className={`pl-2 md:pl-4 ${
                    isMobile ? "basis-1/2" : "md:basis-1/3 lg:basis-1/4"
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
