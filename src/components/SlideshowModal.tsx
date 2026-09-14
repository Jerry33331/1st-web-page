import React, { useEffect, useState } from 'react';
import { Play, Pause, X, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { Photo } from '../types';

interface SlideshowModalProps {
  photos: Photo[];
  initialIndex?: number;
  onClose: () => void;
}

export const SlideshowModal: React.FC<SlideshowModalProps> = ({
  photos,
  initialIndex = 0,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  const duration = 5000; // 5 seconds per slide
  const step = 50; // update progress every 50ms

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentIndex((idx) => (idx + 1) % photos.length);
          return 0;
        }
        return prev + (step / duration) * 100;
      });
    }, step);

    return () => clearInterval(interval);
  }, [isPlaying, photos.length]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % photos.length);
    setProgress(0);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
    setProgress(0);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === ' ') {
        e.preventDefault();
        setIsPlaying((p) => !p);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const currentPhoto = photos[currentIndex];

  if (!currentPhoto) return null;

  return (
    <div
      id="nature-slideshow-modal"
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-black text-white select-none animate-in fade-in duration-300"
    >
      {/* Top progress bar */}
      <div className="w-full h-1 bg-stone-800 relative overflow-hidden">
        <div
          className="h-full bg-emerald-500 transition-all duration-75 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Top Controls Header */}
      <div className="w-full px-6 py-4 flex items-center justify-between z-20 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center gap-3">
          <span className="text-xs uppercase tracking-widest text-emerald-400 font-semibold px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-800">
            Slideshow Experience
          </span>
          <span className="text-xs text-stone-400">
            {currentIndex + 1} / {photos.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-900/90 hover:bg-stone-800 text-xs font-medium text-stone-200 border border-stone-700 transition-colors"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 text-emerald-400" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-emerald-400 fill-current" />
                <span>Resume</span>
              </>
            )}
          </button>

          <button
            type="button"
            aria-label="Exit slideshow"
            onClick={onClose}
            className="p-2 rounded-full bg-stone-900/90 hover:bg-stone-800 text-stone-300 border border-stone-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Center Image */}
      <div className="relative flex-1 w-full flex items-center justify-center p-4 sm:p-8 overflow-hidden">
        <img
          key={currentPhoto.id}
          src={currentPhoto.fullImageUrl || currentPhoto.imageUrl}
          alt={currentPhoto.title}
          className="max-h-[75vh] max-w-[90vw] object-contain rounded-lg shadow-2xl transition-opacity duration-700 animate-in fade-in"
        />

        {/* Previous / Next buttons */}
        <button
          type="button"
          aria-label="Previous image"
          onClick={handlePrev}
          className="absolute left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-stone-900/60 hover:bg-stone-800 text-white border border-stone-700 transition-all"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          type="button"
          aria-label="Next image"
          onClick={handleNext}
          className="absolute right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-stone-900/60 hover:bg-stone-800 text-white border border-stone-700 transition-all"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Bottom Info Bar */}
      <div className="w-full px-6 py-5 bg-gradient-to-t from-black via-black/80 to-transparent flex flex-col items-center text-center">
        <div className="flex items-center gap-2 text-emerald-400 text-xs sm:text-sm font-medium mb-1">
          <MapPin className="w-3.5 h-3.5" />
          <span>{currentPhoto.location}</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-wide">
          {currentPhoto.title}
        </h2>
        <p className="text-xs sm:text-sm text-stone-400 max-w-xl mt-1 line-clamp-1">
          {currentPhoto.description}
        </p>
      </div>
    </div>
  );
};
