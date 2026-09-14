import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Grid3X3,
  Columns,
  LayoutList,
  Play,
  Plus,
  Heart,
  SlidersHorizontal,
  X,
  Compass,
  ArrowUp
} from 'lucide-react';
import { INITIAL_PHOTOS } from './data/photos';
import { Photo, ViewMode, FilterCategory } from './types';
import { Header } from './components/Header';
import { PhotoCard } from './components/PhotoCard';
import { Lightbox } from './components/Lightbox';
import { SlideshowModal } from './components/SlideshowModal';
import { AddPhotoModal } from './components/AddPhotoModal';

export const App: React.FC = () => {
  // Photos state initialized with default nature photos and any saved custom photos
  const [photos, setPhotos] = useState<Photo[]>(() => {
    try {
      const saved = localStorage.getItem('mohammed_gallery_custom_photos');
      if (saved) {
        const parsed = JSON.parse(saved);
        return [...parsed, ...INITIAL_PHOTOS];
      }
    } catch {
      // Ignore storage errors
    }
    return INITIAL_PHOTOS;
  });

  // Favorites state
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('mohammed_gallery_favorites');
      return saved ? JSON.parse(saved) : ['photo-1', 'photo-5'];
    } catch {
      return ['photo-1', 'photo-5'];
    }
  });

  // Active filters and settings
  const [selectedCategory, setSelectedCategory] = useState<FilterCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('masonry');
  
  // Modals state
  const [activePhoto, setActivePhoto] = useState<Photo | null>(null);
  const [isSlideshowOpen, setIsSlideshowOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Scroll to top button visibility
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('mohammed_gallery_favorites', JSON.stringify(favorites));
    } catch {
      // Storage unavailable
    }
  }, [favorites]);

  const toggleFavorite = (id: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleAddPhoto = (newPhoto: Photo) => {
    const updated = [newPhoto, ...photos];
    setPhotos(updated);
    try {
      const customOnly = updated.filter((p) => p.id.startsWith('custom-photo-'));
      localStorage.setItem('mohammed_gallery_custom_photos', JSON.stringify(customOnly));
    } catch {
      // Ignore
    }
  };

  // Filtered photos based on category & search term
  const filteredPhotos = useMemo(() => {
    return photos.filter((photo) => {
      // Category filter
      if (selectedCategory === 'favorites') {
        if (!favorites.includes(photo.id)) return false;
      } else if (selectedCategory !== 'all') {
        if (photo.category !== selectedCategory) return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchTitle = photo.title.toLowerCase().includes(query);
        const matchLocation = photo.location.toLowerCase().includes(query);
        const matchCategory = photo.categoryLabel.toLowerCase().includes(query);
        const matchDesc = photo.description.toLowerCase().includes(query);
        const matchTags = photo.tags.some((t) => t.toLowerCase().includes(query));
        return matchTitle || matchLocation || matchCategory || matchDesc || matchTags;
      }

      return true;
    });
  }, [photos, selectedCategory, searchQuery, favorites]);

  const categories: { key: FilterCategory; label: string; count?: number }[] = [
    { key: 'all', label: 'All Nature' },
    { key: 'mountains', label: 'Mountains' },
    { key: 'forests', label: 'Forests' },
    { key: 'waters', label: 'Water & Lakes' },
    { key: 'wildlife', label: 'Wildlife' },
    { key: 'sky', label: 'Sky & Sunsets' },
    { key: 'flora', label: 'Flora' },
    { key: 'favorites', label: 'Favorites', count: favorites.length },
  ];

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col selection:bg-emerald-800 selection:text-white">
      
      {/* Top Section: First Name (Mohammed), Last Name (Albayati), and Birthday (August 23, 2011) */}
      <Header photoCount={photos.length} />

      {/* Nature Pictures Gallery Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Gallery Control Bar */}
        <section aria-label="Gallery Controls" className="mb-8 space-y-4">
          
          {/* Top row: Search, View modes, Slideshow, Add Photo */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="gallery-search"
                type="text"
                placeholder="Search nature captures (e.g. Alps, waterfall, fog, deer)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-9 py-2.5 text-sm bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700/50 focus:border-emerald-700 text-stone-900 placeholder:text-stone-400 shadow-2xs transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-0.5"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Quick Actions & View Toggles */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Slideshow button */}
              <button
                id="start-slideshow-btn"
                type="button"
                onClick={() => setIsSlideshowOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-stone-900 text-stone-100 hover:bg-stone-800 transition-colors shadow-2xs cursor-pointer active:scale-98"
              >
                <Play className="w-3.5 h-3.5 fill-current text-emerald-400" />
                <span>Slideshow</span>
              </button>

              {/* Add Custom Photo button */}
              <button
                id="add-photo-btn"
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-800 text-white hover:bg-emerald-900 transition-colors shadow-2xs cursor-pointer active:scale-98"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Photo</span>
              </button>

              {/* View Layout Mode selector */}
              <div className="flex items-center bg-white border border-stone-200 rounded-xl p-1 shadow-2xs ml-auto sm:ml-0">
                <button
                  type="button"
                  aria-label="Masonry layout"
                  title="Masonry Layout"
                  onClick={() => setViewMode('masonry')}
                  className={`p-1.5 rounded-lg transition-colors ${
                    viewMode === 'masonry'
                      ? 'bg-emerald-100/70 text-emerald-800 font-semibold'
                      : 'text-stone-500 hover:text-stone-900'
                  }`}
                >
                  <Columns className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  aria-label="Grid layout"
                  title="Square Grid Layout"
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-emerald-100/70 text-emerald-800 font-semibold'
                      : 'text-stone-500 hover:text-stone-900'
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  aria-label="Editorial layout"
                  title="Editorial Spread"
                  onClick={() => setViewMode('editorial')}
                  className={`p-1.5 rounded-lg transition-colors ${
                    viewMode === 'editorial'
                      ? 'bg-emerald-100/70 text-emerald-800 font-semibold'
                      : 'text-stone-500 hover:text-stone-900'
                  }`}
                >
                  <LayoutList className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>

          {/* Category Pill Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider flex items-center gap-1 shrink-0 mr-1">
              <SlidersHorizontal className="w-3 h-3" />
              <span>Filter:</span>
            </span>

            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  type="button"
                  id={`filter-btn-${cat.key}`}
                  onClick={() => setSelectedCategory(cat.key)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200/90'
                  }`}
                >
                  {cat.key === 'favorites' && (
                    <Heart className={`w-3 h-3 ${isSelected ? 'fill-current text-white' : 'text-rose-500'}`} />
                  )}
                  <span>{cat.label}</span>
                  {typeof cat.count === 'number' && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        isSelected ? 'bg-emerald-950/40 text-emerald-100' : 'bg-stone-200 text-stone-700'
                      }`}
                    >
                      {cat.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

        </section>

        {/* Status bar showing results count */}
        <div className="flex items-center justify-between text-xs text-stone-500 mb-6">
          <p>
            Showing <strong className="text-stone-800">{filteredPhotos.length}</strong> of{' '}
            <span className="text-stone-800">{photos.length}</span> photographs
            {selectedCategory !== 'all' && (
              <span> in <em className="text-emerald-700 font-semibold not-italic capitalize">{selectedCategory}</em></span>
            )}
            {searchQuery && (
              <span> matching &ldquo;<span className="text-stone-700 font-medium">{searchQuery}</span>&rdquo;</span>
            )}
          </p>

          {(selectedCategory !== 'all' || searchQuery) && (
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="text-emerald-700 hover:text-emerald-900 font-medium underline cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Gallery Grid */}
        {filteredPhotos.length > 0 ? (
          <div
            id="nature-photos-grid"
            className={
              viewMode === 'editorial'
                ? 'space-y-8'
                : viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                : 'columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6'
            }
          >
            {filteredPhotos.map((photo) => (
              <div key={photo.id} className={viewMode === 'masonry' ? 'break-inside-avoid' : ''}>
                <PhotoCard
                  photo={photo}
                  isFavorite={favorites.includes(photo.id)}
                  onToggleFavorite={toggleFavorite}
                  onSelect={setActivePhoto}
                  viewMode={viewMode}
                />
              </div>
            ))}
          </div>
        ) : (
          /* Empty Search / Filter State */
          <div className="text-center py-20 bg-white rounded-2xl border border-stone-200/80 p-8 shadow-2xs">
            <div className="w-14 h-14 mx-auto rounded-full bg-stone-100 flex items-center justify-center text-stone-400 mb-4">
              <Compass className="w-7 h-7 text-emerald-700" />
            </div>
            <h3 className="text-lg font-serif font-bold text-stone-800">
              No nature photos found
            </h3>
            <p className="mt-1 text-sm text-stone-500 max-w-md mx-auto">
              We couldn&apos;t find any photos matching your current search or category filter. Try refining your keywords or resetting filters.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="mt-5 px-4 py-2 rounded-lg bg-emerald-800 text-white text-xs sm:text-sm font-semibold hover:bg-emerald-900 transition-colors cursor-pointer"
            >
              Show All Nature Photos
            </button>
          </div>
        )}

      </main>

      {/* Scroll to top button */}
      {showScrollTop && (
        <button
          type="button"
          aria-label="Scroll back to top"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 p-3 rounded-full bg-emerald-800 hover:bg-emerald-900 text-white shadow-lg z-30 transition-transform active:scale-95"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

      {/* Lightbox Modal */}
      {activePhoto && (
        <Lightbox
          photo={activePhoto}
          photos={filteredPhotos.length > 0 ? filteredPhotos : photos}
          isFavorite={favorites.includes(activePhoto.id)}
          onToggleFavorite={toggleFavorite}
          onClose={() => setActivePhoto(null)}
          onSelectPhoto={setActivePhoto}
        />
      )}

      {/* Slideshow Modal */}
      {isSlideshowOpen && (
        <SlideshowModal
          photos={filteredPhotos.length > 0 ? filteredPhotos : photos}
          onClose={() => setIsSlideshowOpen(false)}
        />
      )}

      {/* Add Custom Nature Photo Modal */}
      <AddPhotoModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddPhoto={handleAddPhoto}
      />

      {/* Footer */}
      <footer id="gallery-footer" className="mt-20 border-t border-stone-200 bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <p className="font-serif text-lg font-bold text-stone-900">
            Mohammed Albayati
          </p>
          <p className="text-sm text-stone-500 font-medium">
            Born August 23, 2011 • Nature & Wilderness Photo Gallery
          </p>
          <p className="text-xs text-stone-400 max-w-md mx-auto italic pt-2">
            &ldquo;In every walk with nature, one receives far more than he seeks.&rdquo;
          </p>
          <p className="text-[11px] text-stone-400 pt-4">
            Curated high-resolution natural landscape exhibition. All rights reserved.
          </p>
        </div>
      </footer>

    </div>
  );
};

export default App;
