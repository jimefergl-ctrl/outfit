function ProductCard({ product, onSelect, onAddToAvatar, isSelected }) {
  return (
    <div
      className={`card cursor-pointer transition-all ${
        isSelected ? 'ring-2 ring-primary-500 scale-[1.02]' : ''
      }`}
      onClick={() => onSelect(product)}
    >
      <div className="aspect-square bg-gray-100 relative overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300?text=No+Image';
          }}
        />
        {product.category && (
          <span className="absolute top-2 left-2 bg-white/90 px-2 py-1 rounded text-xs font-medium text-gray-700">
            {product.category}
          </span>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-medium text-gray-900 line-clamp-2 text-sm mb-2">
          {product.title}
        </h3>

        <div className="flex items-center justify-between mb-3">
          <span className="text-lg font-bold text-primary-600">
            {product.price || 'Price N/A'}
          </span>
          {product.rating && (
            <span className="text-sm text-gray-500">
              ⭐ {product.rating}
            </span>
          )}
        </div>

        <div className="flex gap-2">
          <a
            href={product.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary text-sm py-2 flex-1 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            View on Amazon
          </a>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToAvatar(product);
            }}
            className="btn-primary text-sm py-2 px-3"
            title="Add to Avatar"
          >
            +👤
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
