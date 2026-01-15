import { useState } from 'react';
import { useLinktree } from '../hooks/useLinktree';

export default function Linktree() {
  const {
    products,
    settings,
    addProduct,
    removeProduct,
    updateSettings,
    clearAll,
    downloadPage
  } = useLinktree();

  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({ title: '', image: '', url: '', price: '' });
  const [showSettings, setShowSettings] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (newProduct.url && newProduct.image) {
      addProduct(newProduct);
      setNewProduct({ title: '', image: '', url: '', price: '' });
      setShowAddForm(false);
    }
  };

  const handleImageUrlPaste = (e) => {
    const url = e.target.value;
    setNewProduct(prev => ({ ...prev, image: url }));
  };

  if (previewMode) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: settings.backgroundColor }}>
        <div className="max-w-xl mx-auto px-4 py-8">
          {/* Preview Header */}
          <div className="flex items-center justify-between mb-6">
            <span className="text-sm text-gray-500">Preview Mode</span>
            <button
              onClick={() => setPreviewMode(false)}
              className="btn-secondary text-sm"
            >
              Exit Preview
            </button>
          </div>

          {/* Linktree Preview */}
          <div className="text-center mb-8">
            <h1
              className="text-2xl font-bold mb-2"
              style={{ color: settings.accentColor }}
            >
              {settings.title}
            </h1>
            <p className="text-gray-600">{settings.bio}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {products.map((product) => (
              <a
                key={product.id}
                href={product.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all hover:-translate-y-1"
              >
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full aspect-square object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300?text=Image';
                  }}
                />
                <div className="p-3">
                  <p className="text-sm font-medium text-gray-800 line-clamp-2">
                    {product.title || 'Product'}
                  </p>
                  {product.price && (
                    <p
                      className="text-sm font-semibold mt-1"
                      style={{ color: settings.accentColor }}
                    >
                      {product.price}
                    </p>
                  )}
                </div>
              </a>
            ))}
          </div>

          {products.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No products added yet
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gradient">My Product Links</h2>
            <p className="text-sm text-gray-500">
              Create a shoppable link page for your Pinterest bio
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="btn-secondary text-sm"
            >
              Settings
            </button>
            <button
              onClick={() => setPreviewMode(true)}
              className="btn-secondary text-sm"
            >
              Preview
            </button>
            <button
              onClick={downloadPage}
              className="btn-primary text-sm"
              disabled={products.length === 0}
            >
              Download Page
            </button>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="p-4 bg-gray-50 rounded-lg mb-4 space-y-4">
            <h3 className="font-medium text-gray-700">Customize Your Page</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Page Title</label>
                <input
                  type="text"
                  value={settings.title}
                  onChange={(e) => updateSettings({ title: e.target.value })}
                  className="input-field text-sm"
                  placeholder="Shop My Looks"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Bio Text</label>
                <input
                  type="text"
                  value={settings.bio}
                  onChange={(e) => updateSettings({ bio: e.target.value })}
                  className="input-field text-sm"
                  placeholder="Tap any product to shop!"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Background Color</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    value={settings.backgroundColor}
                    onChange={(e) => updateSettings({ backgroundColor: e.target.value })}
                    className="w-10 h-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.backgroundColor}
                    onChange={(e) => updateSettings({ backgroundColor: e.target.value })}
                    className="input-field text-sm flex-1"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Accent Color</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    value={settings.accentColor}
                    onChange={(e) => updateSettings({ accentColor: e.target.value })}
                    className="w-10 h-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.accentColor}
                    onChange={(e) => updateSettings({ accentColor: e.target.value })}
                    className="input-field text-sm flex-1"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span>{products.length} products</span>
          {products.length > 0 && (
            <button
              onClick={() => {
                if (confirm('Remove all products?')) clearAll();
              }}
              className="text-red-500 hover:text-red-600"
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Add Product */}
      <div className="card p-6">
        {!showAddForm ? (
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full p-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-primary-400 hover:text-primary-600 transition-all"
          >
            + Add Product
          </button>
        ) : (
          <form onSubmit={handleAddProduct} className="space-y-4">
            <h3 className="font-medium text-gray-700">Add New Product</h3>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Amazon Link *</label>
              <input
                type="url"
                value={newProduct.url}
                onChange={(e) => setNewProduct(prev => ({ ...prev, url: e.target.value }))}
                className="input-field"
                placeholder="https://amazon.com/..."
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Image URL *</label>
              <input
                type="url"
                value={newProduct.image}
                onChange={handleImageUrlPaste}
                className="input-field"
                placeholder="https://..."
                required
              />
              {newProduct.image && (
                <img
                  src={newProduct.image}
                  alt="Preview"
                  className="mt-2 w-20 h-20 object-cover rounded-lg"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Title</label>
                <input
                  type="text"
                  value={newProduct.title}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, title: e.target.value }))}
                  className="input-field"
                  placeholder="Product name"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Price</label>
                <input
                  type="text"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, price: e.target.value }))}
                  className="input-field"
                  placeholder="$29.99"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button type="submit" className="btn-primary flex-1">
                Add Product
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setNewProduct({ title: '', image: '', url: '', price: '' });
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Product List */}
      {products.length > 0 && (
        <div className="card p-6">
          <h3 className="font-medium text-gray-700 mb-4">Your Products</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="relative group bg-gray-50 rounded-xl overflow-hidden"
              >
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full aspect-square object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/200?text=No+Image';
                  }}
                />
                <div className="p-3">
                  <p className="text-sm font-medium text-gray-800 line-clamp-2">
                    {product.title || 'Product'}
                  </p>
                  {product.price && (
                    <p className="text-sm text-primary-600 font-semibold mt-1">
                      {product.price}
                    </p>
                  )}
                </div>

                {/* Delete Button */}
                <button
                  onClick={() => removeProduct(product.id)}
                  className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                >
                  ×
                </button>

                {/* Link indicator */}
                <a
                  href={product.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-2 right-2 w-8 h-8 bg-white shadow rounded-full flex items-center justify-center text-sm hover:bg-gray-100"
                >
                  ↗
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {products.length === 0 && !showAddForm && (
        <div className="card p-12 text-center">
          <div className="text-6xl mb-4">🛍️</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No Products Yet
          </h3>
          <p className="text-gray-500 mb-6">
            Add products from your outfits to create a shoppable link page
          </p>
          <button
            onClick={() => setShowAddForm(true)}
            className="btn-primary"
          >
            Add Your First Product
          </button>
        </div>
      )}

      {/* Tips */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-blue-700 mb-2">Tips</h4>
        <ul className="text-sm text-blue-600 space-y-1">
          <li>• Products from outfits are automatically added when you click "Add to Links"</li>
          <li>• Download the page and host it anywhere (GitHub Pages, Netlify, etc.)</li>
          <li>• Share the link in your Pinterest bio or pin descriptions</li>
        </ul>
      </div>
    </div>
  );
}
