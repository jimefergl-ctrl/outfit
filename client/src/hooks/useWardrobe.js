import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'outfit-finder-wardrobe';

export function useWardrobe() {
  const [outfits, setOutfits] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setOutfits(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load wardrobe:', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(outfits));
  }, [outfits]);

  const saveOutfit = useCallback((outfit) => {
    const newOutfit = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      ...outfit
    };
    setOutfits(prev => [newOutfit, ...prev]);
    return newOutfit;
  }, []);

  const removeOutfit = useCallback((outfitId) => {
    setOutfits(prev => prev.filter(o => o.id !== outfitId));
  }, []);

  const updateOutfit = useCallback((outfitId, updates) => {
    setOutfits(prev =>
      prev.map(o => o.id === outfitId ? { ...o, ...updates } : o)
    );
  }, []);

  const clearWardrobe = useCallback(() => {
    setOutfits([]);
  }, []);

  return {
    outfits,
    saveOutfit,
    removeOutfit,
    updateOutfit,
    clearWardrobe
  };
}
