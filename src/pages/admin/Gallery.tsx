import React, { useEffect, useState } from 'react';
import { services } from '../../services';
import { GalleryItem } from '../../domain/models';

const Gallery: React.FC = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // @ts-ignore
    services.gallery.getGalleryItems().then((data: GalleryItem[]) => {
      setItems(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gallery</h1>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700">
          Upload Image
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : items.length === 0 ? (
        <p className="text-gray-500">No images in gallery.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow overflow-hidden">
              <img src={item.imageUrl} alt={item.title} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="text-lg font-medium text-gray-900">{item.title}</h3>
                {item.description && <p className="text-sm text-gray-500 mt-1">{item.description}</p>}
                <div className="mt-4 flex justify-end">
                  <button className="text-red-600 hover:text-red-900 text-sm font-medium">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Gallery;
