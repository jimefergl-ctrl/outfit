import { useState, useEffect } from 'react';

function Avatar2D({ avatar, clothing }) {
  const bodyWidths = {
    slim: 'w-24',
    average: 'w-28',
    athletic: 'w-30',
    curvy: 'w-32'
  };

  const heights = {
    short: 'h-72',
    medium: 'h-80',
    tall: 'h-96'
  };

  const hairLengths = {
    short: 'h-4',
    medium: 'h-12',
    long: 'h-24',
    curly: 'h-16',
    bun: 'h-6'
  };

  return (
    <div className="relative flex flex-col items-center py-8">
      {/* Hair (back layer for long hair) */}
      {(avatar.hairStyle === 'long' || avatar.hairStyle === 'medium') && (
        <div
          className={`absolute top-16 ${hairLengths[avatar.hairStyle]} w-20 rounded-b-full -z-10`}
          style={{ backgroundColor: avatar.hairColor }}
        />
      )}

      {/* Head */}
      <div className="relative">
        {/* Hair top */}
        <div
          className="absolute -top-2 left-1/2 -translate-x-1/2 w-16 h-8 rounded-t-full"
          style={{ backgroundColor: avatar.hairColor }}
        />
        {avatar.hairStyle === 'bun' && (
          <div
            className="absolute -top-6 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full"
            style={{ backgroundColor: avatar.hairColor }}
          />
        )}
        {/* Face */}
        <div
          className="w-14 h-16 rounded-full relative"
          style={{ backgroundColor: avatar.skinTone }}
        >
          {/* Eyes */}
          <div className="absolute top-5 left-3 w-2 h-2 bg-gray-800 rounded-full" />
          <div className="absolute top-5 right-3 w-2 h-2 bg-gray-800 rounded-full" />
          {/* Smile */}
          <div className="absolute top-9 left-1/2 -translate-x-1/2 w-4 h-2 border-b-2 border-gray-700 rounded-b-full" />
        </div>
      </div>

      {/* Neck */}
      <div
        className="w-6 h-4"
        style={{ backgroundColor: avatar.skinTone }}
      />

      {/* Jewelry (necklace) */}
      {clothing.jewelry && (
        <div className="absolute top-[88px] w-12 h-3 border-2 border-yellow-400 rounded-b-full bg-transparent" />
      )}

      {/* Body */}
      <div className={`relative ${bodyWidths[avatar.bodyType]} ${heights[avatar.height]}`}>
        {/* Top/Dress */}
        <div
          className={`w-full ${clothing.dress ? 'h-full' : 'h-1/2'} rounded-t-lg ${!clothing.top && !clothing.dress ? 'bg-gray-200' : ''}`}
          style={{
            backgroundColor: clothing.dress?.color || clothing.top?.color || (clothing.dress || clothing.top ? '#e879f9' : undefined)
          }}
        >
          {(clothing.top || clothing.dress) && (
            <div className="w-full h-full flex items-center justify-center">
              <img
                src={clothing.dress?.image || clothing.top?.image}
                alt="top"
                className="w-full h-full object-cover rounded-t-lg opacity-90"
                onError={(e) => e.target.style.display = 'none'}
              />
            </div>
          )}
        </div>

        {/* Bottom (only if no dress) */}
        {!clothing.dress && (
          <div
            className={`w-full h-1/2 rounded-b-lg ${!clothing.bottom ? 'bg-blue-600' : ''}`}
            style={{
              backgroundColor: clothing.bottom?.color || (clothing.bottom ? '#1e40af' : undefined)
            }}
          >
            {clothing.bottom && (
              <img
                src={clothing.bottom.image}
                alt="bottom"
                className="w-full h-full object-cover rounded-b-lg opacity-90"
                onError={(e) => e.target.style.display = 'none'}
              />
            )}
          </div>
        )}

        {/* Arms */}
        <div
          className="absolute -left-4 top-2 w-4 h-24 rounded-full"
          style={{ backgroundColor: avatar.skinTone }}
        />
        <div
          className="absolute -right-4 top-2 w-4 h-24 rounded-full"
          style={{ backgroundColor: avatar.skinTone }}
        />

        {/* Bag */}
        {clothing.bag && (
          <div className="absolute -right-8 top-8 w-10 h-12 rounded bg-amber-700 overflow-hidden">
            <img
              src={clothing.bag.image}
              alt="bag"
              className="w-full h-full object-cover"
              onError={(e) => e.target.style.display = 'none'}
            />
          </div>
        )}
      </div>

      {/* Legs */}
      <div className="flex gap-2">
        <div
          className="w-5 h-16 rounded-b-lg"
          style={{ backgroundColor: avatar.skinTone }}
        />
        <div
          className="w-5 h-16 rounded-b-lg"
          style={{ backgroundColor: avatar.skinTone }}
        />
      </div>

      {/* Shoes */}
      <div className="flex gap-4 -mt-1">
        <div
          className={`w-6 h-4 rounded ${!clothing.shoes ? 'bg-gray-800' : ''}`}
          style={{ backgroundColor: clothing.shoes?.color }}
        >
          {clothing.shoes && (
            <img
              src={clothing.shoes.image}
              alt="shoes"
              className="w-full h-full object-cover rounded"
              onError={(e) => e.target.style.display = 'none'}
            />
          )}
        </div>
        <div
          className={`w-6 h-4 rounded ${!clothing.shoes ? 'bg-gray-800' : ''}`}
          style={{ backgroundColor: clothing.shoes?.color }}
        >
          {clothing.shoes && (
            <img
              src={clothing.shoes.image}
              alt="shoes"
              className="w-full h-full object-cover rounded"
              onError={(e) => e.target.style.display = 'none'}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function Avatar3D({ avatar, clothing, onRemoveClothing }) {
  const clothingItems = Object.entries(clothing).filter(([_, item]) => item !== null);

  return (
    <div className="space-y-4">
      <div className="h-96 bg-gradient-to-b from-purple-50 to-pink-50 rounded-lg overflow-hidden flex items-center justify-center">
        <Avatar2D avatar={avatar} clothing={clothing} />
      </div>

      {clothingItems.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Current Outfit:</h3>
          <div className="flex flex-wrap gap-2">
            {clothingItems.map(([category, item]) => (
              <div
                key={category}
                className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full"
              >
                <img
                  src={item.image}
                  alt={category}
                  className="w-6 h-6 rounded object-cover"
                  onError={(e) => e.target.style.display = 'none'}
                />
                <span className="text-sm capitalize">{category}</span>
                <button
                  onClick={() => onRemoveClothing(category)}
                  className="text-gray-500 hover:text-red-500 ml-1"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {clothingItems.length === 0 && (
        <p className="text-sm text-gray-500 text-center">
          Add items from the Search tab to dress your avatar
        </p>
      )}
    </div>
  );
}

export default Avatar3D;
