"use client";
import React, { useEffect, useState } from "react";
import UploadFileIcon from "@/public/svgs/material-symbols-light--upload-file-rounded.svg";
import HorizontalRuleIcon from "@/public/svgs/material-symbols-light--horizontal-rule-rounded.svg";
import CloseIcon from "@/public/svgs/material-symbols-light--close-rounded.svg";
import Select from "@/components/Select";
import TextEditor from "@/components/TextEditor";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  className?: string;
}

export default function Modal({
  open,
  onClose,
  title = "Sample Modal",
  className = "",
}: ModalProps) {
  const [selectedTags, setSelectedTags] = useState<
    Array<{ text: string; href: string }>
  >([]);
  const [editorTitle, setEditorTitle] = useState("");
  const [editorContent, setEditorContent] = useState("");
  const [link, setLink] = useState("");

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      aria-modal="true"
      role="dialog"
      tabIndex={-1}
      onClick={onClose}
    >
      <div
        className="max-h-5xl flex h-[85vh] w-[90vw] max-w-5xl flex-col rounded-lg bg-[var(--color-base-000)] inset-ring inset-ring-[var(--color-base-400)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Titlebar interna */}
        <div className="flex items-center p-1.5">
          <div className="ml-auto flex h-full items-center">
            <button
              aria-label="Minimize"
              className="inline-flex items-center justify-center rounded-sm px-1.5 py-1 text-[var(--color-base-700)] transition hover:bg-white/7"
              type="button"
              onClick={() => alert("Minimizar")}
            >
              <HorizontalRuleIcon className="h-4.5 w-4.5" />
            </button>
            <button
              aria-label="Close window"
              className="inline-flex items-center justify-center rounded-sm px-1.5 py-1 text-[var(--color-base-700)] transition hover:bg-white/7"
              type="button"
              onClick={onClose}
            >
              <CloseIcon className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>
        <div className="flex gap-12 px-12 py-8">
          <div className="relative h-[340px] w-[279px]">
            {/* Choose a file or drag and drop it here */}
            <div className="bg-300 pointer-events-none flex h-full w-full flex-col items-center justify-center rounded-lg border border-dashed border-[var(--color-base-300)] bg-[var(--color-base-250)] p-4">
              <UploadFileIcon className="h-6 w-6" />
              <p className="max-w-[165px] pt-1.5 text-center font-[Mona_Sans] text-[15px] leading-[1.3] text-[var(--color-base-950)]">
                Choose a file or drag and drop it here
              </p>
              <div className="absolute bottom-0 px-4.5 py-6">
                <p className="text-center font-[Mona_Sans] text-[12px] leading-[1.3] text-[var(--color-base-700)]">
                  We recommend using high quality .jpg files less than 20 MB or
                  .mp4 files less than 200 MB
                </p>
              </div>
            </div>
            <input
              type="file"
              className="absolute top-0 left-0 h-full cursor-pointer opacity-0"
            />
          </div>

          {/* Content */}
          <div className="flex-1">
            <TextEditor
              title={editorTitle}
              content={editorContent}
              onTitleChange={setEditorTitle}
              onContentChange={setEditorContent}
              className="mb-[15px]"
            />
            <input
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="mb-[15px] h-[30px] w-full rounded-[5px] border border-[var(--color-base-300)] bg-[var(--color-base-250)] px-2 py-1 font-[Mona_Sans] text-[13px] text-[var(--color-base-950)] outline-0 transition hover:border-[var(--color-base-350)]"
              placeholder="Link (optional)"
            />
            <Select
              placeholder="Tags"
              className="mb-[15px]"
              onChange={setSelectedTags}
            />
            <button className="focus-visible:shadow-[0 0 0 3px var(--background-modifier-border-focus)] mb-[15px] h-[30px] w-full cursor-pointer rounded-[5px] bg-[var(--color-accent-600)] px-2 py-1 font-[Mona_Sans] text-[13px] text-white shadow-[var(--input-shadow)] outline-0 transition hover:bg-[var(--color-accent-500)] hover:shadow-[var(--input-shadow-hover)]">
              Create
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
