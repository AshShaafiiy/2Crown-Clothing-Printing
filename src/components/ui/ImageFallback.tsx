import React from 'react';
import { ImageIcon } from 'lucide-react';

interface ImageFallbackProps {
  text?: string;
  className?: string;
}

export const ImageFallback: React.FC<ImageFallbackProps> = ({ text = 'Image coming soon', className = '' }) => {
  return (
    <div className={`flex flex-col items-center justify-center bg-gray-100 border border-gray-200 text-gray-400 p-4 ${className}`}>
      <ImageIcon size={32} className="mb-2 opacity-50" />
      <span className="text-sm font-medium text-center">{text}</span>
    </div>
  );
};
