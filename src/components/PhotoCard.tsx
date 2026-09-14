import React, { useState } from 'react';
import { Heart, MapPin, Maximize2, Tag } from 'lucide-react';
import { Photo, ViewMode } from '../types';

interface PhotoCardProps {
  photo: Photo;
  isFavorite: boolean;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onSelect: (photo: Photo) => void;
  viewMode: ViewMode;
}

export const PhotoCard: React.FC<PhotoCardProps> = ({
  photo,
  isFavorite,
  onToggleFavorite,
  onSelect,
  viewMode,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  // Aspect ratio styling depending on view mode
  const getAspectClass = () => {
    if (viewMode === 'grid') {
      return 'aspect-4/3';
    }
    if (viewMode === 'editorial') {
      return 'aspect-16/10 sm:aspect-21/9';
    }
    // Masonry: preserve natural aspect variation
    switch (photo.aspectRatio) {
      case 'portrait':
        return 'aspect-3/4';
      case 'square':
        return 'aspect-square';
      case 'wide':
        return 'aspect-16/9';
      case 'landscape':
      default:
        return 'aspect-4/3';
    }
  };

  return (
    <article
      id={`photo-card-${photo.id}`}
      onClick={() => onSelect(photo)}
      className="group relative bg-white rounded-xl overflow-hidden shadow-xs hover:shadow-xl border border-stone-200/80 transition-all duration-300 flex flex-col cursor-pointer transform hover:-translate-y-1"
    >
      {/* Image container */}
      <div className={`relative w-full overflow-hidden bg-stone-100 ${getAspectClass()}`}>
        {/* Placeholder skeleton while image loads */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-r from-stone-200 via-stone-100 to-stone-200 animate-pulse" />
        )}

        <img
          src={photo.imageUrl}
          alt={photo.title}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Hover overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Top Badges & Actions */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10">
          <span className="px-2.5 py-1 text-xs font-semibold uppercase tracking-wider bg-black/50 backdrop-blur-md text-white rounded-md border border-white/20">
            {photo.categoryLabel}
          </span>

          <div className="flex items-center gap-1.5">
            <button
              id={`fav-btn-${photo.id}`}
              type="button"
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              onClick={(e) => onToggleFavorite(photo.id, e)}
              className={`p-2 rounded-full backdrop-blur-md transition-transform active:scale-90 ${
                isFavorite
                  ? 'bg-rose-500 text-white shadow-md'
                  : 'bg-black/40 text-white hover:bg-black/70'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
            
            <button
              type="button"
              aria-label="Expand image"
              onClick={() => onSelect(photo)}
              className="p-2 rounded-full bg-black/40 text-white backdrop-blur-md hover:bg-black/70 transition-colors opacity-0 group-hover:opacity-100"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bottom hover info on image */}
        <div className="absolute bottom-3 inset-x-3 text-white transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <p className="text-xs text-stone-300 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate">{photo.location}</span>
          </p>
        </div>
      </div>

      {/* Card Content Footer */}
      <div className="p-4 flex-1 flex flex-col justify-between bg-white">
        <div>
          <div className="flex items-center justify-between gap-2 text-xs text-stone-400 mb-1">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
              <span className="text-stone-600 font-medium truncate">{photo.location}</span>
            </span>
            {photo.dateTaken && (
              <span className="text-stone-400 whitespace-nowrap">{photo.dateTaken}</span>
            )}
          </div>

          <h3 className="text-base sm:text-lg font-serif font-bold text-stone-900 group-hover:text-emerald-800 transition-colors line-clamp-1">
            {photo.title}
          </h3>

          <p className="mt-1 text-xs sm:text-sm text-stone-600 line-clamp-2 leading-relaxed">
            {photo.description}
          </p>
        </div>

        {/* Tags & Camera Info */}
        <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Tag className="w-3 h-3 text-stone-400" />
            <span className="text-stone-500">#{photo.tags[0]}</span>
            {photo.tags[1] && <span className="text-stone-400">#{photo.tags[1]}</span>}
          </div>

          {photo.cameraDetails && (
            <span className="text-stone-400 font-mono text-[11px] truncate max-w-[120px]" title={photo.cameraDetails.camera}>
              {photo.cameraDetails.camera.split(' ')[0]}
            </span>
          )}
        </div>
      </div>
    </article>
  );
};
