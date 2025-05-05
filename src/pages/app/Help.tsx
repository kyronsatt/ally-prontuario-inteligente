import React from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Help: React.FC = () => {
  const navigate = useNavigate();

  const faqItems = [
    {
      question: "Como iniciar um novo atendimento?",
      answer:
        "Para iniciar um novo atendimento, clique em 'Novo Atendimento' no menu lateral. Você poderá escolher entre um paciente novo ou retorno de paciente.",
    },
    {
      question: "Como funciona a geração de anamnese?",
      answer:
        "Durante o atendimento, o Ally captura o áudio da consulta e o transcreve em tempo real. Ao finalizar, a IA processa o conteúdo e gera automaticamente a anamnese com base no diálogo, economizando tempo de documentação.",
    },
    {
      question: "É possível editar a anamnese gerada?",
      answer:
        "Sim! Após a geração da anamnese, você pode editá-la utilizando o editor de texto no formato WYSIWYG que suporta formatação Markdown.",
    },
    {
      question: "Como acessar o histórico de consultas?",
      answer:
        "Acesse o histórico de consultas clicando em 'Histórico' no menu lateral, onde você poderá visualizar e buscar todas as consultas anteriores.",
    },
    {
      question: "Como atualizar minhas informações de perfil?",
      answer:
        "Acesse a seção 'Perfil' no menu lateral para atualizar suas informações pessoais e profissionais.",
    },
  ];

  return (
    <div className="max-w-3xl mx-auto">
      <Button variant="ghost" className="mb-6" onClick={() => navigate("/app")}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Voltar ao dashboard
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Central de Ajuda</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Bem-vindo à central de ajuda do Ally! Aqui você encontrará
              respostas para as perguntas mais frequentes sobre o uso da
              plataforma.
            </p>

            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="font-medium">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground">{item.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <div className="mt-8 p-4 bg-ally-light rounded-lg">
              <h3 className="font-medium mb-2 text-ally-blue">
                Precisa de mais ajuda?
              </h3>
              <p className="text-sm text-muted-foreground">
                Entre em contato com nosso suporte técnico através do email{" "}
                <a
                  href="mailto:suporte@ally.med.br"
                  className="text-ally-blue underline"
                >
                  suporte@ally.med.br
                </a>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Help;
