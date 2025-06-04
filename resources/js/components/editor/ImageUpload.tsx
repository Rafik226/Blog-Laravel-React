import React, { useState, useRef } from 'react';
import { Image as ImageIcon, Upload, X } from 'lucide-react';

interface ImageUploadProps {
  onImageSelected: (imageUrl: string) => void;
  defaultImage?: string;
  className?: string;
}

const ImageUpload = ({ onImageSelected, defaultImage = '', className = '' }: ImageUploadProps) => {
  const [preview, setPreview] = useState<string>(defaultImage);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndProcessImage(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files?.length) {
      validateAndProcessImage(e.dataTransfer.files[0]);
    }
  };

  const validateAndProcessImage = (file: File) => {
    setErrorMessage('');
    
    // Valider le type de fichier
    if (!file.type.match(/image\/(jpeg|jpg|png|gif|webp)/)) {
      setErrorMessage('Format de fichier non supporté. Utilisez JPG, PNG, GIF ou WEBP.');
      return;
    }
    
    // Valider la taille du fichier (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('L\'image est trop volumineuse. Taille maximum: 5MB.');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreview(result);
      onImageSelected(result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setPreview('');
    onImageSelected('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={className}>
      {!preview ? (
        <div
          className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors ${
            isDragging ? 'border-primary bg-primary/5' : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600'
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <ImageIcon className="w-10 h-10 text-gray-400 dark:text-gray-600 mb-2" />
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-1">
            Glissez-déposez une image ou cliquez pour sélectionner
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 text-center">
            JPG, PNG, GIF ou WEBP - 5MB maximum
          </p>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
          />
          {errorMessage && (
            <p className="mt-2 text-sm text-red-500">{errorMessage}</p>
          )}
        </div>
      ) : (
        <div className="relative">
          <img
            src={preview}
            alt="Aperçu de l'image"
            className="w-full h-64 object-cover rounded-lg"
          />
          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 bg-black/50 p-1 rounded-full hover:bg-black/70 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-2 right-2 bg-black/50 p-2 rounded-md hover:bg-black/70 transition-colors flex items-center"
          >
            <Upload className="w-4 h-4 text-white mr-1" />
            <span className="text-xs text-white">Changer</span>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
          />
        </div>
      )}
    </div>
  );
};

export default ImageUpload;