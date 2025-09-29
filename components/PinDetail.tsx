import React from "react";

interface PinDetailProps {
  open: boolean;
  onClose: () => void;
  src: string;
  alt?: string;
  title?: string;
  description?: string;
}

export default function PinDetail({
  open,
  onClose,
  src,
  alt = "Imagem",
  title,
  description,
}: PinDetailProps) {
  if (!open) return null;

  return (
    <div
      className="animate-slide-in z-50 flex w-[400px] max-w-full flex-col border-r border-gray-200 bg-[var(--background)] shadow-2xl transition-transform duration-300"
      style={{ transform: open ? "translateX(0)" : "translateX(-100%)" }}
      role="dialog"
      aria-modal="true"
    >
      <div className="flex items-center justify-between border-b border-gray-100 p-4">
        <h3 className="truncate text-lg font-bold" title={title || alt}>
          {title || alt}
        </h3>
        <button
          className="ml-2 text-2xl font-bold text-gray-400 hover:text-gray-700 focus:outline-none"
          onClick={onClose}
          aria-label="Fechar painel de detalhes"
        >
          ×
        </button>
      </div>
      <div className="flex flex-1 flex-col items-center overflow-y-auto p-4">
        <img
          src={src}
          alt={alt}
          className="mb-4 h-auto max-h-[60vh] w-full rounded-lg object-contain"
        />
        {description && (
          <p className="w-full text-sm text-gray-600">{description}</p>
        )}
        {/* Espaço para mais detalhes ou botões futuramente */}
      </div>
    </div>
  );
}
