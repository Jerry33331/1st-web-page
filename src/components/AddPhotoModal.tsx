import React, { useState } from 'react';
import { X, Upload, Image as ImageIcon, MapPin, Tag } from 'lucide-react';
import { Photo } from '../types';

interface AddPhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPhoto: (photo: Photo) => void;
}

export const AddPhotoModal: React.FC<AddPhotoModalProps> = ({
  isOpen,
  onClose,
  onAddPhoto,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Photo['category']>('mountains');
  const [imageUrl, setImageUrl] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [previewError, setPreviewError] = useState(false);

  if (!isOpen) return null;

  const categoryLabels: Record<Photo['category'], string> = {
    mountains: 'Mountains & Peaks',
    forests: 'Forests & Woods',
    waters: 'Waters & Lakes',
    wildlife: 'Wildlife & Animals',
    sky: 'Sky & Sunsets',
    flora: 'Wildflowers & Flora',
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
        setPreviewError(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !imageUrl.trim() || !location.trim()) return;

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim().toLowerCase().replace(/^#/, ''))
      .filter(Boolean);

    const newPhoto: Photo = {
      id: `custom-photo-${Date.now()}`,
      title: title.trim(),
      category,
      categoryLabel: categoryLabels[category],
      imageUrl: imageUrl.trim(),
      fullImageUrl: imageUrl.trim(),
      location: location.trim(),
      dateTaken: 'Recent Addition',
      description: description.trim() || `Stunning capture of ${title} in nature.`,
      aspectRatio: 'landscape',
      cameraDetails: {
        camera: 'Custom Nature Capture',
        lens: 'Selected Prime Optics',
        settings: 'Natural Daylight',
      },
      tags: tags.length > 0 ? tags : ['nature', category],
    };

    onAddPhoto(newPhoto);
    onClose();
    // Reset fields
    setTitle('');
    setImageUrl('');
    setLocation('');
    setDescription('');
    setTagsInput('');
  };

  return (
    <div
      id="add-photo-modal"
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm animate-in fade-in"
    >
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-xs z-10">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
              <Upload className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-serif font-bold text-stone-900">
              Add Nature Photograph
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
              Photo Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Silent Morning over Pine Ridge"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white text-stone-900 placeholder:text-stone-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Photo['category'])}
                className="w-full px-3.5 py-2 text-sm bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white text-stone-900"
              >
                <option value="mountains">Mountains & Peaks</option>
                <option value="forests">Forests & Woods</option>
                <option value="waters">Waters & Lakes</option>
                <option value="wildlife">Wildlife & Animals</option>
                <option value="sky">Sky & Sunsets</option>
                <option value="flora">Wildflowers & Flora</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                Location *
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Jasper, Alberta"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2 text-sm bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white text-stone-900 placeholder:text-stone-400"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
              Image URL or Upload *
            </label>
            <div className="space-y-2">
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={imageUrl}
                onChange={(e) => {
                  setImageUrl(e.target.value);
                  setPreviewError(false);
                }}
                className="w-full px-3.5 py-2 text-sm bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white text-stone-900 placeholder:text-stone-400"
              />
              
              <div className="flex items-center gap-2">
                <label className="flex-1 cursor-pointer flex items-center justify-center gap-2 px-3 py-2 border border-dashed border-stone-300 hover:border-emerald-500 rounded-lg text-xs font-medium text-stone-600 hover:text-emerald-700 bg-stone-50/50 hover:bg-emerald-50/30 transition-all">
                  <ImageIcon className="w-4 h-4" />
                  <span>Choose local image file</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Preview */}
            {imageUrl && !previewError && (
              <div className="mt-3 relative h-36 rounded-lg overflow-hidden border border-stone-200 bg-stone-100">
                <img
                  src={imageUrl}
                  alt="Preview"
                  onError={() => setPreviewError(true)}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            {previewError && (
              <p className="mt-1 text-xs text-rose-600">
                Could not preview this image URL. Please check the link.
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
              Description
            </label>
            <textarea
              rows={2}
              placeholder="Describe the natural lighting, atmosphere, or scenery..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white text-stone-900 placeholder:text-stone-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
              Tags (comma separated)
            </label>
            <div className="relative">
              <Tag className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="e.g. wilderness, river, twilight"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 text-sm bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white text-stone-900 placeholder:text-stone-400"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim() || !imageUrl.trim() || !location.trim()}
              className="px-5 py-2 rounded-lg bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white text-sm font-semibold shadow-xs transition-colors"
            >
              Add to Gallery
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
