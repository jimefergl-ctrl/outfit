import { useState, useEffect } from 'react';

const TEXT_SUGGESTIONS = {
  minimalist: [
    'Less is more',
    'Simplicity',
    'Clean & calm',
    'Breathe',
    'Space to think',
    'Pure'
  ],
  cottagecore: [
    'Wildflower soul',
    'Slow living',
    'Bloom where planted',
    'Cozy days',
    'Simple pleasures',
    'Homemade happiness'
  ],
  'dark-academia': [
    'Dead poets society',
    'Knowledge is power',
    'Carpe diem',
    'Lost in literature',
    'Ink & coffee',
    'Autumn leaves & old books'
  ],
  bohemian: [
    'Free spirit',
    'Wild & free',
    'Wanderlust',
    'Good vibes only',
    'Live in the moment',
    'Follow the sun'
  ],
  vintage: [
    'Timeless',
    'Old soul',
    'Classic never dies',
    'Nostalgia',
    'Golden days',
    'Retro vibes'
  ],
  modern: [
    'Bold moves',
    'Forward thinking',
    'Create the future',
    'Innovate',
    'Level up',
    'New era'
  ],
  romantic: [
    'Love always',
    'Dream big',
    'Soft heart',
    'Forever & always',
    'Sweet moments',
    'Follow your heart'
  ],
  grunge: [
    'Stay weird',
    'No rules',
    'Chaos & art',
    'Unfiltered',
    'Raw & real',
    'Against the grain'
  ],
  coastal: [
    'Ocean soul',
    'Salty air',
    'Sea breeze',
    'Vitamin sea',
    'Beach state of mind',
    'Waves & wonder'
  ],
  ethereal: [
    'Dreaming awake',
    'Magic exists',
    'Soft glow',
    'Beyond the stars',
    'Otherworldly',
    'Light being'
  ],
  sunset: [
    'Golden hour',
    'Chase the sun',
    'Sky on fire',
    'Dusk dreams',
    'Until tomorrow',
    'Paint the sky'
  ],
  forest: [
    'Into the wild',
    'Nature heals',
    'Deep roots',
    'Forest bathing',
    'Wild at heart',
    'Green therapy'
  ],
  custom: [
    'Make it yours',
    'Your story',
    'Unique vibes',
    'One of a kind',
    'Express yourself',
    'Create magic'
  ]
};

export default function TextStep({
  wantsText,
  textIdeas,
  selectedText,
  aesthetic,
  loading,
  onWantsTextChange,
  onGenerateIdeas,
  onSelectText,
  onNext,
  onBack
}) {
  const [customText, setCustomText] = useState('');
  const [localIdeas, setLocalIdeas] = useState([]);

  useEffect(() => {
    // Load suggestions when aesthetic changes
    const key = aesthetic?.replace('-', '-') || 'custom';
    setLocalIdeas(TEXT_SUGGESTIONS[key] || TEXT_SUGGESTIONS.custom);
  }, [aesthetic]);

  const handleYes = () => {
    onWantsTextChange(true);
  };

  const handleNo = () => {
    onWantsTextChange(false);
    onSelectText('');
  };

  const handleSelectIdea = (idea) => {
    onSelectText(idea);
    setCustomText('');
  };

  const handleCustomChange = (e) => {
    setCustomText(e.target.value);
    onSelectText(e.target.value);
  };

  const shuffleIdeas = () => {
    const shuffled = [...localIdeas].sort(() => Math.random() - 0.5);
    setLocalIdeas(shuffled);
  };

  const handleContinue = () => {
    onNext();
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Would you like to display any text?</h3>
        <p className="text-gray-500 text-sm mb-4">
          Add a quote, title, or caption to your pin
        </p>

        {/* Yes/No Selection */}
        {wantsText === null && (
          <div className="flex gap-4">
            <button
              onClick={handleYes}
              className="flex-1 p-6 rounded-xl border-2 border-gray-200 hover:border-primary-500 hover:bg-primary-50 transition-all text-center"
            >
              <div className="text-4xl mb-2">✍️</div>
              <p className="font-medium text-gray-700">Yes, add text</p>
              <p className="text-sm text-gray-500 mt-1">Choose from suggestions</p>
            </button>
            <button
              onClick={handleNo}
              className="flex-1 p-6 rounded-xl border-2 border-gray-200 hover:border-gray-400 hover:bg-gray-50 transition-all text-center"
            >
              <div className="text-4xl mb-2">🖼️</div>
              <p className="font-medium text-gray-700">No, images only</p>
              <p className="text-sm text-gray-500 mt-1">Keep it visual</p>
            </button>
          </div>
        )}

        {/* Text Ideas */}
        {wantsText === true && (
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-gray-700">
                  Select a text idea for "{aesthetic}" aesthetic:
                </p>
                <button
                  onClick={shuffleIdeas}
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  ↻ Shuffle
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {localIdeas.map((idea, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelectIdea(idea)}
                    className={`p-3 rounded-lg text-left transition-all ${
                      selectedText === idea
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    "{idea}"
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Text Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Or write your own:
              </label>
              <input
                type="text"
                value={customText}
                onChange={handleCustomChange}
                placeholder="Enter your custom text..."
                className="input-field"
              />
            </div>

            {/* Preview */}
            {selectedText && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Selected text:</p>
                <p className="text-lg font-medium text-gray-800">"{selectedText}"</p>
              </div>
            )}

            {/* Change Mind Button */}
            <button
              onClick={() => {
                onWantsTextChange(null);
                onSelectText('');
              }}
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              ← Change my mind
            </button>
          </div>
        )}

        {/* No Text Selected */}
        {wantsText === false && (
          <div className="text-center py-8">
            <div className="text-5xl mb-3">🖼️</div>
            <p className="text-gray-700 font-medium">No text - visual only</p>
            <button
              onClick={() => onWantsTextChange(null)}
              className="text-primary-600 hover:text-primary-700 text-sm mt-2"
            >
              ← Change my mind
            </button>
          </div>
        )}
      </div>

      {/* Navigation */}
      {wantsText !== null && (
        <div className="flex gap-3 pt-4">
          <button onClick={onBack} className="btn-secondary flex-1">
            Back
          </button>
          <button
            onClick={handleContinue}
            disabled={wantsText && !selectedText}
            className="btn-primary flex-1"
          >
            Continue to Editor
          </button>
        </div>
      )}
    </div>
  );
}
