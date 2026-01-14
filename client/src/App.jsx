import { useState } from 'react';
import SearchBar from './components/SearchBar';
import ProductGrid from './components/ProductGrid';
import OutfitStylist from './components/OutfitStylist';
import Avatar3D from './components/Avatar3D';
import AvatarCustomizer from './components/AvatarCustomizer';
import Wardrobe from './components/Wardrobe';
import { useProducts, useOutfitStyling } from './hooks/useProducts';
import { useWardrobe } from './hooks/useWardrobe';
import { useAvatar } from './hooks/useAvatar';

function App() {
  const [activeTab, setActiveTab] = useState('search');
  const [selectedProduct, setSelectedProduct] = useState(null);

  const { products, loading, error, searchProducts, clearProducts } = useProducts();
  const { outfit, loading: outfitLoading, generateOutfit, clearOutfit } = useOutfitStyling();
  const { outfits, saveOutfit, removeOutfit } = useWardrobe();
  const {
    avatar,
    clothing,
    updateAvatar,
    addClothing,
    removeClothing,
    clearAllClothing,
    getCurrentOutfit
  } = useAvatar();

  const handleSearch = async (query) => {
    clearOutfit();
    setSelectedProduct(null);
    await searchProducts(query);
  };

  const handleProductSelect = async (product) => {
    setSelectedProduct(product);
    await generateOutfit(product);
  };

  const handleAddToAvatar = (product) => {
    addClothing(product.category, product);
  };

  const handleSaveOutfit = () => {
    const currentOutfit = getCurrentOutfit();
    if (Object.keys(currentOutfit).length > 0) {
      saveOutfit({
        name: `Outfit ${outfits.length + 1}`,
        items: currentOutfit,
        avatar: avatar
      });
    }
  };

  const handleLoadOutfit = (savedOutfit) => {
    clearAllClothing();
    Object.entries(savedOutfit.items).forEach(([category, item]) => {
      addClothing(category, item);
    });
  };

  const tabs = [
    { id: 'search', label: 'Search', icon: '🔍' },
    { id: 'avatar', label: 'Avatar', icon: '👤' },
    { id: 'wardrobe', label: 'Wardrobe', icon: '👗' }
  ];

  return (
    <div className="min-h-screen">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gradient">Outfit Finder</h1>
            <nav className="flex gap-2">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'search' && (
          <div className="space-y-8">
            <SearchBar onSearch={handleSearch} loading={loading} />

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-lg">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <ProductGrid
                  products={products}
                  loading={loading}
                  onProductSelect={handleProductSelect}
                  onAddToAvatar={handleAddToAvatar}
                  selectedProduct={selectedProduct}
                />
              </div>

              <div className="lg:col-span-1">
                {selectedProduct && (
                  <OutfitStylist
                    outfit={outfit}
                    loading={outfitLoading}
                    baseItem={selectedProduct}
                    onAddToAvatar={handleAddToAvatar}
                  />
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'avatar' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="card p-6">
              <h2 className="text-xl font-semibold mb-4">Your Avatar</h2>
              <Avatar3D
                avatar={avatar}
                clothing={clothing}
                onRemoveClothing={removeClothing}
              />
              <div className="mt-4 flex gap-2">
                <button
                  onClick={handleSaveOutfit}
                  className="btn-primary flex-1"
                  disabled={Object.values(clothing).every(v => v === null)}
                >
                  Save Outfit
                </button>
                <button
                  onClick={clearAllClothing}
                  className="btn-secondary"
                >
                  Clear
                </button>
              </div>
            </div>

            <div className="card p-6">
              <h2 className="text-xl font-semibold mb-4">Customize Avatar</h2>
              <AvatarCustomizer avatar={avatar} onUpdate={updateAvatar} />
            </div>
          </div>
        )}

        {activeTab === 'wardrobe' && (
          <Wardrobe
            outfits={outfits}
            onRemove={removeOutfit}
            onLoad={handleLoadOutfit}
          />
        )}
      </main>
    </div>
  );
}

export default App;
