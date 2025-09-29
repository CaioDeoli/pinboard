import React from "react";

interface PinDetailProps {
  open: boolean;
  onClose: () => void;
  src: string;
  alt?: string;
  title?: string;
  description?: string;
}

export default function PinDetail({ open, onClose, src, alt = "Imagem", title, description }: PinDetailProps) {
  if (!open) return null;

  return (
    <div
      className="w-[400px] max-w-full bg-[var(--background)] shadow-2xl z-50 flex flex-col transition-transform duration-300 border-r border-gray-200 animate-slide-in"
      style={{ transform: open ? "translateX(0)" : "translateX(-100%)" }}
      role="dialog"
      aria-modal="true"
    >
      <div className="flex justify-between items-center p-4 border-b border-gray-100">
        <h3 className="font-bold text-lg truncate" title={title || alt}>{title || alt}</h3>
        <button
          className="ml-2 text-gray-400 hover:text-gray-700 text-2xl font-bold focus:outline-none"
          onClick={onClose}
          aria-label="Fechar painel de detalhes"
        >
          ×
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 flex flex-col items-center">
        <img
          src={src}
          alt={alt}
          className="w-full h-auto max-h-[60vh] object-contain rounded-lg mb-4"
        />
        {description && <p className="text-gray-600 text-sm w-full">{description}</p>}
        {/* Espaço para mais detalhes ou botões futuramente */}
      </div>
    </div>
  );
}
