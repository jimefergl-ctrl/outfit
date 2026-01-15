import { useState, useEffect } from 'react';
import { extractColorsFromImage } from '../../utils/colorExtractor';

const COLOR_PRESETS = [
  { id: 'white', color: '#ffffff', label: 'White' },
  { id: 'cream', color: '#f5f5dc', label: 'Cream' },
  { id: 'blush', color: '#ffb6c1', label: 'Blush' },
  { id: 'lavender', color: '#e6e6fa', label: 'Lavender' },
  { id: 'sage', color: '#9dc183', label: 'Sage' },
  { id: 'sky', color: '#87ceeb', label: 'Sky' },
  { id: 'peach', color: '#ffcba4', label: 'Peach' },
  { id: 'mint', color: '#98fb98', label: 'Mint' },
  { id: 'sand', color: '#c2b280', label: 'Sand' },
  { id: 'coral', color: '#ff7f50', label: 'Coral' },
  { id: 'navy', color: '#1a1a40', label: 'Navy' },
  { id: 'charcoal', color: '#36454f', label: 'Charcoal' },
  { id: 'burgundy', color: '#722f37', label: 'Burgundy' },
  { id: 'forest', color: '#228b22', label: 'Forest' },
  { id: 'mustard', color: '#ffdb58', label: 'Mustard' },
  { id: 'black', color: '#1a1a1a', label: 'Black' },
];

