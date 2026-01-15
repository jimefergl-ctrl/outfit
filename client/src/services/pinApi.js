const API_BASE = '/api';

export async function getAestheticSuggestions() {
  const response = await fetch(`${API_BASE}/pins/aesthetics`);
  if (!response.ok) throw new Error('Failed to get aesthetic suggestions');

  const data = await response.json();
  return data.suggestions;
}

export async function generateAestheticImage(aesthetic) {
  const response = await fetch(`${API_BASE}/pins/generate-aesthetic`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ aesthetic })
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || 'Failed to generate aesthetic image');
  }

  return response.json();
}

export async function generateTextIdeas(aesthetic, context = '') {
  const response = await fetch(`${API_BASE}/pins/generate-text-ideas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ aesthetic, context })
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || 'Failed to generate text ideas');
  }

  return response.json();
}

export async function removeBackground(imageBase64) {
  const response = await fetch(`${API_BASE}/pins/remove-background`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageBase64 })
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || 'Failed to remove background');
  }

  return response.json();
}
