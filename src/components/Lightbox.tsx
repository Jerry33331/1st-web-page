import React, { useEffect, useState } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Heart,
  Download,
  Share2,
  MapPin,
  Calendar,
  Camera,
  Check,
  ZoomIn,
  ZoomOut,
  Info
} from 'lucide-react';
import { Photo } from '../types';

interface LightboxProps {
  photo: Photo | null;
  photos: Photo[];
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onClose: () => void;
  onSelectPhoto: (photo: Photo) => void;
}

export const Lightbox: React.FC<LightboxProps> = ({
  photo,
  photos,
  isFavorite,
  onToggleFavorite,
  onClose,
  onSelectPhoto,
}) => {
  const [copied, setCopied] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const [showInfo, setShowInfo] = useState(true);

  if (!photo) return null;

  const currentIndex = photos.findIndex((p) => p.id === photo.id);
  const prevPhoto = currentIndex > 0 ? photos[currentIndex - 1] : photos[photos.length - 1];
  const nextPhoto = currentIndex < photos.length - 1 ? photos[currentIndex + 1] : photos[0];

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onSelectPhoto(prevPhoto);
      if (e.key === 'ArrowRight') onSelectPhoto(nextPhoto);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prevPhoto, nextPhoto, onClose, onSelectPhoto]);

  // Reset zoom on photo switch
  useEffect(() => {
    setZoomed(false);
  }, [photo.id]);

  const handleShare = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // Fallback
    }
  };

  const handleDownload = () => {
    // Open full image in new tab for direct save
    const link = document.createElement('a');
    link.href = photo.fullImageUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.download = `${photo.title.toLowerCase().replace(/\s+/g, '-')}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      id="photo-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={photo.title}
      className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/95 backdrop-blur-md overflow-hidden animate-in fade-in duration-200"
    >
      {/* Top Header Bar */}
      <div className="absolute top-0 inset-x-0 h-16 px-4 sm:px-6 flex items-center justify-between z-20 bg-gradient-to-b from-stone-950/80 to-transparent">
        <div className="flex items-center gap-3">
          <span className="text-xs sm:text-sm font-semibold text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded border border-emerald-800/60">
            {photo.categoryLabel}
          </span>
          <span className="text-xs text-stone-400 hidden sm:inline">
            {currentIndex + 1} of {photos.length}
          </span>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Toggle zoom"
            onClick={() => setZoomed(!zoomed)}
            className="p-2 rounded-lg bg-stone-900/80 text-stone-300 hover:text-white hover:bg-stone-800 transition-colors"
          >
            {zoomed ? <ZoomOut className="w-5 h-5" /> : <ZoomIn className="w-5 h-5" />}
          </button>

          <button
            type="button"
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            onClick={() => onToggleFavorite(photo.id)}
            className={`p-2 rounded-lg transition-colors ${
              isFavorite
                ? 'bg-rose-600 text-white'
                : 'bg-stone-900/80 text-stone-300 hover:text-white hover:bg-stone-800'
            }`}
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>

          <button
            type="button"
            aria-label="Share photo"
            onClick={handleShare}
            className="p-2 rounded-lg bg-stone-900/80 text-stone-300 hover:text-white hover:bg-stone-800 transition-colors"
          >
            {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Share2 className="w-5 h-5" />}
          </button>

          <button
            type="button"
            aria-label="Download photo"
            onClick={handleDownload}
            className="p-2 rounded-lg bg-stone-900/80 text-stone-300 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <Download className="w-5 h-5" />
          </button>

          <button
            type="button"
            aria-label="Toggle info panel"
            onClick={() => setShowInfo(!showInfo)}
            className={`p-2 rounded-lg transition-colors ${
              showInfo ? 'bg-emerald-800 text-white' : 'bg-stone-900/80 text-stone-300 hover:text-white hover:bg-stone-800'
            }`}
          >
            <Info className="w-5 h-5" />
          </button>

          <button
            id="close-lightbox-btn"
            type="button"
            aria-label="Close lightbox"
            onClick={onClose}
            className="p-2 rounded-lg bg-stone-900/80 text-stone-300 hover:text-white hover:bg-stone-800 transition-colors ml-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Image Stage */}
      <div className="relative w-full h-full flex items-center justify-center p-4 sm:p-12 md:p-16">
        {/* Previous Button */}
        <button
          type="button"
          aria-label="Previous photo"
          onClick={() => onSelectPhoto(prevPhoto)}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-stone-900/70 text-stone-300 hover:text-white hover:bg-stone-800/90 border border-stone-700/50 backdrop-blur-sm transition-transform active:scale-95"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Next Button */}
        <button
          type="button"
          aria-label="Next photo"
          onClick={() => onSelectPhoto(nextPhoto)}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-stone-900/70 text-stone-300 hover:text-white hover:bg-stone-800/90 border border-stone-700/50 backdrop-blur-sm transition-transform active:scale-95"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Center Display Image */}
        <div
          className={`relative max-w-full max-h-full flex items-center justify-center transition-all duration-300 ${
            zoomed ? 'cursor-zoom-out scale-125' : 'cursor-zoom-in'
          }`}
          onClick={() => setZoomed(!zoomed)}
        >
          <img
            src={photo.fullImageUrl || photo.imageUrl}
            alt={photo.title}
            className="max-h-[82vh] max-w-[90vw] object-contain rounded-lg shadow-2xl border border-stone-800/60 select-none"
          />
        </div>
      </div>

      {/* Bottom Info Bar & Metadata */}
      {showInfo && (
        <div className="absolute bottom-0 inset-x-0 p-4 sm:p-6 bg-gradient-to-t from-stone-950 via-stone-950/90 to-transparent z-20">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-3 text-xs sm:text-sm text-stone-400">
                <span className="flex items-center gap-1 text-emerald-400 font-medium">
                  <MapPin className="w-3.5 h-3.5" />
                  {photo.location}
                </span>
                {photo.dateTaken && (
                  <span className="flex items-center gap-1 text-stone-400">
                    <Calendar className="w-3.5 h-3.5" />
                    {photo.dateTaken}
                  </span>
                )}
              </div>

              <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-white tracking-wide">
                {photo.title}
              </h2>

              <p className="text-xs sm:text-sm text-stone-300 max-w-2xl leading-relaxed">
                {photo.description}
              </p>
            </div>

            {/* Camera / Technical details */}
            {photo.cameraDetails && (
              <div className="bg-stone-900/90 border border-stone-800 rounded-lg p-3 text-xs text-stone-300 min-w-[220px]">
                <div className="flex items-center gap-1.5 text-stone-400 font-semibold mb-1">
                  <Camera className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Camera Specifications</span>
                </div>
                <div className="font-mono text-stone-200 font-medium">{photo.cameraDetails.camera}</div>
                <div className="text-stone-400 text-[11px]">{photo.cameraDetails.lens}</div>
                <div className="text-emerald-400 font-mono text-[11px] mt-0.5">{photo.cameraDetails.settings}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
