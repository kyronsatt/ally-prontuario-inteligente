
import React from "react";
import { CheckCheck } from "lucide-react";

const NotesInfo = () => (
  <div className="flex items-start space-x-2 text-xs text-gray-500 w-full lg:max-w-[80%]">
    <CheckCheck className="h-4 w-4 flex-shrink-0" />
    <p>
      Não se preocupe em preencher: a Ally não depende dessas anotações.
    </p>
  </div>
);

export default NotesInfo;
