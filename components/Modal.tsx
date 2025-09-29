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

export default function Modal({ open, onClose, title = "Sample Modal", className = "" }: ModalProps) {
  const [selectedTags, setSelectedTags] = useState<Array<{ text: string; href: string }>>([]);
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
        className="bg-[var(--color-base-000)] inset-ring inset-ring-[var(--color-base-400)] h-[85vh] w-[90vw] max-h-5xl max-w-5xl flex flex-col rounded-lg"
        onClick={e => e.stopPropagation()}
      >
        {/* Titlebar interna */}
        <div className="flex items-center p-1.5">
          <div className="ml-auto flex h-full items-center">
            <button
              aria-label="Minimize"
              className="hover:bg-white/7 text-[var(--color-base-700)] py-1 px-1.5 rounded-sm inline-flex items-center justify-center transition"
              type="button"
              onClick={() => alert('Minimizar')}
            >
              <HorizontalRuleIcon className="w-4.5 h-4.5" />
            </button>
            <button
              aria-label="Close window"
              className="hover:bg-white/7 text-[var(--color-base-700)] py-1 px-1.5 rounded-sm inline-flex items-center justify-center transition"
              type="button"
              onClick={onClose}
            >
              <CloseIcon className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>
        <div className="flex gap-12 py-8 px-12">
          <div
            className="relative w-[279px] h-[340px]"
          >
            {/* Choose a file or drag and drop it here */}
            <div
              className="bg-300 rounded-lg p-4 bg-[var(--color-base-250)] border border-dashed border-[var(--color-base-300)] h-full w-full flex flex-col items-center justify-center pointer-events-none"
            >
              <UploadFileIcon className="w-6 h-6" />
              <p className="font-[Mona_Sans] text-[15px] text-[var(--color-base-950)] leading-[1.3] text-center max-w-[165px] pt-1.5">Choose a file or drag and drop it here</p>
              <div className="absolute bottom-0 py-6 px-4.5">
                <p className="font-[Mona_Sans] text-[12px] text-[var(--color-base-700)] leading-[1.3] text-center">We recommend using high quality .jpg files less than 20 MB or .mp4 files less than 200 MB</p>
              </div>
            </div>
            <input
              type="file"
              className="top-0 left-0 absolute opacity-0 h-full cursor-pointer"
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
              className="bg-[var(--color-base-250)] border border-[var(--color-base-300)] hover:border-[var(--color-base-350)] outline-0 h-[30px] w-full rounded-[5px] px-2 py-1 mb-[15px] font-[Mona_Sans] text-[13px] text-[var(--color-base-950)] transition"
              placeholder="Link (optional)"
            />
            <Select
              placeholder="Tags"
              className="mb-[15px]"
              onChange={setSelectedTags}
            />
            <button
              className="bg-[var(--color-accent-600)] hover:bg-[var(--color-accent-500)] outline-0 shadow-[var(--input-shadow)] hover:shadow-[var(--input-shadow-hover)] focus-visible:shadow-[0 0 0 3px var(--background-modifier-border-focus)] h-[30px] w-full rounded-[5px] px-2 py-1 mb-[15px] font-[Mona_Sans] text-[13px] text-white transition cursor-pointer"
            >
              Create
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}
