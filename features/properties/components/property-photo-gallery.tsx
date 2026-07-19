import React, { useState } from "react";
import {
  RotateCw,
  Trash2,
  Star,
  Upload,
  Building2,
  Sparkles,
} from "lucide-react";
import { PropertyImageItem } from "@/services/properties/properties.service";
import { ImagePreviewModal } from "@/components/shared/image-preview-modal";

interface PropertyPhotoGalleryProps {
  propertyId: string;
  mainPhotoUrl?: string | null;
  images: PropertyImageItem[];
  uploading: boolean;
  onUploadImages: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  onSetMainImage: (imageId: string) => Promise<void>;
  onDeleteImage: (imageId: string) => Promise<void>;
}

export const PropertyPhotoGallery: React.FC<PropertyPhotoGalleryProps> = ({
  propertyId,
  mainPhotoUrl,
  images,
  uploading,
  onUploadImages,
  onSetMainImage,
  onDeleteImage,
}) => {
  const [rotations, setRotations] = useState<Record<string, number>>({});
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const allPhotoList = React.useMemo(() => {
    if (!images || images.length === 0) {
      if (mainPhotoUrl) {
        return [{ id: "main", url: mainPhotoUrl, isMain: true }];
      }
      return [];
    }

    return images.map((img) => ({
      ...img,
      isMain: mainPhotoUrl === img.url,
    }));
  }, [images, mainPhotoUrl]);

  const handleRotate = (imageId: string, deltaAngle = 90) => {
    setRotations((prev) => {
      const current = prev[imageId] || 0;
      const nextAngle = (current + deltaAngle + 360) % 360;
      return { ...prev, [imageId]: nextAngle };
    });
  };

  return (
    <div className="space-y-4">
      {/* Media Card */}
      <div className="bg-card border border-border/80 rounded-xl overflow-hidden shadow-xs">
        {/* Header */}
        <div className="p-4 border-b border-border/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Photos ({allPhotoList.length})
            </span>
          </div>

          <label className="cursor-pointer inline-flex items-center gap-1.5 text-xs font-bold text-yashomePink hover:underline bg-yashomePink/5 px-2.5 py-1 rounded-md border border-yashomePink/20 transition-all">
            <Upload className="h-3.5 w-3.5" />
            <span>{uploading ? "Uploading..." : "Upload Photos"}</span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={onUploadImages}
              disabled={uploading}
              className="hidden"
            />
          </label>
        </div>

        {/* Primary Preview Photo (Clicking opens fullscreen Lightbox) */}
        <div
          onClick={() => mainPhotoUrl && setLightboxIndex(0)}
          className={`relative aspect-4/3 bg-muted flex items-center justify-center overflow-hidden group ${
            mainPhotoUrl ? "cursor-pointer" : ""
          }`}
        >
          {mainPhotoUrl ? (
            <>
              <img
                src={mainPhotoUrl}
                alt={`Property ${propertyId}`}
                style={{
                  transform: `rotate(${rotations["main"] || 0}deg)`,
                  transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-3 left-3 bg-yashomePink text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                Main Photo
              </div>

              {/* Action Toolbar on Hover */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-xs">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRotate("main", 90);
                  }}
                  className="p-2 rounded-lg bg-white/20 hover:bg-white/40 text-white backdrop-blur-md transition-all cursor-pointer"
                  title="Rotate 90° Clockwise"
                >
                  <RotateCw className="h-5 w-5" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center text-muted-foreground/60 p-6 text-center">
              <Building2 className="h-12 w-12 mb-2" />
              <span className="text-xs font-semibold">No Main Photo Uploaded</span>
            </div>
          )}
        </div>

        {/* Gallery Grid */}
        {allPhotoList.length > 0 && (
          <div className="p-4 border-t border-border/60">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-3">
              Photo Gallery
            </span>

            <div className="grid grid-cols-3 gap-2.5">
              {allPhotoList.map((photo, idx) => {
                const rotationDeg = rotations[photo.id] || 0;

                return (
                  <div
                    key={photo.id || idx}
                    onClick={() => setLightboxIndex(idx)}
                    className="relative group rounded-lg overflow-hidden border border-border/80 aspect-square bg-muted shadow-xxs cursor-pointer"
                  >
                    <img
                      src={photo.url}
                      alt={`Photo ${idx + 1}`}
                      style={{
                        transform: `rotate(${rotationDeg}deg)`,
                        transition: "transform 0.3s ease",
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {photo.isMain && (
                      <div className="absolute top-1 left-1 bg-yashomePink text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full uppercase">
                        Main
                      </div>
                    )}

                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-1 backdrop-blur-xs">
                      {/* Rotate Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRotate(photo.id, 90);
                        }}
                        className="p-1.5 rounded bg-white/20 hover:bg-white/40 text-white transition-all cursor-pointer"
                        title="Rotate 90°"
                      >
                        <RotateCw className="h-4 w-4" />
                      </button>

                      {/* Set Main Button */}
                      {!photo.isMain && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSetMainImage(photo.id);
                          }}
                          className="p-1.5 rounded bg-amber-500/80 hover:bg-amber-500 text-white transition-all cursor-pointer"
                          title="Set as Main Photo"
                        >
                          <Star className="h-4 w-4" />
                        </button>
                      )}

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteImage(photo.id);
                        }}
                        className="p-1.5 rounded bg-destructive/80 hover:bg-destructive text-white transition-all cursor-pointer"
                        title="Delete Photo"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Reusable ImagePreviewModal Component */}
      <ImagePreviewModal
        isOpen={lightboxIndex !== null}
        onClose={() => setLightboxIndex(null)}
        images={allPhotoList}
        currentIndex={lightboxIndex || 0}
        onIndexChange={(newIndex) => setLightboxIndex(newIndex)}
        onRotate={handleRotate}
        onSetMain={onSetMainImage}
        onDelete={(imageId) => {
          onDeleteImage(imageId);
          setLightboxIndex(null);
        }}
      />
    </div>
  );
};
