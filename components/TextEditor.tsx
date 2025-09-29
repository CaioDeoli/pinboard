"use client";
import React, { useRef, useEffect, useCallback } from "react";

interface TextEditorProps {
  content?: string;
  onContentChange?: (content: string) => void;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
  title?: string;
  onTitleChange?: (title: string) => void;
}

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
  const containerRef = useRef<HTMLDivElement>(null);

  // Função para processar o conteúdo e criar elementos cd-text-edit-line
  const processContent = useCallback((htmlContent: string) => {
    if (!editorRef.current) return;

    // Se já tem elementos cd-text-edit-line, não processa novamente
    if (
      htmlContent.includes(
        "cd-text-edit-line block relative m-0 p-0 max-w-[700px]",
      )
    ) {
      return;
    }

    // Criar um elemento temporário para parsear o HTML
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlContent;

    // Dividir o conteúdo em linhas baseado em quebras de linha
    const lines: string[] = [];
    const processNode = (node: Node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent || "";
        const textLines = text.split("\n");
        textLines.forEach((line, index) => {
          if (index > 0) lines.push(""); // Adiciona linha vazia para quebras
          if (line || index < textLines.length - 1) {
            lines.push(line);
          }
        });
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as Element;
        if (element.tagName === "BR") {
          lines.push(""); // Quebra de linha
        } else {
          // Para outros elementos, extrair texto
          const text = element.textContent || "";
          if (text) {
            lines.push(text);
          }
        }
      }
    };

    Array.from(tempDiv.childNodes).forEach(processNode);

    // Se não há linhas, cria uma vazia
    if (lines.length === 0) {
      lines.push("");
    }

    // Limpar o editor
    editorRef.current.innerHTML = "";

    // Criar elementos cd-text-edit-line para cada linha
    lines.forEach((lineContent, index) => {
      const lineDiv = document.createElement("div");
      lineDiv.className =
        "cd-text-edit-line block relative m-0 p-0 max-w-[700px]";
      lineDiv.setAttribute("dir", "ltr");

      if (lineContent === "") {
        // Linha vazia
        lineDiv.innerHTML = "<br>";
      } else {
        // Linha com conteúdo
        lineDiv.textContent = lineContent;
      }

      editorRef.current?.appendChild(lineDiv);
    });
  }, []);

  // Função para obter o texto plano (sem HTML)
  const getPlainText = useCallback(() => {
    if (editorRef.current) {
      const lineElements =
        editorRef.current.querySelectorAll(".cd-text-edit-line");
      return Array.from(lineElements)
        .map((line) => line.textContent || "")
        .join("\n");
    }
    return "";
  }, []);

  // Função para obter o HTML formatado
  const getFormattedHTML = useCallback(() => {
    if (editorRef.current) {
      return editorRef.current.innerHTML || "";
    }
    return "";
  }, []);

  useEffect(() => {
    if (editorRef.current && content) {
      processContent(content);
    }
  }, [content, processContent]);

  const handleInput = useCallback(() => {
    if (onContentChange && editorRef.current) {
      // Processa o conteúdo para manter a estrutura cd-text-edit-line
      const currentHTML = editorRef.current.innerHTML;

      // Se não há elementos cd-text-edit-line, processa o conteúdo
      if (
        !currentHTML.includes(
          "cd-text-edit-line block relative m-0 p-0 max-w-[700px]",
        )
      ) {
        processContent(currentHTML);
      }

      const htmlContent = getFormattedHTML();
      const plainText = getPlainText();

      // Chama o callback apenas se o conteúdo realmente mudou
      if (htmlContent !== content) {
        onContentChange(htmlContent);
      }
    }
  }, [
    onContentChange,
    getFormattedHTML,
    getPlainText,
    content,
    processContent,
  ]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    // Permite Enter para nova linha (com Shift+Enter também funciona)
    if (e.key === "Enter" && !e.shiftKey && !e.ctrlKey) {
      e.preventDefault();

      // Insere uma nova linha cd-text-edit-line
      if (editorRef.current) {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);

          // Encontra o elemento pai atual
          let currentLine: Node | null = range.commonAncestorContainer;
          if (currentLine.nodeType === Node.TEXT_NODE) {
            currentLine = currentLine.parentElement;
          }

          // Se não é um cd-text-edit-line, encontra o cd-text-edit-line pai
          if (
            currentLine &&
            currentLine instanceof HTMLElement &&
            !currentLine.classList.contains(
              "cd-text-edit-line block relative m-0 p-0 max-w-[700px]",
            )
          ) {
            const closestLine = currentLine.closest(
              ".cd-text-edit-line",
            ) as HTMLElement | null;
            currentLine = closestLine;
          }

          if (
            currentLine &&
            currentLine instanceof HTMLElement &&
            currentLine.classList.contains("cd-text-edit-line")
          ) {
            // Cria nova linha após a atual
            const newLine = document.createElement("div");
            newLine.className =
              "cd-text-edit-line block relative m-0 p-0 max-w-[700px]";
            newLine.setAttribute("dir", "ltr");
            newLine.innerHTML = "<br>";

            if (currentLine.parentNode) {
              currentLine.parentNode.insertBefore(
                newLine,
                currentLine.nextSibling,
              );
            }

            // Move o cursor para a nova linha
            const newRange = document.createRange();
            newRange.setStart(newLine, 0);
            newRange.setEnd(newLine, 0);
            selection.removeAllRanges();
            selection.addRange(newRange);
          }
        }
      }
      return;
    }

    // Ctrl+B para negrito
    if (e.key === "b" && e.ctrlKey) {
      e.preventDefault();
      document.execCommand("insertHTML", false, "<strong></strong>");
      const selection = window.getSelection();
      if (selection) {
        const range = selection.getRangeAt(0);
        const strongTagLength = 9; // Length of "<strong></strong>"
        range.setStart(
          range.endContainer,
          Math.max(0, range.endOffset - strongTagLength),
        );
        range.setEnd(
          range.endContainer,
          Math.max(0, range.endOffset - strongTagLength),
        );
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  }, []);

  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      e.preventDefault();
      const text = e.clipboardData.getData("text/plain");

      // Se há seleção, substitui, senão insere
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        range.insertNode(document.createTextNode(text));
      } else {
        document.execCommand("insertText", false, text);
      }

      // Força o processamento do conteúdo
      setTimeout(() => {
        if (
          editorRef.current &&
          !editorRef.current.innerHTML.includes(
            "cd-text-edit-line block relative m-0 p-0 max-w-[700px]",
          )
        ) {
          processContent(editorRef.current.innerHTML);
        }
      }, 0);
    },
    [processContent],
  );

  useEffect(() => {
    if (autoFocus && editorRef.current) {
      editorRef.current.focus();
    }
  }, [autoFocus]);

  // Inicializa o editor com uma linha vazia se necessário
  useEffect(() => {
    if (editorRef.current && !editorRef.current.innerHTML) {
      const lineDiv = document.createElement("div");
      lineDiv.className =
        "cd-text-edit-line block relative m-0 p-0 max-w-[700px]";
      lineDiv.setAttribute("dir", "ltr");
      lineDiv.innerHTML = "<br>";
      editorRef.current.appendChild(lineDiv);
    }
  }, []);

  // Gerenciar placeholder dinamicamente
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    const updatePlaceholder = () => {
      const isEmpty = editor.textContent?.trim() === "";
      editor.classList.toggle("empty", isEmpty);
    };

    updatePlaceholder();

    const observer = new MutationObserver(updatePlaceholder);
    observer.observe(editor, {
      childList: true,
      characterData: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, [placeholder]);

  return (
    <div
      className={`${className}`}
      style={{
        counterReset: "line-number",
      }}
    >
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

      {/* Container */}
      <div
        ref={containerRef}
        className="flex flex-1 items-stretch overflow-x-visible font-['Mona_Sans'] text-[16px] leading-[1.5]"
      >
        {/* Editor */}
        <div
          ref={editorRef}
          className="m-0 block min-h-[unset] w-0 max-w-[700px] shrink grow-2 basis-[unset] p-0 pb-[277px] wrap-break-word break-keep whitespace-break-spaces caret-[var(--color-base-950)] outline-none select-text"
          spellCheck={true}
          autoCorrect="on"
          autoCapitalize="on"
          translate="no"
          contentEditable={true}
          role="textbox"
          aria-multiline={true}
          data-placeholder={placeholder}
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
        />
      </div>
    </div>
  );
}
