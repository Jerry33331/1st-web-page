import React from 'react';
import { Calendar, Camera, Sparkles } from 'lucide-react';

interface HeaderProps {
  photoCount: number;
}

export const Header: React.FC<HeaderProps> = ({ photoCount }) => {
  return (
    <header id="gallery-header" className="relative pt-12 pb-10 border-b border-stone-200/80 bg-white/70 backdrop-blur-sm">
      {/* Decorative top accent line with organic gradient */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-800 via-teal-700 to-amber-700" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          
          {/* Subtle badge / Category mark */}
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full bg-emerald-50 border border-emerald-200/70 text-emerald-800 text-xs font-semibold tracking-wide uppercase">
            <Camera className="w-3.5 h-3.5 text-emerald-700" />
            <span>Nature & Landscape Photography</span>
          </div>

          {/* First Name & Last Name prominently displayed on top as requested */}
          <h1 
            id="author-name" 
            className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-stone-900 tracking-tight leading-none"
          >
            Mohammed Albayati
          </h1>

          {/* Birthday prominently placed directly under the name */}
          <div 
            id="author-birthday" 
            className="mt-3.5 flex items-center gap-2 text-stone-600 bg-stone-100/90 px-4 py-1.5 rounded-full border border-stone-200/80 shadow-xs"
          >
            <Calendar className="w-4 h-4 text-emerald-700" />
            <span className="text-sm sm:text-base font-medium text-stone-800">
              August 23, 2011
            </span>
          </div>

          {/* Editorial Subtitle & Bio */}
          <p className="mt-4 max-w-2xl text-base sm:text-lg text-stone-600 font-normal leading-relaxed">
            A curated visual expedition through the world&apos;s wildest sanctuaries — capturing ancient alpine peaks, emerald rainforests, crystalline waters, and untamed wildlife.
          </p>

          {/* Quick Stats bar */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-stone-500">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-stone-900">{photoCount}</span>
              <span>Exhibition Captures</span>
            </div>
            <span className="text-stone-300">•</span>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-stone-900">6</span>
              <span>Biomes & Ecosystems</span>
            </div>
            <span className="text-stone-300">•</span>
            <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>High Definition 4K Gallery</span>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};
