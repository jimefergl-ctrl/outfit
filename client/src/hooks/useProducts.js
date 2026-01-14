import { useState, useCallback } from 'react';
import { searchProducts as searchProductsApi, getOutfitSuggestions } from '../services/api';

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchProducts = useCallback(async (query, category = null) => {
    setLoading(true);
    setError(null);

    try {
      const results = await searchProductsApi(query, category);
      setProducts(results);
      return results;
    } catch (err) {
      setError(err.message);
      setProducts([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const clearProducts = useCallback(() => {
    setProducts([]);
    setError(null);
  }, []);

  return {
    products,
    loading,
    error,
    searchProducts,
    clearProducts
  };
}

export function useOutfitStyling() {
  const [outfit, setOutfit] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateOutfit = useCallback(async (item) => {
    setLoading(true);
    setError(null);

    try {
      const result = await getOutfitSuggestions(item);
      setOutfit(result);
      return result;
    } catch (err) {
      setError(err.message);
      setOutfit(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearOutfit = useCallback(() => {
    setOutfit(null);
    setError(null);
  }, []);

  return {
    outfit,
    loading,
    error,
    generateOutfit,
    clearOutfit
  };
}
