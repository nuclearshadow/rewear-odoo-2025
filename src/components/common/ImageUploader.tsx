"use client";

import React, { useRef, useState } from "react";

type ImageUploaderProps = {
  label?: string;
  onChange: (files: File[]) => void;
  maxImages?: number;
};

/**
 * ImageUploader component
 *
 * @param label - Optional label above input
 * @param onChange - Callback that returns selected File[] to parent
 * @param maxImages - Max number of allowed images (default: 5)
 */
const ImageUploader: React.FC<ImageUploaderProps> = ({
  label,
  onChange,
  maxImages = 5,
}) => {
  const [previews, setPreviews] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    const fileArray = Array.from(selectedFiles);
    const totalFiles = [...files, ...fileArray].slice(0, maxImages);
    setFiles(totalFiles);
    onChange(totalFiles);

    // Generate preview URLs
    const previewUrls = totalFiles.map((file) => URL.createObjectURL(file));
    setPreviews(previewUrls);
  };

  const removeImage = (index: number) => {
    const newFiles = [...files];
    const newPreviews = [...previews];
    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);
    setFiles(newFiles);
    setPreviews(newPreviews);
    onChange(newFiles);
  };

  return (
    <div>
      {label && <label className="block mb-2 font-medium">{label}</label>}

      <div className="flex flex-wrap gap-4">
        {previews.map((src, idx) => (
          <div key={idx} className="relative w-24 h-24 rounded overflow-hidden border">
            <img src={src} alt={`preview-${idx}`} className="object-cover w-full h-full" />
            <button
              onClick={() => removeImage(idx)}
              className="absolute top-0 right-0 bg-black/50 text-white px-1 text-xs"
            >
              ×
            </button>
          </div>
        ))}

        {files.length < maxImages && (
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
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
};

export default ImageUploader;
