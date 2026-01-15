import { useEffect, useState } from 'react';
import { usePinCreator } from '../hooks/usePinCreator';
import AestheticStep from './pin-creator/AestheticStep';
import ImageUploadStep from './pin-creator/ImageUploadStep';
import TextStep from './pin-creator/TextStep';
import PinEditor from './pin-creator/PinEditor';

const STEP_TITLES = [
  'Choose Your Aesthetic',
  'Add Your Images',
  'Add Text?',
  'Edit Your Pin'
];

// Load saved backgrounds from localStorage
const loadSavedBackgrounds = () => {
  try {
    const saved = localStorage.getItem('pin-saved-backgrounds');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

// Save backgrounds to localStorage
const saveBackgrounds = (backgrounds) => {
  localStorage.setItem('pin-saved-backgrounds', JSON.stringify(backgrounds));
};

export default function PinCreator({ preloadedImages = [], onImagesLoaded }) {
  const pinCreator = usePinCreator();
  const { currentStep, totalSteps, loading, error } = pinCreator;
  const [savedBackgrounds, setSavedBackgrounds] = useState(loadSavedBackgrounds);

  // Load preloaded images when component mounts with them
  useEffect(() => {
    if (preloadedImages.length > 0) {
      // Skip to step 2 (images) and pre-load the images
      preloadedImages.forEach((img, index) => {
        const imageId = Date.now() + index;
        pinCreator.addUserImage(img.url, imageId, false);
      });
      pinCreator.goToStep(0); // Start at aesthetic step
      onImagesLoaded?.();
    }
  }, []);

  const handleSaveBackground = (background) => {
    const newBackground = {
      id: Date.now(),
      ...background
    };
    const updated = [...savedBackgrounds, newBackground];
    setSavedBackgrounds(updated);
    saveBackgrounds(updated);
  };

  const handleDeleteBackground = (id) => {
    const updated = savedBackgrounds.filter(bg => bg.id !== id);
    setSavedBackgrounds(updated);
    saveBackgrounds(updated);
  };

  return (
    <div className="space-y-6">
      {/* Progress Indicator */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gradient">Create Your Pin</h2>
          <span className="text-sm text-gray-500">
            Step {currentStep + 1} of {totalSteps}
          </span>
        </div>

        {/* Step Progress Bar */}
        <div className="flex items-center gap-2 mb-6">
          {STEP_TITLES.map((title, index) => (
            <div key={index} className="flex-1">
              <div
                className={`h-2 rounded-full transition-colors ${
                  index < currentStep
                    ? 'bg-primary-600'
                    : index === currentStep
                    ? 'bg-primary-400'
                    : 'bg-gray-200'
                }`}
              />
              <p
                className={`text-xs mt-1 text-center truncate ${
                  index === currentStep ? 'text-primary-600 font-medium' : 'text-gray-400'
                }`}
              >
                {title}
              </p>
            </div>
          ))}
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Loading Overlay */}
        {loading && (
          <div className="flex items-center justify-center gap-3 py-4 text-primary-600">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
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
            <span>Working on it...</span>
          </div>
        )}
      </div>

      {/* Step Content */}
      <div className="card p-6">
        {currentStep === 0 && (
          <AestheticStep
            aesthetic={pinCreator.aesthetic}
            aestheticImage={pinCreator.aestheticImage}
            inspirationImage={pinCreator.inspirationImage}
            savedBackgrounds={savedBackgrounds}
            loading={loading}
            onAestheticChange={pinCreator.setAesthetic}
            onGenerate={pinCreator.generateAestheticBackground}
            onInspirationChange={pinCreator.setInspirationImage}
            onSaveBackground={handleSaveBackground}
            onDeleteBackground={handleDeleteBackground}
            onNext={pinCreator.nextStep}
          />
        )}

        {currentStep === 1 && (
          <ImageUploadStep
            images={pinCreator.userImages}
            loading={loading}
            onAddImage={pinCreator.addUserImage}
            onRemoveImage={pinCreator.removeUserImage}
            onNext={pinCreator.nextStep}
            onBack={pinCreator.prevStep}
          />
        )}

        {currentStep === 2 && (
          <TextStep
            wantsText={pinCreator.wantsText}
            textIdeas={pinCreator.textIdeas}
            selectedText={pinCreator.selectedText}
            aesthetic={pinCreator.aesthetic}
            loading={loading}
            onWantsTextChange={pinCreator.setWantsText}
            onGenerateIdeas={pinCreator.generateTextSuggestions}
            onSelectText={pinCreator.setSelectedText}
            onNext={pinCreator.nextStep}
            onBack={pinCreator.prevStep}
          />
        )}

        {currentStep === 3 && (
          <PinEditor
            aestheticImage={pinCreator.aestheticImage}
            userImages={pinCreator.userImages}
            selectedText={pinCreator.selectedText}
            aesthetic={pinCreator.aesthetic}
            inspirationImage={pinCreator.inspirationImage}
            onBack={pinCreator.prevStep}
            onReset={pinCreator.reset}
          />
        )}
      </div>
    </div>
  );
}