export default function AestheticStep({
  aesthetic,
  aestheticImage,
  inspirationImage,
  savedBackgrounds = [],
  loading,
  onAestheticChange,
  onGenerate,
  onInspirationChange,
  onSaveBackground,
  onDeleteBackground,
  onNext
}) {
  const [mode, setMode] = useState(null); // 'color' or 'inspiration' or 'saved'
  const [selectedColor, setSelectedColor] = useState('#ffffff');
  const [customColor, setCustomColor] = useState('#ffffff');
  const [localInspiration, setLocalInspiration] = useState(null);
  const [extractedColors, setExtractedColors] = useState([]);
  const [extractingColors, setExtractingColors] = useState(false);

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    setCustomColor(color);
    onAestheticChange('solid-color');
    onGenerate({
      type: 'solid',
      color: color,
      id: 'solid-color'
    });
  };

  const handleCustomColorChange = (e) => {
    const color = e.target.value;
    setCustomColor(color);
    setSelectedColor(color);
    onAestheticChange('custom-color');
    onGenerate({
      type: 'solid',
      color: color,
      id: 'custom-color'
    });
  };

  const handleInspirationUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const imageUrl = event.target.result;
      setLocalInspiration(imageUrl);
      onInspirationChange?.(imageUrl);
      onAestheticChange('inspiration');

      // Extract colors from inspiration image
      setExtractingColors(true);
      try {
        const colors = await extractColorsFromImage(imageUrl);
        setExtractedColors(colors);

        // Auto-select the first extracted color as background
        if (colors.length > 0) {
          setSelectedColor(colors[0]);
          onGenerate({
            type: 'solid',
            color: colors[0],
            id: 'inspiration',
            inspirationImage: imageUrl,
            extractedColors: colors
          });
        }
      } catch (err) {
        console.error('Color extraction failed:', err);
        setExtractedColors([]);
        onGenerate({
          type: 'solid',
          color: '#f5f5f5',
          id: 'inspiration',
          inspirationImage: imageUrl
        });
      }
      setExtractingColors(false);
    };
    reader.readAsDataURL(file);
  };

  const canProceed = aestheticImage !== null;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">What aesthetic are you going for?</h3>
        <p className="text-gray-500 text-sm mb-4">
          Choose a background style for your pin
        </p>

        {/* Mode Selection */}
        {mode === null && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                onClick={() => setMode('color')}
                className="p-6 rounded-xl border-2 border-gray-200 hover:border-primary-500 hover:bg-primary-50 transition-all text-center"
              >
                <div className="text-4xl mb-2">🎨</div>
                <p className="font-medium text-gray-700">Solid Color</p>
                <p className="text-sm text-gray-500 mt-1">Pick a background color</p>
              </button>
              <button
                onClick={() => setMode('inspiration')}
                className="p-6 rounded-xl border-2 border-gray-200 hover:border-primary-500 hover:bg-primary-50 transition-all text-center"
              >
                <div className="text-4xl mb-2">✨</div>
                <p className="font-medium text-gray-700">Inspiration</p>
                <p className="text-sm text-gray-500 mt-1">Upload a pin to mimic</p>
              </button>
              {savedBackgrounds.length > 0 && (
                <button
                  onClick={() => setMode('saved')}
                  className="p-6 rounded-xl border-2 border-gray-200 hover:border-primary-500 hover:bg-primary-50 transition-all text-center"
                >
                  <div className="text-4xl mb-2">💾</div>
                  <p className="font-medium text-gray-700">Saved</p>
                  <p className="text-sm text-gray-500 mt-1">{savedBackgrounds.length} saved backgrounds</p>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Saved Backgrounds Mode */}
        {mode === 'saved' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-700">Your saved backgrounds:</p>
              <button
                onClick={() => {
                  setMode(null);
                  onAestheticChange('');
                  onGenerate(null);
                }}
                className="text-gray-500 hover:text-gray-700 text-sm"
              >
                ← Back
              </button>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {savedBackgrounds.map((bg) => (
                <div key={bg.id} className="relative group">
                  <button
                    onClick={() => {
                      setSelectedColor(bg.color);
                      onAestheticChange('saved-' + bg.id);
                      onGenerate({
                        type: 'solid',
                        color: bg.color,
                        id: 'saved-' + bg.id
                      });
                    }}
                    className={`w-full aspect-square rounded-lg border-2 transition-all ${
                      selectedColor === bg.color
                        ? 'ring-2 ring-primary-600 ring-offset-2 scale-105 border-transparent'
                        : 'border-gray-200 hover:scale-105'
                    }`}
                    style={{ backgroundColor: bg.color }}
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteBackground(bg.id);
                    }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Color Selection Mode */}
        {mode === 'color' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-700">Select a color:</p>
              <button
                onClick={() => {
                  setMode(null);
                  onAestheticChange('');
                  onGenerate(null);
                }}
                className="text-gray-500 hover:text-gray-700 text-sm"
              >
                ← Back
              </button>
            </div>

            {/* Color Grid */}
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {COLOR_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handleColorSelect(preset.color)}
                  className={`aspect-square rounded-lg border-2 transition-all ${
                    selectedColor === preset.color
                      ? 'ring-2 ring-primary-600 ring-offset-2 scale-105 border-transparent'
                      : 'border-gray-200 hover:scale-105'
                  }`}
                  style={{ backgroundColor: preset.color }}
                  title={preset.label}
                />
              ))}
            </div>

            {/* Custom Color Picker */}
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <label className="text-sm font-medium text-gray-700">Custom color:</label>
              <input
                type="color"
                value={customColor}
                onChange={handleCustomColorChange}
                className="w-12 h-12 rounded cursor-pointer border-0"
              />
              <input
                type="text"
                value={customColor}
                onChange={(e) => {
                  if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) {
                    handleCustomColorChange({ target: { value: e.target.value } });
                  }
                }}
                placeholder="#ffffff"
                className="input-field w-32 text-sm"
              />
            </div>
          </div>
        )}

        {/* Inspiration Mode */}
        {mode === 'inspiration' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-700">Upload inspiration:</p>
              <button
                onClick={() => {
                  setMode(null);
                  setLocalInspiration(null);
                  onInspirationChange?.(null);
                  onAestheticChange('');
                  onGenerate(null);
                }}
                className="text-gray-500 hover:text-gray-700 text-sm"
              >
                ← Back
              </button>
            </div>

            {!localInspiration ? (
              <label className="block border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-primary-400 hover:bg-gray-50 transition-all">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleInspirationUpload}
                  className="hidden"
                />
                <div className="text-5xl mb-3">📌</div>
                <p className="text-gray-700 font-medium mb-1">
                  Upload a Pinterest pin for inspiration
                </p>
                <p className="text-gray-500 text-sm">
                  We'll help you create something similar
                </p>
              </label>
            ) : (
              <div className="space-y-4">
                <div className="relative rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={localInspiration}
                    alt="Inspiration"
                    className="w-full h-64 object-contain"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4">
                    <p className="text-white font-medium">Your Inspiration</p>
                  </div>
                </div>

                {/* Extracted Colors */}
                {extractingColors ? (
                  <div className="p-4 bg-primary-50 rounded-lg text-center">
                    <p className="text-primary-700 font-medium">Extracting colors from your inspiration...</p>
                  </div>
                ) : extractedColors.length > 0 ? (
                  <div className="p-4 bg-primary-50 rounded-lg">
                    <p className="text-sm font-medium text-primary-700 mb-3">
                      Colors extracted from your inspiration (click to use):
                    </p>
                    <div className="flex gap-2">
                      {extractedColors.map((color, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setSelectedColor(color);
                            onGenerate({
                              type: 'solid',
                              color: color,
                              id: 'inspiration',
                              inspirationImage: localInspiration,
                              extractedColors: extractedColors
                            });
                          }}
                          className={`w-12 h-12 rounded-lg border-2 transition-all ${
                            selectedColor === color
                              ? 'ring-2 ring-primary-600 ring-offset-2 scale-110 border-transparent'
                              : 'border-gray-300 hover:scale-105'
                          }`}
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>
                  </div>
                ) : null}

                {/* Other colors */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 mb-3">Or choose another color:</p>
                  <div className="flex items-center gap-2">
                    <div className="grid grid-cols-8 gap-2 flex-1">
                      {COLOR_PRESETS.slice(0, 8).map((preset) => (
                        <button
                          key={preset.id}
                          onClick={() => {
                            setSelectedColor(preset.color);
                            onGenerate({
                              type: 'solid',
                              color: preset.color,
                              id: 'inspiration',
                              inspirationImage: localInspiration,
                              extractedColors: extractedColors
                            });
                          }}
                          className={`aspect-square rounded-lg border-2 transition-all ${
                            selectedColor === preset.color
                              ? 'ring-2 ring-primary-600 ring-offset-1 scale-105 border-transparent'
                              : 'border-gray-200 hover:scale-105'
                          }`}
                          style={{ backgroundColor: preset.color }}
                        />
                      ))}
                    </div>
                    <input
                      type="color"
                      value={customColor}
                      onChange={(e) => {
                        setSelectedColor(e.target.value);
                        setCustomColor(e.target.value);
                        onGenerate({
                          type: 'solid',
                          color: e.target.value,
                          id: 'inspiration',
                          inspirationImage: localInspiration,
                          extractedColors: extractedColors
                        });
                      }}
                      className="w-10 h-10 rounded cursor-pointer border-0"
                    />
                  </div>
                </div>

                <button
                  onClick={() => {
                    setLocalInspiration(null);
                    setExtractedColors([]);
                    onInspirationChange?.(null);
                  }}
                  className="text-gray-500 hover:text-gray-700 text-sm"
                >
                  ↻ Choose different inspiration
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Preview */}
      {aestheticImage && (
        <div className="space-y-4">
          <div
            className="relative rounded-lg overflow-hidden h-48"
            style={{ backgroundColor: aestheticImage.color || '#f0f0f0' }}
          >
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/30 to-transparent p-4">
              <p className="text-white font-medium">
                {mode === 'inspiration' ? 'Inspiration Mode' : 'Background Preview'}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            {mode !== 'saved' && onSaveBackground && (
              <button
                onClick={() => onSaveBackground({ color: aestheticImage.color })}
                className="btn-secondary flex-1"
              >
                💾 Save Background
              </button>
            )}
            <button
              onClick={onNext}
              disabled={!canProceed}
              className="btn-primary flex-1"
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
