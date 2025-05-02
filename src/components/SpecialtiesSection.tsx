
import React from 'react';
import { Heart, Brain, Baby, UserRound, ActivitySquare, Stethoscope } from 'lucide-react';
import {
  Carousel,
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
import { useIsMobile } from '@/hooks/use-mobile';

interface SpecialtyCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const SpecialtyCard: React.FC<SpecialtyCardProps> = ({ icon, title, description }) => {
  return (
    <Card className="h-full border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-2 text-center">
        <div className="flex justify-center mb-2">
          <div className="p-3 rounded-full bg-ally-light text-ally-blue">
            {icon}
          </div>
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <CardDescription className="text-ally-gray">{description}</CardDescription>
      </CardContent>
    </Card>
  );
};

const SpecialtiesSection: React.FC = () => {
  const isMobile = useIsMobile();
  
  const specialties = [
    {
      icon: <Heart size={24} />,
      title: "Cardiologia",
      description: "Sintomas cardíacos, fatores de risco e histórico familiar"
    },
    {
      icon: <Brain size={24} />,
      title: "Neurologia",
      description: "Sinais neurológicos, reflexos e histórico neurológico"
    },
    {
      icon: <Baby size={24} />,
      title: "Pediatria",
      description: "Linguagem adaptada à idade, calendário vacinal e antecedentes"
    },
    {
      icon: <UserRound size={24} />,
      title: "Ginecologia",
      description: "Ciclo, queixas ginecológicas e saúde reprodutiva"
    },
    {
      icon: <ActivitySquare size={24} />,
      title: "Ortopedia",
      description: "Dor musculoesquelética, traumas e exames de imagem"
    },
    {
      icon: <Stethoscope size={24} />,
      title: "Clínica Geral",
      description: "Queixas variadas e rastreios comuns"
    }
  ];

  return (
    <section id="specialties" className="section-spacing bg-white">
      <div className="container-ally">
        <div className="text-center max-w-3xl mx-auto mb-12 fade-in-section" style={{ '--delay': '100ms' } as React.CSSProperties}>
          <h2 className="heading-lg mb-4">
            Personalizada para sua <span className="gradient-text">especialidade.</span>
          </h2>
          <p className="text-xl text-ally-gray">
            A Ally adapta a estrutura da anamnese, termos clínicos e sugestões conforme sua área de atuação – para você ter mais precisão, relevância e agilidade em cada atendimento.
          </p>
        </div>

        <div className="fade-in-section" style={{ '--delay': '200ms' } as React.CSSProperties}>
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {specialties.map((specialty, index) => (
                <CarouselItem key={index} className={`pl-4 ${isMobile ? 'basis-full' : 'basis-1/2 md:basis-1/3'}`}>
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
            <div className="flex justify-center mt-8 gap-4">
              <CarouselPrevious className="static relative transform-none" />
              <CarouselNext className="static relative transform-none" />
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default SpecialtiesSection;
