"use client";

import React, { useEffect, useState } from "react";
import {
  RotateCw,
  RotateCcw,
  Trash2,
  Star,
  ChevronLeft,
  ChevronRight,
  X,
  Sparkles,
} from "lucide-react";

export interface PreviewImageItem {
  id: string;
  url: string;
  title?: string;
  isMain?: boolean;
}

export interface ImagePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: PreviewImageItem[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
  onRotate?: (imageId: string, angle: number) => void;
  onSetMain?: (imageId: string) => void;
  onDelete?: (imageId: string) => void;
}

export const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({
  isOpen,
  onClose,
  images,
  currentIndex,
  onIndexChange,
  onRotate,
  onSetMain,
  onDelete,
}) => {
  const [rotations, setRotations] = useState<Record<string, number>>({});

  const currentPhoto = images[currentIndex];

  const handleRotateCurrent = (deltaAngle = 90) => {
    if (!currentPhoto) return;
    const imgId = currentPhoto.id;
    const nextAngle = ((rotations[imgId] || 0) + deltaAngle + 360) % 360;
    setRotations((prev) => ({ ...prev, [imgId]: nextAngle }));
    if (onRotate) {
      onRotate(imgId, deltaAngle);
    }
  };

  // Keyboard Navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        onIndexChange(currentIndex > 0 ? currentIndex - 1 : images.length - 1);
      } else if (e.key === "ArrowRight") {
        onIndexChange(currentIndex < images.length - 1 ? currentIndex + 1 : 0);
      } else if (e.key === "Escape") {
        onClose();
      } else if (e.key.toLowerCase() === "r") {
        handleRotateCurrent(90);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, currentIndex, images.length, currentPhoto]);

  if (!isOpen || !currentPhoto) return null;

  return (
    <div className="fixed inset-0 z-100 bg-black/95 backdrop-blur-md flex flex-col justify-between animate-in fade-in duration-200">
      {/* Top Action Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 text-white select-none">
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold tracking-wide">
            Photo {currentIndex + 1} of {images.length}
          </span>
          {currentPhoto.isMain && (
            <span className="bg-yashomePink text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              Main Photo
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Rotate Counter-Clockwise */}
          <button
            type="button"
            onClick={() => handleRotateCurrent(-90)}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            title="Rotate Counter-Clockwise (90°)"
          >
            <RotateCcw className="h-5 w-5" />
          </button>

          {/* Rotate Clockwise */}
          <button
            type="button"
            onClick={() => handleRotateCurrent(90)}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            title="Rotate Clockwise (90°)"
          >
            <RotateCw className="h-5 w-5" />
          </button>

          {/* Set as Main Photo */}
          {onSetMain && !currentPhoto.isMain && (
            <button
              type="button"
              onClick={() => onSetMain(currentPhoto.id)}
              className="px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/40 transition-colors text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Star className="h-4 w-4 fill-current" />
              <span>Set as Main</span>
            </button>
          )}

          {/* Delete Photo */}
          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(currentPhoto.id)}
              className="p-2 rounded-lg bg-destructive/20 text-destructive hover:bg-destructive/40 transition-colors cursor-pointer"
              title="Delete Photo"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          )}

          {/* Close Modal */}
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors ml-4 cursor-pointer"
            title="Close (Esc)"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Main Image Display Area */}
      <div className="relative flex-1 flex items-center justify-center p-6 overflow-hidden select-none">
        {/* Previous Button */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={() => onIndexChange(currentIndex > 0 ? currentIndex - 1 : images.length - 1)}
            className="absolute left-6 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all backdrop-blur-md cursor-pointer hover:scale-110"
          >
            <ChevronLeft className="h-7 w-7" />
          </button>
        )}

        {/* High-res Image */}
        <div className="max-w-[85vw] max-h-[75vh] flex items-center justify-center">
          <img
            src={currentPhoto.url}
            alt={currentPhoto.title || `Photo ${currentIndex + 1}`}
            style={{
              transform: `rotate(${rotations[currentPhoto.id] || 0}deg)`,
              transition: "transform 0.3s ease",
            }}
            className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl"
          />
        </div>

        {/* Next Button */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={() => onIndexChange(currentIndex < images.length - 1 ? currentIndex + 1 : 0)}
            className="absolute right-6 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all backdrop-blur-md cursor-pointer hover:scale-110"
          >
            <ChevronRight className="h-7 w-7" />
          </button>
        )}
      </div>

      {/* Bottom Thumbnail Navigation Strip */}
      {images.length > 1 && (
        <div className="p-4 border-t border-white/10 bg-black/60 flex justify-center items-center gap-2 overflow-x-auto select-none">
          {images.map((photo, idx) => (
            <button
              key={photo.id || idx}
              type="button"
              onClick={() => onIndexChange(idx)}
              className={`relative h-14 w-14 rounded-md overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                idx === currentIndex
                  ? "border-yashomePink scale-105 shadow-md"
                  : "border-transparent opacity-50 hover:opacity-100"
              }`}
            >
              <img
                src={photo.url}
                alt={`Thumbnail ${idx + 1}`}
                style={{
                  transform: `rotate(${rotations[photo.id] || 0}deg)`,
                }}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
