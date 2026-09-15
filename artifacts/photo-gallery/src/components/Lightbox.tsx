import { useEffect, useState } from 'react';
import { Camera, Calendar, Check, ChevronLeft, ChevronRight, Download, Heart, Info, MapPin, Share2, X, ZoomIn, ZoomOut } from 'lucide-react';
import { Photo } from '../types';

interface LightboxProps {
  photo: Photo | null;
  photos: Photo[];
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onClose: () => void;
  onSelectPhoto: (photo: Photo) => void;
}

export function Lightbox({ photo, photos, isFavorite, onToggleFavorite, onClose, onSelectPhoto }: LightboxProps) {
  const [copied, setCopied] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const [showInfo, setShowInfo] = useState(true);
  const currentIndex = photo ? photos.findIndex((item) => item.id === photo.id) : -1;
  const prevPhoto = photo && photos.length > 0 ? (currentIndex > 0 ? photos[currentIndex - 1] : photos[photos.length - 1]) : null;
  const nextPhoto = photo && photos.length > 0 ? (currentIndex < photos.length - 1 ? photos[currentIndex + 1] : photos[0]) : null;

  useEffect(() => {
    if (!photo) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowLeft' && prevPhoto) onSelectPhoto(prevPhoto);
      if (event.key === 'ArrowRight' && nextPhoto) onSelectPhoto(nextPhoto);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [photo, prevPhoto, nextPhoto, onClose, onSelectPhoto]);

  useEffect(() => {
    setZoomed(false);
  }, [photo?.id]);

  useEffect(() => {
    if (!photo) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = originalOverflow; };
  }, [photo]);

  if (!photo || !prevPhoto || !nextPhoto) return null;

  const handleShare = async () => {
    try {
      await navigator.clipboard?.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const handleDownload = () => {
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
    <div id="photo-lightbox" data-testid="modal-lightbox" role="dialog" aria-modal="true" aria-label={photo.title} className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-stone-950/95 backdrop-blur-md">
      <div className="absolute inset-x-0 top-0 z-20 flex h-16 items-center justify-between bg-gradient-to-b from-stone-950/80 to-transparent px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="rounded border border-emerald-800/60 bg-emerald-950/80 px-2.5 py-1 text-xs font-semibold text-emerald-400">{photo.categoryLabel}</span>
          <span data-testid="text-lightbox-position" className="hidden text-xs text-stone-400 sm:inline">{currentIndex + 1} of {photos.length}</span>
        </div>
        <div className="flex items-center gap-2">
          <button data-testid="button-toggle-zoom" type="button" aria-label="Toggle zoom" onClick={() => setZoomed((value) => !value)} className="rounded-lg bg-stone-900/80 p-2 text-stone-300 transition-colors hover:bg-stone-800 hover:text-white">{zoomed ? <ZoomOut className="h-5 w-5" /> : <ZoomIn className="h-5 w-5" />}</button>
          <button data-testid="button-lightbox-favorite" type="button" aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'} onClick={() => onToggleFavorite(photo.id)} className={`rounded-lg p-2 transition-colors ${isFavorite ? 'bg-rose-600 text-white' : 'bg-stone-900/80 text-stone-300 hover:bg-stone-800 hover:text-white'}`}><Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} /></button>
          <button data-testid="button-share-photo" type="button" aria-label="Share photo" onClick={handleShare} className="rounded-lg bg-stone-900/80 p-2 text-stone-300 transition-colors hover:bg-stone-800 hover:text-white">{copied ? <Check className="h-5 w-5 text-emerald-400" /> : <Share2 className="h-5 w-5" />}</button>
          <button data-testid="button-download-photo" type="button" aria-label="Download photo" onClick={handleDownload} className="hidden rounded-lg bg-stone-900/80 p-2 text-stone-300 transition-colors hover:bg-stone-800 hover:text-white sm:block"><Download className="h-5 w-5" /></button>
          <button data-testid="button-toggle-photo-info" type="button" aria-label="Toggle info panel" onClick={() => setShowInfo((value) => !value)} className={`rounded-lg p-2 transition-colors ${showInfo ? 'bg-emerald-800 text-white' : 'bg-stone-900/80 text-stone-300 hover:bg-stone-800 hover:text-white'}`}><Info className="h-5 w-5" /></button>
          <button id="close-lightbox-btn" data-testid="button-close-lightbox" type="button" aria-label="Close lightbox" onClick={onClose} className="ml-2 rounded-lg bg-stone-900/80 p-2 text-stone-300 transition-colors hover:bg-stone-800 hover:text-white"><X className="h-5 w-5" /></button>
        </div>
      </div>
      <div className="relative flex h-full w-full items-center justify-center p-4 sm:p-12 md:p-16">
        <button data-testid="button-previous-lightbox" type="button" aria-label="Previous photo" onClick={() => onSelectPhoto(prevPhoto)} className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full border border-stone-700/50 bg-stone-900/70 p-3 text-stone-300 backdrop-blur-sm transition-transform hover:bg-stone-800/90 hover:text-white active:scale-95 sm:left-4"><ChevronLeft className="h-6 w-6" /></button>
        <button data-testid="button-next-lightbox" type="button" aria-label="Next photo" onClick={() => onSelectPhoto(nextPhoto)} className="absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full border border-stone-700/50 bg-stone-900/70 p-3 text-stone-300 backdrop-blur-sm transition-transform hover:bg-stone-800/90 hover:text-white active:scale-95 sm:right-4"><ChevronRight className="h-6 w-6" /></button>
        <div data-testid={`stage-lightbox-${photo.id}`} className={`relative flex max-h-full max-w-full items-center justify-center transition-transform duration-300 ${zoomed ? 'scale-125 cursor-zoom-out' : 'cursor-zoom-in'}`} onClick={() => setZoomed((value) => !value)}>
          <img src={photo.fullImageUrl || photo.imageUrl} alt={photo.title} data-testid={`img-lightbox-${photo.id}`} className="max-h-[82vh] max-w-[90vw] select-none rounded-lg border border-stone-800/60 object-contain shadow-2xl" />
        </div>
      </div>
      {showInfo && <div data-testid="panel-lightbox-info" className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-stone-950 via-stone-950/90 to-transparent p-4 sm:p-6">
        <div className="mx-auto flex max-w-4xl flex-col justify-between gap-4 md:flex-row md:items-end">
          <div className="space-y-1.5">
            <div className="flex items-center gap-3 text-xs sm:text-sm">
              <span className="flex items-center gap-1 font-medium text-emerald-400"><MapPin className="h-3.5 w-3.5" />{photo.location}</span>
              {photo.dateTaken && <span className="flex items-center gap-1 text-stone-400"><Calendar className="h-3.5 w-3.5" />{photo.dateTaken}</span>}
            </div>
            <h2 data-testid={`text-lightbox-title-${photo.id}`} className="font-serif text-xl font-bold tracking-wide text-white sm:text-2xl md:text-3xl">{photo.title}</h2>
            <div className="mt-2 max-w-2xl">
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-400">About this photo</p>
              <p data-testid={`text-lightbox-description-${photo.id}`} className="text-sm leading-relaxed text-stone-200 sm:text-base">{photo.description || 'A beautiful moment captured in the natural world.'}</p>
            </div>
          </div>
          {photo.cameraDetails && <div className="hidden min-w-[220px] rounded-lg border border-stone-800 bg-stone-900/90 p-3 text-xs text-stone-300 md:block">
            <div className="mb-1 flex items-center gap-1.5 font-semibold text-stone-400"><Camera className="h-3.5 w-3.5 text-emerald-400" /><span>Camera Specifications</span></div>
            <div className="font-mono font-medium text-stone-200">{photo.cameraDetails.camera}</div>
            <div className="text-[11px] text-stone-400">{photo.cameraDetails.lens}</div>
            <div className="mt-0.5 font-mono text-[11px] text-emerald-400">{photo.cameraDetails.settings}</div>
          </div>}
        </div>
      </div>}
    </div>
  );
}