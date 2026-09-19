import { useState, useRef } from 'react';
import { UploadCloud, X, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '../../utils/cn';

interface FileUploadProps {
  onFileSelect?: (file: File | null) => void;
  accept?: string;
  maxSizeMB?: number;
  className?: string;
}

export function FileUpload({ onFileSelect, accept = 'image/*', maxSizeMB = 5, className }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    setError(null);
    setProgress(0);
    
    if (!selected) return;

    if (selected.size > maxSizeMB * 1024 * 1024) {
      setError(`File must be smaller than ${maxSizeMB}MB`);
      setFile(null);
      return;
    }

    setFile(selected);
    
    // Simulate upload progress
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 10;
      setProgress(currentProgress);
      if (currentProgress >= 100) {
        clearInterval(interval);
        onFileSelect?.(selected);
      }
    }, 100);
  };

  const removeFile = () => {
    setFile(null);
    setError(null);
    setProgress(0);
    onFileSelect?.(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className={cn('w-full', className)}>
      {!file ? (
        <div 
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition cursor-pointer"
          onClick={() => inputRef.current?.click()}
        >
          <UploadCloud className="mx-auto h-12 w-12 text-gray-400 mb-2" />
          <p className="text-sm font-medium text-gray-700">Click to upload or drag and drop</p>
          <p className="text-xs text-gray-500 mt-1">SVG, PNG, JPG or PDF (max. {maxSizeMB}MB)</p>
        </div>
      ) : (
        <div className="border border-gray-200 rounded-lg p-4 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3 overflow-hidden">
            {progress === 100 ? (
              <CheckCircle className="h-8 w-8 text-green-500 shrink-0" />
            ) : (
              <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin shrink-0" />
            )}
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
              <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              {progress > 0 && progress < 100 && (
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                  <div className="bg-primary h-1.5 rounded-full transition-all" style={{ width: `${progress}%` }}></div>
                </div>
              )}
            </div>
          </div>
          <button 
            type="button"
            onClick={removeFile}
            className="p-1 hover:bg-gray-100 rounded-full text-gray-500 hover:text-red-500 transition"
          >
            <X size={20} />
          </button>
        </div>
      )}
      
      {error && (
        <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
          <AlertCircle size={16} /> {error}
        </p>
      )}
      
      <input 
        ref={inputRef}
        type="file" 
        accept={accept} 
        onChange={handleFileChange} 
        className="hidden" 
      />
    </div>
  );
}
