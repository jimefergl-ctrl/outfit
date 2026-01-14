function Wardrobe({ outfits, onRemove, onLoad }) {
  if (outfits.length === 0) {
    return (
      <div className="card p-12 text-center">
        <div className="text-6xl mb-4">👗</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          Your Wardrobe is Empty
        </h3>
        <p className="text-gray-500">
          Save outfits from the Avatar tab to build your wardrobe collection.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-700">
          Your Wardrobe ({outfits.length} outfits)
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {outfits.map((outfit) => (
          <div key={outfit.id} className="card overflow-hidden">
            <div className="p-4 bg-gradient-to-br from-primary-50 to-pink-50">
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(outfit.items).slice(0, 6).map(([category, item]) => (
                  <div
                    key={category}
                    className="aspect-square bg-white rounded-lg overflow-hidden shadow-sm"
                  >
                    {item?.image ? (
                      <img
                        src={item.image}
                        alt={category}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                        {category}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4">
              <h3 className="font-medium text-gray-900 mb-1">{outfit.name}</h3>
              <p className="text-sm text-gray-500 mb-3">
                {Object.keys(outfit.items).length} items
                <span className="mx-2">-</span>
                {new Date(outfit.createdAt).toLocaleDateString()}
              </p>

              <div className="flex gap-2">
                <button
                  onClick={() => onLoad(outfit)}
                  className="btn-primary text-sm py-2 flex-1"
                >
                  Load Outfit
                </button>
                <button
                  onClick={() => onRemove(outfit.id)}
                  className="btn-secondary text-sm py-2 px-3 text-red-600 hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </div>

            <div className="px-4 pb-4">
              <details className="text-sm">
                <summary className="cursor-pointer text-gray-500 hover:text-gray-700">
                  View Items
                </summary>
                <div className="mt-2 space-y-2">
                  {Object.entries(outfit.items).map(([category, item]) => (
                    <div key={category} className="flex items-center gap-2">
                      <span className="capitalize text-gray-600 w-20">{category}:</span>
                      {item?.url ? (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline truncate flex-1"
                        >
                          {item.title || 'View on Amazon'}
                        </a>
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </div>
                  ))}
                </div>
              </details>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Wardrobe;
