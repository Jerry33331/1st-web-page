import { useEffect, useMemo, useState, type MouseEvent } from 'react';
import { ArrowUp, Columns, Compass, Grid3X3, Heart, LayoutList, Play, Plus, Search, SlidersHorizontal, X } from 'lucide-react';
import { AddPhotoModal } from './components/AddPhotoModal';
import { Header } from './components/Header';
import { Lightbox } from './components/Lightbox';
import { PhotoCard } from './components/PhotoCard';
import { SlideshowModal } from './components/SlideshowModal';
import { INITIAL_PHOTOS } from './data/photos';
import { FilterCategory, Photo, ViewMode } from './types';

function readStored<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) as T : fallback;
  } catch {
    return fallback;
  }
}

export default function App() {
  const [photos, setPhotos] = useState<Photo[]>(() => {
    const custom = readStored<Photo[]>('mohammed_gallery_custom_photos', []);
    const descriptionOverrides = readStored<Record<string, string>>('mohammed_gallery_description_overrides', {});
    return [...custom, ...INITIAL_PHOTOS].map((photo) => ({
      ...photo,
      description: descriptionOverrides[photo.id] ?? photo.description,
    }));
  });
  const [favorites, setFavorites] = useState<string[]>(() => readStored('mohammed_gallery_favorites', ['photo-1', 'photo-5']));
  const [selectedCategory, setSelectedCategory] = useState<FilterCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('masonry');
  const [activePhoto, setActivePhoto] = useState<Photo | null>(null);
  const [isSlideshowOpen, setIsSlideshowOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('mohammed_gallery_favorites', JSON.stringify(favorites));
    } catch {
      // Browsers can disable local storage; the session still works.
    }
  }, [favorites]);

  const toggleFavorite = (id: string, event?: MouseEvent) => {
    event?.stopPropagation();
    setFavorites((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  };

  const handleAddPhoto = (newPhoto: Photo) => {
    const updated = [newPhoto, ...photos];
    setPhotos(updated);
    try {
      localStorage.setItem('mohammed_gallery_custom_photos', JSON.stringify(updated.filter((item) => item.id.startsWith('custom-photo-'))));
    } catch {
      // Browsers can disable local storage; the new photo remains visible for this session.
    }
  };

  const updatePhotoDescription = (id: string, description: string) => {
    setPhotos((current) => current.map((photo) => photo.id === id ? { ...photo, description } : photo));
    setActivePhoto((current) => current?.id === id ? { ...current, description } : current);
    try {
      const overrides = readStored<Record<string, string>>('mohammed_gallery_description_overrides', {});
      localStorage.setItem('mohammed_gallery_description_overrides', JSON.stringify({ ...overrides, [id]: description }));
    } catch {
      // The edited description remains visible for this session if local storage is unavailable.
    }
  };

  const filteredPhotos = useMemo(() => photos.filter((photo) => {
    if (selectedCategory === 'favorites' && !favorites.includes(photo.id)) return false;
    if (selectedCategory !== 'all' && selectedCategory !== 'favorites' && photo.category !== selectedCategory) return false;
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase().trim();
    return [photo.title, photo.location, photo.categoryLabel, photo.description, ...photo.tags].some((value) => value.toLowerCase().includes(query));
  }), [photos, selectedCategory, searchQuery, favorites]);

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

  const resetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
  };

  return (
    <div className="flex min-h-[100dvh] flex-col bg-stone-50 text-stone-900 selection:bg-emerald-800 selection:text-white">
      <Header photoCount={photos.length} />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <section aria-label="Gallery Controls" className="mb-8 space-y-4">
          <div className="flex flex-col items-stretch justify-between gap-4 md:flex-row md:items-center">
            <div className="relative max-w-md flex-1">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
              <input id="gallery-search" data-testid="input-gallery-search" type="search" placeholder="Search nature captures (e.g. Alps, waterfall, fog, deer)..." value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} className="w-full rounded-xl border border-stone-200 bg-white py-2.5 pl-10 pr-9 text-sm text-stone-900 shadow-2xs transition-all placeholder:text-stone-400 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-700/50" />
              {searchQuery && <button data-testid="button-clear-search" type="button" aria-label="Clear search" onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-stone-400 hover:text-stone-700"><X className="h-4 w-4" /></button>}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button id="start-slideshow-btn" data-testid="button-start-slideshow" type="button" onClick={() => setIsSlideshowOpen(true)} className="inline-flex items-center gap-1.5 rounded-xl bg-stone-900 px-3.5 py-2 text-xs font-semibold text-stone-100 shadow-2xs transition-colors hover:bg-stone-800 sm:text-sm"><Play className="h-3.5 w-3.5 fill-current text-emerald-400" /><span>Slideshow</span></button>
              <button id="add-photo-btn" data-testid="button-open-add-photo" type="button" onClick={() => setIsAddModalOpen(true)} className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-800 px-3.5 py-2 text-xs font-semibold text-white shadow-2xs transition-colors hover:bg-emerald-900 sm:text-sm"><Plus className="h-3.5 w-3.5" /><span>Add Photo</span></button>
              <div className="ml-auto flex items-center rounded-xl border border-stone-200 bg-white p-1 shadow-2xs sm:ml-0">
                <button data-testid="button-view-masonry" type="button" aria-label="Masonry layout" title="Masonry Layout" onClick={() => setViewMode('masonry')} className={`rounded-lg p-1.5 transition-colors ${viewMode === 'masonry' ? 'bg-emerald-100/70 text-emerald-800' : 'text-stone-500 hover:text-stone-900'}`}><Columns className="h-4 w-4" /></button>
                <button data-testid="button-view-grid" type="button" aria-label="Grid layout" title="Square Grid Layout" onClick={() => setViewMode('grid')} className={`rounded-lg p-1.5 transition-colors ${viewMode === 'grid' ? 'bg-emerald-100/70 text-emerald-800' : 'text-stone-500 hover:text-stone-900'}`}><Grid3X3 className="h-4 w-4" /></button>
                <button data-testid="button-view-editorial" type="button" aria-label="Editorial layout" title="Editorial Spread" onClick={() => setViewMode('editorial')} className={`rounded-lg p-1.5 transition-colors ${viewMode === 'editorial' ? 'bg-emerald-100/70 text-emerald-800' : 'text-stone-500 hover:text-stone-900'}`}><LayoutList className="h-4 w-4" /></button>
              </div>
            </div>
          </div>
          <div className="scrollbar-none flex items-center gap-2 overflow-x-auto pb-2">
            <span className="mr-1 flex shrink-0 items-center gap-1 text-xs font-semibold uppercase tracking-wider text-stone-400"><SlidersHorizontal className="h-3 w-3" /><span>Filter:</span></span>
            {categories.map((category) => {
              const isSelected = selectedCategory === category.key;
              return <button key={category.key} id={`filter-btn-${category.key}`} data-testid={`button-filter-${category.key}`} type="button" onClick={() => setSelectedCategory(category.key)} className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${isSelected ? 'bg-emerald-800 text-white shadow-xs' : 'border border-stone-200/90 bg-white text-stone-600 hover:bg-stone-100'}`}>
                {category.key === 'favorites' && <Heart className={`h-3 w-3 ${isSelected ? 'fill-current text-white' : 'text-rose-500'}`} />}
                <span>{category.label}</span>
                {typeof category.count === 'number' && <span className={`rounded-full px-1.5 py-0.2 text-[10px] ${isSelected ? 'bg-emerald-950/40 text-emerald-100' : 'bg-stone-200 text-stone-700'}`}>{category.count}</span>}
              </button>;
            })}
          </div>
        </section>
        <div className="mb-6 flex items-center justify-between text-xs text-stone-500">
          <p data-testid="status-gallery-results">Showing <strong className="text-stone-800">{filteredPhotos.length}</strong> of <span className="text-stone-800">{photos.length}</span> photographs{selectedCategory !== 'all' && <span> in <em className="font-semibold not-italic capitalize text-emerald-700">{selectedCategory}</em></span>}{searchQuery && <span> matching &ldquo;<span className="font-medium text-stone-700">{searchQuery}</span>&rdquo;</span>}</p>
          {(selectedCategory !== 'all' || searchQuery) && <button data-testid="button-reset-filters" type="button" onClick={resetFilters} className="font-medium text-emerald-700 underline hover:text-emerald-900">Reset Filters</button>}
        </div>
        {filteredPhotos.length > 0 ? <div id="nature-photos-grid" data-testid="gallery-grid" className={viewMode === 'editorial' ? 'space-y-8' : viewMode === 'grid' ? 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'columns-1 gap-6 space-y-6 sm:columns-2 lg:columns-3 xl:columns-4'}>
          {filteredPhotos.map((photo) => <div key={photo.id} className={viewMode === 'masonry' ? 'break-inside-avoid' : ''}><PhotoCard photo={photo} isFavorite={favorites.includes(photo.id)} onToggleFavorite={toggleFavorite} onSelect={setActivePhoto} viewMode={viewMode} /></div>)}
        </div> : <div data-testid="status-empty-gallery" className="rounded-2xl border border-stone-200/80 bg-white p-8 py-20 text-center shadow-2xs">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-stone-100 text-stone-400"><Compass className="h-7 w-7 text-emerald-700" /></div>
          <h3 className="font-serif text-lg font-bold text-stone-800">No nature photos found</h3>
          <p className="mx-auto mt-1 max-w-md text-sm text-stone-500">We couldn&apos;t find any photos matching your current search or category filter. Try refining your keywords or resetting filters.</p>
          <button data-testid="button-show-all-photos" type="button" onClick={resetFilters} className="mt-5 rounded-lg bg-emerald-800 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-emerald-900 sm:text-sm">Show All Nature Photos</button>
        </div>}
      </main>
      {showScrollTop && <button data-testid="button-scroll-top" type="button" aria-label="Scroll back to top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="fixed bottom-6 right-6 z-30 rounded-full bg-emerald-800 p-3 text-white shadow-lg transition-transform hover:bg-emerald-900 active:scale-95"><ArrowUp className="h-5 w-5" /></button>}
      {activePhoto && <Lightbox photo={activePhoto} photos={filteredPhotos.length > 0 ? filteredPhotos : photos} isFavorite={favorites.includes(activePhoto.id)} onToggleFavorite={(id) => toggleFavorite(id)} onUpdateDescription={updatePhotoDescription} onClose={() => setActivePhoto(null)} onSelectPhoto={setActivePhoto} />}
      {isSlideshowOpen && <SlideshowModal photos={filteredPhotos.length > 0 ? filteredPhotos : photos} onClose={() => setIsSlideshowOpen(false)} />}
      <AddPhotoModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onAddPhoto={handleAddPhoto} />
      <footer id="gallery-footer" data-testid="gallery-footer" className="mt-20 border-t border-stone-200 bg-white py-12">
        <div className="mx-auto max-w-7xl space-y-3 px-4 text-center sm:px-6 lg:px-8">
          <p className="font-serif text-lg font-bold text-stone-900">Mohammed Albayati</p>
          <p className="text-sm font-medium text-stone-500">Born August 23, 2011 • Nature &amp; Wilderness Photo Gallery</p>
          <p className="mx-auto max-w-md pt-2 text-xs italic text-stone-400">&ldquo;In every walk with nature, one receives far more than he seeks.&rdquo;</p>
          <p className="pt-4 text-[11px] text-stone-400">Curated high-resolution natural landscape exhibition. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}