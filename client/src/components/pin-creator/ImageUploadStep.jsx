import { useState, useRef, useCallback } from 'react';
import { removeBackground } from '@imgly/background-removal';

export default function ImageUploadStep({
  images,
  loading,
  onAddImage,
  onRemoveImage,
  onNext,
  onBack
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [processingImages, setProcessingImages] = useState({});
  const fileInputRef = useRef(null);

  const processImage = async (file, imageId) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = e.target.result;

        // Add image immediately with original
        onAddImage(base64, imageId, false);

        // Start background removal
        setProcessingImages(prev => ({ ...prev, [imageId]: true }));

        try {
          const blob = await removeBackground(base64, {
            progress: (key, current, total) => {
              // Optional: track progress
            }
          });

          // Convert blob to base64
          const reader2 = new FileReader();
          reader2.onload = () => {
            onAddImage(reader2.result, imageId, true);
            setProcessingImages(prev => {
              const newState = { ...prev };
              delete newState[imageId];
              return newState;
            });
          };
          reader2.readAsDataURL(blob);
        } catch (err) {
          console.error('Background removal failed:', err);
          setProcessingImages(prev => {
            const newState = { ...prev };
            delete newState[imageId];
            return newState;
          });
        }

        resolve();
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFiles = useCallback(async (files) => {
    const imageFiles = Array.from(files).filter(file =>
      file.type.startsWith('image/')
    );

    for (const file of imageFiles) {
      const imageId = Date.now() + Math.random();
      await processImage(file, imageId);
    }
  }, [onAddImage]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleFileInput = (e) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const handlePaste = useCallback((e) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (const item of items) {
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file) {
          handleFiles([file]);
        }
      }
    }
  }, [handleFiles]);

  const isProcessing = Object.keys(processingImages).length > 0;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">What images would you like to include?</h3>
        <p className="text-gray-500 text-sm mb-4">
          Drop, paste, or upload images. Backgrounds will be automatically removed (this may take a moment).
        </p>

        {/* Drop Zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onPaste={handlePaste}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-primary-500 bg-primary-50'
              : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileInput}
            className="hidden"
          />

          <div className="text-5xl mb-3">
            {isDragging ? '📥' : '🖼️'}
          </div>

          <p className="text-gray-700 font-medium mb-1">
            Drop images here, paste, or click to upload
          </p>
          <p className="text-gray-500 text-sm">
            Supports PNG, JPG, WEBP
          </p>
        </div>
      </div>

      {/* Image Previews */}
      {images.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            Your Images ({images.length})
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {images.map((image) => (
              <div
                key={image.id}
                className="relative group rounded-lg overflow-hidden bg-gray-100 border border-gray-200"
              >
                {/* Checkerboard pattern to show transparency */}
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `linear-gradient(45deg, #f0f0f0 25%, transparent 25%),
                      linear-gradient(-45deg, #f0f0f0 25%, transparent 25%),
                      linear-gradient(45deg, transparent 75%, #f0f0f0 75%),
                      linear-gradient(-45deg, transparent 75%, #f0f0f0 75%)`,
                    backgroundSize: '20px 20px',
                    backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
                  }}
                />
                <img
                  src={image.processed}
                  alt="Uploaded"
                  className="relative w-full h-32 object-contain p-2"
                />

                {/* Processing Indicator */}
                {processingImages[image.id] && (
                  <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center">
                    <svg className="animate-spin h-6 w-6 text-white mb-2" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span className="text-white text-xs">Removing BG...</span>
                  </div>
                )}

                {/* Status Badge */}
                {image.backgroundRemoved && !processingImages[image.id] && (
                  <div className="absolute top-1 left-1 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded">
                    BG Removed
                  </div>
                )}

                {/* Remove Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveImage(image.id);
                  }}
                  className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-sm"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex gap-3 pt-4">
        <button onClick={onBack} className="btn-secondary flex-1">
          Back
        </button>
        <button
          onClick={onNext}
          disabled={isProcessing}
          className="btn-primary flex-1"
        >
          {images.length === 0 ? 'Skip' : isProcessing ? 'Processing...' : 'Continue'}
        </button>
      </div>
    </div>
  );
}
