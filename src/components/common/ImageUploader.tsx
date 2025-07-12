"use client";

import React, { useRef, useState, useEffect } from "react";

type ImageUploaderProps = {
  label?: string;
  onChange: (files: File[] | null) => void;
  maxImages?: number;
  initialImages?: string[]; // now supports multiple initial images
};

const ImageUploader: React.FC<ImageUploaderProps> = ({
  label,
  onChange,
  maxImages = 1,
  initialImages = [],
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>(initialImages);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPreviews(initialImages);
  }, [initialImages]);

  const handleFiles = (selectedFiles: FileList | null) => {
    if (!selectedFiles || selectedFiles.length === 0) return;

    let newFiles = Array.from(selectedFiles);
    if (files.length + newFiles.length > maxImages) {
      setError(`You can only upload up to ${maxImages} image${maxImages > 1 ? "s" : ""}`);
      return;
    }

    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));

    const updatedFiles = [...files, ...newFiles];
    const updatedPreviews = [...previews, ...newPreviews];

    setFiles(updatedFiles);
    setPreviews(updatedPreviews);
    onChange(updatedFiles);
    setError(null);
  };

  const removeImage = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    const updatedPreviews = previews.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    setPreviews(updatedPreviews);
    onChange(updatedFiles.length > 0 ? updatedFiles : null);
  };

  return (
    <div>
      {label && <label className="block mb-2 font-medium">{label}</label>}

      <div className="flex gap-2 flex-wrap">
        {previews.map((preview, index) => (
          <div key={index} className="relative w-24 h-24 rounded overflow-hidden border">
            <img src={preview} alt={`preview-${index}`} className="object-cover w-full h-full" />
            <button
              onClick={() => removeImage(index)}
              className="absolute top-0 right-0 bg-black/50 text-white px-1 text-xs"
            >
              ×
            </button>
          </div>
        ))}

        {previews.length < maxImages && (
          <button
            onClick={() => inputRef.current?.click()}
            className="w-24 h-24 border border-dashed rounded flex items-center justify-center text-sm text-gray-600 hover:border-gray-400"
          >
            + Add
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={maxImages > 1}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default ImageUploader;
