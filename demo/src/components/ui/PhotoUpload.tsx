"use client";

import { Camera, X, Image as ImageIcon } from "lucide-react";

interface PhotoUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  label?: string;
  required?: boolean;
}

export function PhotoUpload({ images, onChange, label, required }: PhotoUploadProps) {
  function handleAdd() {
    const mockUrl = `mock-photo-${Date.now()}.jpg`;
    onChange([...images, mockUrl]);
  }

  function handleRemove(index: number) {
    const next = images.filter((_, i) => i !== index);
    onChange(next);
  }

  const showRedHint = required && images.length === 0;

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <p className="text-xs font-medium text-text-secondary">
          {label}
          {required && <span className="text-danger ml-0.5">*</span>}
        </p>
      )}

      <div
        className={[
          "flex flex-wrap gap-2 p-2 rounded-lg border transition-colors",
          showRedHint
            ? "border-danger/50 bg-danger/5"
            : "border-border-color bg-page-bg",
        ].join(" ")}
      >
        {/* Thumbnails */}
        {images.map((url, idx) => (
          <div
            key={url + idx}
            className="relative w-16 h-16 rounded-lg flex-shrink-0 overflow-hidden group"
          >
            {/* Placeholder colored box since no real images */}
            <div
              className="w-full h-full flex items-center justify-center text-white text-[10px] font-medium"
              style={{
                backgroundColor: `hsl(${(idx * 67 + 200) % 360}, 55%, 60%)`,
              }}
            >
              <ImageIcon size={20} className="opacity-70" />
            </div>
            {/* filename tooltip */}
            <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[8px] px-1 py-0.5 truncate opacity-0 group-hover:opacity-100 transition-opacity">
              {url}
            </div>
            {/* Remove button */}
            <button
              type="button"
              onClick={() => handleRemove(idx)}
              className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-danger flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-danger/80"
              aria-label="Xóa ảnh"
            >
              <X size={10} className="text-white" />
            </button>
          </div>
        ))}

        {/* Add button */}
        <button
          type="button"
          onClick={handleAdd}
          className="w-16 h-16 rounded-lg border-2 border-dashed border-border-color hover:border-primary/50 hover:bg-primary-light flex flex-col items-center justify-center gap-1 transition-colors flex-shrink-0"
        >
          <Camera size={16} className="text-text-secondary" />
          <span className="text-[10px] text-text-secondary leading-tight">Thêm ảnh</span>
        </button>
      </div>

      {showRedHint && (
        <p className="text-xs text-danger">Vui lòng thêm ít nhất một ảnh.</p>
      )}
    </div>
  );
}
