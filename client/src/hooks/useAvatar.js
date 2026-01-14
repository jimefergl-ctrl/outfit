import { useState, useCallback } from 'react';

const DEFAULT_AVATAR = {
  bodyType: 'average',
  skinTone: '#e0b8a0',
  height: 'medium',
  hairColor: '#2c1810',
  hairStyle: 'long'
};

export function useAvatar() {
  const [avatar, setAvatar] = useState(DEFAULT_AVATAR);
  const [clothing, setClothing] = useState({
    top: null,
    bottom: null,
    dress: null,
    shoes: null,
    bag: null,
    jewelry: null
  });

  const updateAvatar = useCallback((updates) => {
    setAvatar(prev => ({ ...prev, ...updates }));
  }, []);

  const resetAvatar = useCallback(() => {
    setAvatar(DEFAULT_AVATAR);
  }, []);

  const addClothing = useCallback((category, item) => {
    setClothing(prev => {
      if (category === 'dress') {
        return { ...prev, dress: item, top: null, bottom: null };
      }
      if (category === 'top' || category === 'bottom') {
        return { ...prev, [category]: item, dress: null };
      }
      return { ...prev, [category]: item };
    });
  }, []);

  const removeClothing = useCallback((category) => {
    setClothing(prev => ({ ...prev, [category]: null }));
  }, []);

  const clearAllClothing = useCallback(() => {
    setClothing({
      top: null,
      bottom: null,
      dress: null,
      shoes: null,
      bag: null,
      jewelry: null
    });
  }, []);

  const getCurrentOutfit = useCallback(() => {
    return Object.entries(clothing)
      .filter(([_, item]) => item !== null)
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
  }, [clothing]);

  return {
    avatar,
    clothing,
    updateAvatar,
    resetAvatar,
    addClothing,
    removeClothing,
    clearAllClothing,
    getCurrentOutfit
  };
}
