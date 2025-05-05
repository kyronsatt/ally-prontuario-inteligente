import React from "react";
import { Calendar } from "lucide-react";
import moment from "moment";

interface AppointmentCardProps {
  id: string;
  name: string;
  date: string;
  type: string;
  onClick: () => void;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({
  id,
  name,
  date,
  type,
  onClick,
}) => {
  const formattedDate = moment(date).format("DD/MM/YY [às] HH:mm");

  return (
    <div
      key={id}
      className={
        "border rounded-lg hover:bg-gray-50 cursor-pointer overflow-clip transition-colors"
      }
      onClick={onClick}
    >
      <div className="flex flex-row rounded-lg">
        <div className="w-2 bg-gradient-to-b from-ally-blue to-[#00e6e6]" />
        <div className="flex w-full justify-between items-center px-4 py-3">
          <div>
            <h3 className="font-medium text-lg text-gray-600">{name}</h3>
          </div>
          <div className="text-right">
            <div className="flex items-center justify-end text-sm text-gray-600 mb-1">
              <Calendar className="h-3.5 w-3.5 mr-1" />
              {formattedDate}
            </div>
            <span
              className={`text-xs px-2 py-1 rounded-full ${
                type === "new"
                  ? "bg-blue-50 text-blue-700"
                  : "bg-green-50 text-green-700"
              }`}
            >
              {type === "new" ? "Novo" : "Retorno"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentCard;
