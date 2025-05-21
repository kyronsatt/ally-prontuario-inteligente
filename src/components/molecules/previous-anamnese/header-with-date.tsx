
import React from "react";
import moment from "moment";
import { Calendar, HistoryIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface HeaderWithDateProps {
  date?: string;
}

const HeaderWithDate: React.FC<HeaderWithDateProps> = ({ date }) => {
  const formattedDate = date ? moment(date).format("DD/MM/YY") : "";

  return (
    <div className="py-2 flex flex-row justify-between items-center text-ally-blue">
      <div className="flex gap-2 items-center text-md lg:text-lg">
        <HistoryIcon size={16} />
        <p>Última Anamnese</p>
      </div>
      {date && (
        <Badge
          variant="outline"
          className="items-center flex gap-1 text-sm font-light opacity-80 text-ally-gray"
        >
          <Calendar size={16} /> {formattedDate}
        </Badge>
      )}
    </div>
  );
};

export default HeaderWithDate;
