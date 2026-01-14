function OutfitBuilder({ clothing, onRemove, onSave }) {
  const items = Object.entries(clothing).filter(([_, item]) => item !== null);
  const totalPrice = items.reduce((sum, [_, item]) => {
    const price = parseFloat(item.price?.replace(/[^0-9.]/g, '') || 0);
    return sum + price;
  }, 0);

  if (items.length === 0) {
    return (
      <div className="card p-6 text-center">
        <p className="text-gray-500">
          Add items to your avatar to build an outfit
        </p>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <h2 className="text-lg font-semibold mb-4">Current Outfit</h2>

      <div className="space-y-3 mb-4">
        {items.map(([category, item]) => (
          <div
            key={category}
            className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg"
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-12 h-12 object-cover rounded"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/48?text=N/A';
              }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 capitalize">
                {category}
              </p>
              <p className="text-xs text-gray-500 truncate">{item.title}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-primary-600">
                {item.price || 'N/A'}
              </p>
              <button
                onClick={() => onRemove(category)}
                className="text-xs text-red-500 hover:underline"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t pt-4 mb-4">
        <div className="flex justify-between items-center">
          <span className="font-medium text-gray-700">Estimated Total:</span>
          <span className="text-xl font-bold text-primary-600">
            ${totalPrice.toFixed(2)}
          </span>
        </div>
      </div>

      <button onClick={onSave} className="btn-primary w-full">
        Save to Wardrobe
      </button>

      <div className="mt-4 space-y-2">
        <p className="text-sm font-medium text-gray-700">Shop Items:</p>
        {items.map(([category, item]) => (
          <a
            key={category}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-sm text-blue-600 hover:underline truncate"
          >
            Buy {category} on Amazon
          </a>
        ))}
      </div>
    </div>
  );
}

export default OutfitBuilder;
