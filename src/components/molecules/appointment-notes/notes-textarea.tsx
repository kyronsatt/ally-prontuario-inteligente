
import React from "react";
import { Textarea } from "@/components/ui/textarea";

interface NotesTextareaProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const NotesTextarea: React.FC<NotesTextareaProps> = ({ value, onChange }) => (
  <Textarea
    value={value}
    onChange={onChange}
    placeholder="Use este espaço livremente. Suas anotações podem ajudar a Ally a entender melhor o contexto."
    className="resize-none placeholder:italic border-ally-blue/30 focus-visible:ring-ally-blue bg-gray-50 focus:bg-white"
  />
);

export default NotesTextarea;
