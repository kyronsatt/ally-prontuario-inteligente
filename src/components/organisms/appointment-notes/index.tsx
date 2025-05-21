
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NotepadText } from "lucide-react";
import NotesTextarea from "@/components/molecules/appointment-notes/notes-textarea";
import NotesInfo from "@/components/molecules/appointment-notes/notes-info";
import ClearButton from "@/components/molecules/appointment-notes/clear-button";

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
    <Card className="flex flex-col h-fit lg:h-1/3 border-ally-blue/30">
      <CardHeader className="py-2">
        <CardTitle className="flex gap-2 items-center text-md lg:text-lg text-ally-blue">
          <NotepadText size={16} />
          Anotações Adicionais
        </CardTitle>
      </CardHeader>
      <CardContent className="h-full overflow-y-auto py-3">
        <NotesTextarea 
          value={notes} 
          onChange={(e) => setNotes(e.target.value)} 
        />

        <div className="mt-4 flex flex-col gap-2 lg:gap-0 lg:flex-row justify-between items-start">
          <NotesInfo />
          <ClearButton 
            disabled={!notes || notes === ""} 
            onClick={handleClearNotes}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default AppointmentNotes;
