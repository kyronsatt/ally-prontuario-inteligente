import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "react-quill/dist/quill.bubble.css";

import "./style.css";

interface RichTextEditorProps {
  id: string;
  content: string;
  onChange: (content: string) => void;
  isEditable: boolean;
}

const toolbarOptions = [["bold", "italic", "underline"]];

const modules = {
  toolbar: toolbarOptions,
};

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  id,
  content,
  onChange,
  isEditable,
}) => {
  if (!isEditable) {
    return (
      <div
        className="ql-editor"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }

  return (
    <ReactQuill
      key={`${id}-${isEditable}`}
      theme="snow"
      value={content}
      onChange={onChange}
      modules={modules}
    />
  );
};

export default RichTextEditor;
