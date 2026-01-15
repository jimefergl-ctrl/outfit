import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'outfit-linktree-products';

export function useLinktree() {
  const [products, setProducts] = useState([]);
  const [linktreeSettings, setLinktreeSettings] = useState({
    title: 'Shop My Looks',
    bio: 'Tap any product to shop on Amazon!',
    backgroundColor: '#ffffff',
    accentColor: '#c026d3'
  });

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        setProducts(data.products || []);
        if (data.settings) {
          setLinktreeSettings(data.settings);
        }
      }
    } catch (err) {
      console.error('Failed to load linktree data:', err);
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        products,
        settings: linktreeSettings
      }));
    } catch (err) {
      console.error('Failed to save linktree data:', err);
    }
  }, [products, linktreeSettings]);

  const addProduct = useCallback((product) => {
    const newProduct = {
      id: Date.now(),
      title: product.title || 'Product',
      image: product.image,
      url: product.url,
      price: product.price || '',
      addedAt: new Date().toISOString()
    };
    setProducts(prev => [newProduct, ...prev]);
    return newProduct;
  }, []);

  const removeProduct = useCallback((productId) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  }, []);

  const updateProduct = useCallback((productId, updates) => {
    setProducts(prev => prev.map(p =>
      p.id === productId ? { ...p, ...updates } : p
    ));
  }, []);

  const reorderProducts = useCallback((fromIndex, toIndex) => {
    setProducts(prev => {
      const result = [...prev];
      const [removed] = result.splice(fromIndex, 1);
      result.splice(toIndex, 0, removed);
      return result;
    });
  }, []);

  const updateSettings = useCallback((updates) => {
    setLinktreeSettings(prev => ({ ...prev, ...updates }));
  }, []);

  const clearAll = useCallback(() => {
    setProducts([]);
  }, []);

  // Generate shareable HTML page
  const generateShareablePage = useCallback(() => {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${linktreeSettings.title}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: ${linktreeSettings.backgroundColor};
      min-height: 100vh;
      padding: 20px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
    }
    .header {
      text-align: center;
      padding: 30px 20px;
    }
    .header h1 {
      font-size: 28px;
      color: ${linktreeSettings.accentColor};
      margin-bottom: 10px;
    }
    .header p {
      color: #666;
      font-size: 16px;
    }
    .products {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
      padding: 20px 0;
    }
    .product {
      background: white;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      transition: transform 0.2s, box-shadow 0.2s;
      text-decoration: none;
      color: inherit;
    }
    .product:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0,0,0,0.15);
    }
    .product img {
      width: 100%;
      aspect-ratio: 1;
      object-fit: cover;
    }
    .product-info {
      padding: 12px;
    }
    .product-title {
      font-size: 14px;
      font-weight: 500;
      color: #333;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .product-price {
      color: ${linktreeSettings.accentColor};
      font-weight: 600;
      margin-top: 4px;
    }
    .footer {
      text-align: center;
      padding: 30px;
      color: #999;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${linktreeSettings.title}</h1>
      <p>${linktreeSettings.bio}</p>
    </div>
    <div class="products">
      ${products.map(p => `
        <a href="${p.url}" target="_blank" rel="noopener" class="product">
          <img src="${p.image}" alt="${p.title}" onerror="this.src='https://via.placeholder.com/300?text=Image'">
          <div class="product-info">
            <div class="product-title">${p.title}</div>
            ${p.price ? `<div class="product-price">${p.price}</div>` : ''}
          </div>
        </a>
      `).join('')}
    </div>
    <div class="footer">
      Powered by Outfit Finder
    </div>
  </div>
</body>
</html>`;
    return html;
  }, [products, linktreeSettings]);

  // Download as HTML file
  const downloadPage = useCallback(() => {
    const html = generateShareablePage();
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'my-shop-links.html';
    link.click();
    URL.revokeObjectURL(url);
  }, [generateShareablePage]);

  return {
    products,
    settings: linktreeSettings,
    addProduct,
    removeProduct,
    updateProduct,
    reorderProducts,
    updateSettings,
    clearAll,
    generateShareablePage,
    downloadPage
  };
}
