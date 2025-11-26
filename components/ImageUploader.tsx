import React, { useCallback, useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploaderProps {
  onImageSelect: (base64: string | null) => void;
  selectedImage: string | null;
  disabled: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect, selectedImage, disabled }) => {
  const [isDragging, setIsDragging] = useState(false);

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (JPG, PNG).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      // Remove data URL prefix for API
      const base64 = result.split(',')[1];
      onImageSelect(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      if (disabled) return;
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        processFile(e.dataTransfer.files[0]);
      }
    },
    [disabled]
  );

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onImageSelect(null);
  };

  return (
    <div className="w-full h-full min-h-[300px] flex flex-col">
       <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative flex-1 rounded-xl border-2 border-dashed transition-all duration-300 overflow-hidden flex flex-col items-center justify-center cursor-pointer group ${
          isDragging
            ? 'border-white bg-neutral-800'
            : selectedImage
            ? 'border-neutral-700 bg-black'
            : 'border-neutral-700 hover:border-neutral-500 bg-neutral-900/50 hover:bg-neutral-900'
        }`}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleChange}
          disabled={disabled || !!selectedImage}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
        />

        {selectedImage ? (
          <div className="relative w-full h-full flex items-center justify-center p-4">
             {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`data:image/jpeg;base64,${selectedImage}`}
              alt="Uploaded preview"
              className="max-w-full max-h-full object-contain rounded-md shadow-lg"
            />
            {!disabled && (
              <button
                onClick={handleClear}
                className="absolute top-4 right-4 z-20 p-2 bg-red-600/80 hover:bg-red-600 text-white rounded-full transition-colors backdrop-blur-sm"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        ) : (
          <div className="text-center p-6 pointer-events-none">
            <div className={`mx-auto w-16 h-16 mb-4 rounded-full flex items-center justify-center transition-colors ${isDragging ? 'bg-white text-black' : 'bg-neutral-800 text-neutral-400 group-hover:bg-neutral-700 group-hover:text-white'}`}>
                {isDragging ? <Upload className="w-8 h-8" /> : <ImageIcon className="w-8 h-8" />}
            </div>
            <p className="text-lg font-medium text-white mb-2">
              {isDragging ? 'Drop image here' : 'Upload a photo'}
            </p>
            <p className="text-sm text-neutral-500 max-w-[240px] mx-auto">
              Click or drag & drop a clear selfie or portrait (JPG, PNG)
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
