import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CheckCheck, NotepadText, Trash2 } from "lucide-react";

interface AppointmentNotesProps {
  notes: string;
  setNotes: (notes: string) => void;
}

const AppointmentNotes: React.FC<AppointmentNotesProps> = ({
  notes,
  setNotes,
}) => {
  const handleClearNotes = () => {
    if (
      notes.trim() &&
      window.confirm("Deseja realmente limpar todas as anotações?")
    ) {
      setNotes("");
    }
  };

  return (
    <Card className="flex flex-col h-full border-ally-blue/30">
      <CardHeader className="py-2">
        <CardTitle className="flex gap-2 items-center text-md lg:text-lg text-ally-blue">
          <NotepadText size={16} />
          Anotações Adicionais
        </CardTitle>
      </CardHeader>
      <CardContent className="h-full overflow-y-auto py-3">
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Use este espaço livremente. Suas anotações podem ajudar a Ally a entender melhor o contexto."
          className="resize-none placeholder:italic border-ally-blue/30 focus-visible:ring-ally-blue bg-gray-50 focus:bg-white"
        />

        <div className="mt-4 flex flex-col gap-2 lg:gap-0 lg:flex-row justify-between items-start">
          <div className="flex items-start space-x-2 text-xs text-gray-400 w-full lg:max-w-[80%]">
            <CheckCheck className="h-4 w-4 flex-shrink-0" />
            <p>
              Não se preocupe em preencher: a Ally não depende dessas anotações.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            disabled={!notes || notes === ""}
            onClick={handleClearNotes}
            className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 w-full lg:w-fit"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Limpar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppointmentNotes;
