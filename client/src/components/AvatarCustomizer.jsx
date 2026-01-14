const BODY_TYPES = [
  { id: 'slim', label: 'Slim' },
  { id: 'average', label: 'Average' },
  { id: 'athletic', label: 'Athletic' },
  { id: 'curvy', label: 'Curvy' }
];

const HEIGHTS = [
  { id: 'short', label: 'Petite' },
  { id: 'medium', label: 'Medium' },
  { id: 'tall', label: 'Tall' }
];

const SKIN_TONES = [
  '#f5e0d0',
  '#e0b8a0',
  '#d4a574',
  '#c68642',
  '#8d5524',
  '#6b4423'
];

const HAIR_COLORS = [
  '#2c1810',
  '#4a3728',
  '#8b4513',
  '#d4a574',
  '#ffd700',
  '#ff6b6b',
  '#4a90d9',
  '#9b59b6'
];

const HAIR_STYLES = [
  { id: 'short', label: 'Short' },
  { id: 'medium', label: 'Medium' },
  { id: 'long', label: 'Long' },
  { id: 'curly', label: 'Curly' },
  { id: 'bun', label: 'Bun' }
];

function AvatarCustomizer({ avatar, onUpdate }) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Body Type
        </label>
        <div className="flex flex-wrap gap-2">
          {BODY_TYPES.map((type) => (
            <button
              key={type.id}
              onClick={() => onUpdate({ bodyType: type.id })}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                avatar.bodyType === type.id
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Height
        </label>
        <div className="flex flex-wrap gap-2">
          {HEIGHTS.map((height) => (
            <button
              key={height.id}
              onClick={() => onUpdate({ height: height.id })}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                avatar.height === height.id
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {height.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Skin Tone
        </label>
        <div className="flex flex-wrap gap-2">
          {SKIN_TONES.map((tone) => (
            <button
              key={tone}
              onClick={() => onUpdate({ skinTone: tone })}
              className={`w-10 h-10 rounded-full border-2 transition-transform ${
                avatar.skinTone === tone
                  ? 'border-primary-600 scale-110'
                  : 'border-gray-200 hover:scale-105'
              }`}
              style={{ backgroundColor: tone }}
              title={tone}
            />
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Hair Color
        </label>
        <div className="flex flex-wrap gap-2">
          {HAIR_COLORS.map((color) => (
            <button
              key={color}
              onClick={() => onUpdate({ hairColor: color })}
              className={`w-10 h-10 rounded-full border-2 transition-transform ${
                avatar.hairColor === color
                  ? 'border-primary-600 scale-110'
                  : 'border-gray-200 hover:scale-105'
              }`}
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Hair Style
        </label>
        <div className="flex flex-wrap gap-2">
          {HAIR_STYLES.map((style) => (
            <button
              key={style.id}
              onClick={() => onUpdate({ hairStyle: style.id })}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                avatar.hairStyle === style.id
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {style.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AvatarCustomizer;
