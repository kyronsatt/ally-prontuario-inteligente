
import React, { useState } from "react";
import { Bold, Italic, List, ListOrdered, Heading } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface MarkdownEditorProps {
  content: string;
  onChange: (content: string) => void;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ content, onChange }) => {
  const [previewMode, setPreviewMode] = useState<boolean>(false);
  
  const handleInsert = (markdown: string) => {
    const textarea = document.getElementById("markdown-editor") as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = content.substring(start, end);
      
      let newContent;
      if (markdown === "**") {
        newContent = content.substring(0, start) + `**${selectedText}**` + content.substring(end);
      } else if (markdown === "*") {
        newContent = content.substring(0, start) + `*${selectedText}*` + content.substring(end);
      } else if (markdown === "# ") {
        newContent = content.substring(0, start) + `# ${selectedText}` + content.substring(end);
      } else if (markdown === "- ") {
        newContent = content.substring(0, start) + `- ${selectedText}` + content.substring(end);
      } else if (markdown === "1. ") {
        newContent = content.substring(0, start) + `1. ${selectedText}` + content.substring(end);
      }
      
      onChange(newContent);
      
      // Set focus back to textarea with correct cursor position
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(
          start + markdown.length,
          end + markdown.length
        );
      }, 0);
    }
  };
  
  const renderMarkdown = (md: string) => {
    // Simple markdown rendering for preview
    let html = md
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/# (.*?)(\n|$)/g, '<h1>$1</h1>')
      .replace(/## (.*?)(\n|$)/g, '<h2>$1</h2>')
      .replace(/### (.*?)(\n|$)/g, '<h3>$1</h3>')
      .replace(/- (.*?)(\n|$)/g, '<li>$1</li>')
      .replace(/\n/g, '<br />');
    
    return { __html: html };
  };
  
  return (
    <div className="border rounded-md p-2">
      <div className="flex items-center gap-1 mb-2 bg-gray-50 p-2 rounded">
        <Button 
          type="button" 
          size="sm" 
          variant="ghost" 
          onClick={() => handleInsert('**')}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button 
          type="button" 
          size="sm" 
          variant="ghost" 
          onClick={() => handleInsert('*')}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button 
          type="button" 
          size="sm" 
          variant="ghost" 
          onClick={() => handleInsert('# ')}
        >
          <Heading className="h-4 w-4" />
        </Button>
        <Button 
          type="button" 
          size="sm" 
          variant="ghost" 
          onClick={() => handleInsert('- ')}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button 
          type="button" 
          size="sm" 
          variant="ghost" 
          onClick={() => handleInsert('1. ')}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <div className="ml-auto">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => setPreviewMode(!previewMode)}
          >
            {previewMode ? "Editar" : "Visualizar"}
          </Button>
        </div>
      </div>
      
      {previewMode ? (
        <div 
          className="min-h-[200px] p-2 prose" 
          dangerouslySetInnerHTML={renderMarkdown(content)} 
        />
      ) : (
        <Textarea
          id="markdown-editor"
          value={content}
          onChange={(e) => onChange(e.target.value)}
          className="min-h-[200px] resize-y font-mono"
        />
      )}
    </div>
  );
};

export default MarkdownEditor;
