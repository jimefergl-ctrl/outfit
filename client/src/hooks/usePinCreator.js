import { useState, useCallback } from 'react';

const STEPS = ['aesthetic', 'images', 'text', 'editor'];

export function usePinCreator() {
  const [currentStep, setCurrentStep] = useState(0);
  const [aesthetic, setAesthetic] = useState('');
  const [aestheticImage, setAestheticImage] = useState(null);
  const [inspirationImage, setInspirationImage] = useState(null);
  const [userImages, setUserImages] = useState([]);
  const [wantsText, setWantsText] = useState(null);
  const [textIdeas, setTextIdeas] = useState([]);
  const [selectedText, setSelectedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const nextStep = useCallback(() => {
    setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
  }, []);

  const prevStep = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  }, []);

  const goToStep = useCallback((step) => {
    const index = typeof step === 'number' ? step : STEPS.indexOf(step);
    if (index >= 0 && index < STEPS.length) {
      setCurrentStep(index);
    }
  }, []);

  // No longer calls API - just stores the aesthetic background data
  const generateAestheticBackground = useCallback((backgroundData) => {
    setAestheticImage(backgroundData);
    return backgroundData;
  }, []);

  // Add or update image - handles both initial add and background removal update
  const addUserImage = useCallback((imageBase64, imageId, backgroundRemoved = false) => {
    setUserImages(prev => {
      const existing = prev.find(img => img.id === imageId);
      if (existing) {
        // Update existing image with background removed version
        return prev.map(img =>
          img.id === imageId
            ? { ...img, processed: imageBase64, backgroundRemoved }
            : img
        );
      } else {
        // Add new image
        return [...prev, {
          id: imageId,
          original: imageBase64,
          processed: imageBase64,
          backgroundRemoved
        }];
      }
    });
    return imageBase64;
  }, []);

  const removeUserImage = useCallback((imageId) => {
    setUserImages(prev => prev.filter(img => img.id !== imageId));
  }, []);

  // No longer needs to call API - text suggestions are local
  const generateTextSuggestions = useCallback(() => {
    // This is now handled locally in TextStep
    return [];
  }, []);

  const reset = useCallback(() => {
    setCurrentStep(0);
    setAesthetic('');
    setAestheticImage(null);
    setInspirationImage(null);
    setUserImages([]);
    setWantsText(null);
    setTextIdeas([]);
    setSelectedText('');
    setLoading(false);
    setError(null);
  }, []);

  return {
    // State
    currentStep,
    stepName: STEPS[currentStep],
    totalSteps: STEPS.length,
    aesthetic,
    aestheticImage,
    inspirationImage,
    userImages,
    wantsText,
    textIdeas,
    selectedText,
    loading,
    error,

    // Actions
    nextStep,
    prevStep,
    goToStep,
    setAesthetic,
    generateAestheticBackground,
    setInspirationImage,
    addUserImage,
    removeUserImage,
    setWantsText,
    generateTextSuggestions,
    setSelectedText,
    reset,
    setError
  };
}
