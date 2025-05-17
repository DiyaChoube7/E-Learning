import React, { useState, useRef, useMemo } from "react";
import JoditEditor from "jodit-react";

const RichTextEditor = ({input, setInput}) => {
  const editor = useRef(null);

  const handleBlur = (newContent) => {
    setInput({ ...input, description: newContent });
  };

  const handleChange = (newContent) => {
    setInput((prev) => ({ ...prev, description: newContent }));
  };

  const config = {
    placeholder: "Write your course description...",
    buttons: [
      "bold",
      "italic",
      "underline",
      "|",
      "ul",
      "ol",
      "|",
      "h1",
      "h2",
      "h3",
      "|",
      "link",
    ],
    toolbarSticky: false,
    showCharsCounter: false,
    showWordsCounter: false,
    showXPathInStatusbar: false,
    spellcheck: true,
    minHeight: 300,
  };

  return (
    <div>
      <JoditEditor
        ref={editor}
        config={config}
        value={input?.description}
        tabIndex={1}
        onBlur={handleBlur} // updates content when focus is lost
        onChange={handleChange}
      />
    </div>
  );
};

export default RichTextEditor;
