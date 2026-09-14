export interface Photo {
  id: string;
  title: string;
  category: 'mountains' | 'forests' | 'waters' | 'wildlife' | 'sky' | 'flora';
  categoryLabel: string;
  imageUrl: string;
  fullImageUrl: string;
  location: string;
  dateTaken?: string;
  description: string;
  aspectRatio: 'landscape' | 'portrait' | 'square' | 'wide';
  cameraDetails?: {
    camera: string;
    lens: string;
    settings: string;
  };
  tags: string[];
}

export type ViewMode = 'masonry' | 'grid' | 'editorial';
export type FilterCategory = 'all' | 'mountains' | 'forests' | 'waters' | 'wildlife' | 'sky' | 'flora' | 'favorites';
