
import React from "react";

interface SectionItemProps {
  title: string;
  content: string;
}

const SectionItem: React.FC<SectionItemProps> = ({ title, content }) => {
  return (
    <div className="border-b border-gray-200 pb-3">
      <h3 className="font-medium text-md text-ally-blue mb-1">
        {title}
      </h3>
      <div
        className="text-sm text-gray-700"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
};

export default SectionItem;
