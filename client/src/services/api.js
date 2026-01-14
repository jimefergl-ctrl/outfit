const API_BASE = '/api';

export async function searchProducts(query, category = null) {
  const params = new URLSearchParams({ q: query });
  if (category) params.set('category', category);

  const response = await fetch(`${API_BASE}/products/search?${params}`);
  if (!response.ok) throw new Error('Failed to search products');

  const data = await response.json();
  return data.products;
}

export async function getProductDetails(asin) {
  const response = await fetch(`${API_BASE}/products/${asin}`);
  if (!response.ok) throw new Error('Failed to get product');

  const data = await response.json();
  return data.product;
}

export async function getOutfitSuggestions(item) {
  const response = await fetch(`${API_BASE}/styling/complete-outfit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ item })
  });

  if (!response.ok) throw new Error('Failed to get outfit suggestions');

  return response.json();
}

export async function analyzeItem(item) {
  const response = await fetch(`${API_BASE}/styling/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ item })
  });

  if (!response.ok) throw new Error('Failed to analyze item');

  return response.json();
}
