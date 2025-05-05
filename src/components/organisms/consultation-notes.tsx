
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { InfoIcon, Trash2 } from "lucide-react";

interface ConsultationNotesProps {
  notes: string;
  setNotes: (notes: string) => void;
}

const ConsultationNotes: React.FC<ConsultationNotesProps> = ({ notes, setNotes }) => {
  const handleClearNotes = () => {
    if (notes.trim() && window.confirm("Deseja realmente limpar todas as anotações?")) {
      setNotes("");
    }
  };

  return (
    <Card className="h-full border-ally-blue/30">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl text-ally-blue">
          Anotações Médicas Durante Consulta
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Paciente relata piora noturna dos sintomas..."
          className="min-h-[calc(100vh-300px)] resize-none border-ally-blue/30 focus-visible:ring-ally-blue"
        />
        
        <div className="mt-4 flex justify-between items-start">
          <div className="flex items-start space-x-2 text-xs text-gray-500 max-w-[80%]">
            <InfoIcon className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <p>
              Essas anotações serão priorizadas na geração automática do prontuário ao final da consulta.
            </p>
          </div>

          <Button 
            variant="outline" 
            size="sm"
            onClick={handleClearNotes}
            className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Limpar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConsultationNotes;
