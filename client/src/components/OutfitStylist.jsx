function OutfitStylist({ outfit, loading, baseItem, onAddToAvatar }) {
  if (loading) {
    return (
      <div className="card p-6">
        <h2 className="text-lg font-semibold mb-4">Building Your Outfit...</h2>
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex gap-3 animate-pulse">
              <div className="w-16 h-16 bg-gray-200 rounded" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!outfit) return null;

  const categories = Object.entries(outfit.suggestions);

  return (
    <div className="card p-6 sticky top-24">
      <h2 className="text-lg font-semibold mb-2">Complete Your Look</h2>
      <p className="text-sm text-gray-500 mb-4">
        Based on your selection, here are matching pieces:
      </p>

      {outfit.colorPalette && (
        <div className="mb-4">
          <p className="text-xs text-gray-500 mb-2">Color Palette:</p>
          <div className="flex gap-1">
            {outfit.colorPalette.slice(0, 5).map((color, i) => (
              <div
                key={i}
                className="w-6 h-6 rounded-full border border-gray-200"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>
      )}

      <div className="space-y-6">
        {categories.map(([category, products]) => (
          <div key={category}>
            <h3 className="text-sm font-medium text-gray-700 capitalize mb-2">
              {category}
            </h3>
            <div className="space-y-2">
              {products.slice(0, 2).map((product) => (
                <div
                  key={product.asin}
                  className="flex gap-3 p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-16 h-16 object-cover rounded"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/64?text=N/A';
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 line-clamp-2">
                      {product.title}
                    </p>
                    <p className="text-sm text-primary-600 font-semibold">
                      {product.price || 'N/A'}
                    </p>
                    <div className="flex gap-2 mt-1">
                      <a
                        href={product.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:underline"
                      >
                        View
                      </a>
                      <button
                        onClick={() => onAddToAvatar(product)}
                        className="text-xs text-primary-600 hover:underline"
                      >
                        Add to Avatar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {categories.length === 0 && (
        <p className="text-gray-500 text-sm">
          No matching items found. Try a different product.
        </p>
      )}
    </div>
  );
}

export default OutfitStylist;
