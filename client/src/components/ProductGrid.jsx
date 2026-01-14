import ProductCard from './ProductCard';

function ProductGrid({ products, loading, onProductSelect, onAddToAvatar, selectedProduct }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="card animate-pulse">
            <div className="aspect-square bg-gray-200" />
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="h-8 bg-gray-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="card p-12 text-center">
        <div className="text-6xl mb-4">👗</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          Start Your Style Search
        </h3>
        <p className="text-gray-500">
          Search for clothes, accessories, or style inspiration to get started.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-700">
          {products.length} Products Found
        </h2>
        <p className="text-sm text-gray-500">
          Click a product to get outfit suggestions
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {products.map((product) => (
          <ProductCard
            key={product.asin}
            product={product}
            onSelect={onProductSelect}
            onAddToAvatar={onAddToAvatar}
            isSelected={selectedProduct?.asin === product.asin}
          />
        ))}
      </div>
    </div>
  );
}

export default ProductGrid;
