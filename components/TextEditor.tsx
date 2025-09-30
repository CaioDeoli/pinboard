"use client";
import React, {
  useRef,
  useEffect,
  useCallback,
  useState,
  KeyboardEvent,
  ClipboardEvent,
} from "react";

interface TextEditorProps {
  content?: string;
  onContentChange?: (html: string, plain: string) => void;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
  title?: string;
  onTitleChange?: (title: string) => void;
}

const LINE_CLASS =
  "cd-text-edit-line block relative m-0 p-0";

export default function TextEditor({
  content = "",
  onContentChange,
  placeholder = "",
  className = "",
  autoFocus = false,
  title = "",
  onTitleChange,
}: TextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isEmpty, setIsEmpty] = useState(true);

  const processContent = useCallback((htmlContent: string) => {
    if (!editorRef.current || htmlContent.includes("cd-text-edit-line")) return;

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlContent;

    const lines: string[] = [];
    const processNode = (node: Node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent || "";
        const textLines = text.split("\n");
        textLines.forEach((line, index) => {
          if (index > 0) lines.push("");
          if (line || index < textLines.length - 1) {
            lines.push(line);
          }
        });
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as Element;
        if (element.tagName === "BR") {
          lines.push("");
        } else {
          const text = element.textContent || "";
          if (text) lines.push(text);
        }
      }
    };

    Array.from(tempDiv.childNodes).forEach(processNode);

    if (lines.length === 0) lines.push("");

    editorRef.current.innerHTML = "";

    lines.forEach((lineContent) => {
      const lineDiv = document.createElement("div");
      lineDiv.className = LINE_CLASS;
      lineDiv.setAttribute("dir", "ltr");
      lineDiv.innerHTML = lineContent === "" ? "<br>" : lineContent;
      editorRef.current!.appendChild(lineDiv);
    });
  }, []);

  const getPlainText = useCallback(() => {
    if (!editorRef.current) return "";
    const lines = editorRef.current.querySelectorAll(`.${LINE_CLASS.split(" ")[0]}`);
    return Array.from(lines)
      .map((line) => line.textContent || "")
      .join("\n");
  }, []);

  const getFormattedHTML = useCallback(() => {
    return editorRef.current?.innerHTML || "";
  }, []);

  const handleInput = useCallback(() => {
    if (onContentChange && editorRef.current) {
      const htmlContent = getFormattedHTML();
      const plainText = getPlainText();
      onContentChange(htmlContent, plainText);
      setIsEmpty(plainText.trim() === "");
    }
  }, [getFormattedHTML, getPlainText, onContentChange]);

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.ctrlKey) {
      e.preventDefault();

      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;

      const range = selection.getRangeAt(0);
      let currentLine = range.commonAncestorContainer as Node;
      if (currentLine.nodeType === Node.TEXT_NODE) {
        currentLine = currentLine.parentElement!;
      }

      if (
        currentLine instanceof HTMLElement &&
        !currentLine.classList.contains(LINE_CLASS.split(" ")[0])
      ) {
        currentLine = currentLine.closest(`.${LINE_CLASS.split(" ")[0]}`)!;
      }

      if (currentLine) {
        const newLine = document.createElement("div");
        newLine.className = LINE_CLASS;
        newLine.setAttribute("dir", "ltr");
        newLine.appendChild(document.createElement("br"));

        currentLine.parentNode!.insertBefore(newLine, currentLine.nextSibling);

        const newRange = document.createRange();
        newRange.setStart(newLine, 0);
        newRange.collapse(true);
        selection.removeAllRanges();
        selection.addRange(newRange);
      }

      return;
    }

    // Ctrl+B → bold
    if (e.key.toLowerCase() === "b" && e.ctrlKey) {
      e.preventDefault();
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        if (!range.collapsed) {
          const strong = document.createElement("strong");
          try {
            range.surroundContents(strong);
          } catch {
            // fallback: insert bold manually
            const strong = document.createElement("strong");
            strong.textContent = range.toString();
            range.deleteContents();
            range.insertNode(strong);
          }
        } else {
          const strong = document.createElement("strong");
          strong.appendChild(document.createTextNode(""));
          range.insertNode(strong);

          const newRange = document.createRange();
          newRange.setStart(strong, 0);
          newRange.collapse(true);
          selection.removeAllRanges();
          selection.addRange(newRange);
        }
      }
    }
  }, []);

  const handlePaste = useCallback(
    (e: ClipboardEvent<HTMLDivElement>) => {
      e.preventDefault();
      const text = e.clipboardData.getData("text/plain");

      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        range.insertNode(document.createTextNode(text));
      }

      setTimeout(handleInput, 0);
    },
    [handleInput]
  );

  useEffect(() => {
    if (editorRef.current && content) {
      processContent(content);
    }
  }, [content, processContent]);

  useEffect(() => {
    if (autoFocus && editorRef.current) {
      editorRef.current.focus();
    }
  }, [autoFocus]);

  useEffect(() => {
    if (editorRef.current && !editorRef.current.innerHTML) {
      const lineDiv = document.createElement("div");
      lineDiv.className = LINE_CLASS;
      lineDiv.setAttribute("dir", "ltr");
      lineDiv.innerHTML = "<br>";
      editorRef.current.appendChild(lineDiv);
    }
  }, []);

  return (
    <div className={`${className} relative`} style={{ counterReset: "line-number" }}>
      {/* Title */}
      {title !== undefined && (
        <div className="mb-4">
          <input
            type="text"
            value={title}
            onChange={(e) => onTitleChange?.(e.target.value)}
            placeholder="New pin"
            className="block font-['Mona_Sans'] text-[29px] leading-[1.2] font-bold tracking-tight text-[var(--color-base-950)] outline-none placeholder:text-[var(--color-base-600)]"
          />
        </div>
      )}

      {/* Editor */}
      <div className="flex flex-1 items-stretch font-['Mona_Sans'] text-[16px] leading-[1.5] relative">
        {isEmpty && placeholder && (
          <span className="absolute top-0 left-0 text-gray-400 pointer-events-none select-none">
            {placeholder}
          </span>
        )}
        <div
          ref={editorRef}
          className="m-0 block flex-1 min-h-[unset] break-keep whitespace-pre-wrap caret-[var(--color-base-950)] outline-none select-text w-100"
          spellCheck
          autoCorrect="on"
          autoCapitalize="on"
          translate="no"
          contentEditable
          role="textbox"
          aria-multiline
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
        />
      </div>
    </div>
  );
}
