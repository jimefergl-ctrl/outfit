import express from 'express';
import { generateAestheticImage, generateTextIdeas, getAestheticSuggestions } from '../services/openai.js';
import { removeBackground } from '../services/backgroundRemoval.js';

const router = express.Router();

// Get aesthetic suggestions
router.get('/aesthetics', (req, res) => {
  const suggestions = getAestheticSuggestions();
  res.json({ suggestions });
});

// Generate aesthetic background image
router.post('/generate-aesthetic', async (req, res) => {
  const { aesthetic } = req.body;

  if (!aesthetic) {
    return res.status(400).json({ error: 'Aesthetic description is required' });
  }

  try {
    const result = await generateAestheticImage(aesthetic);
    res.json(result);
  } catch (error) {
    console.error('Generate aesthetic error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate aesthetic image' });
  }
});

// Generate text ideas
router.post('/generate-text-ideas', async (req, res) => {
  const { aesthetic, context } = req.body;

  if (!aesthetic) {
    return res.status(400).json({ error: 'Aesthetic is required' });
  }

  try {
    const result = await generateTextIdeas(aesthetic, context);
    res.json(result);
  } catch (error) {
    console.error('Generate text ideas error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate text ideas' });
  }
});

// Remove background from image
router.post('/remove-background', async (req, res) => {
  const { imageBase64 } = req.body;

  if (!imageBase64) {
    return res.status(400).json({ error: 'Image data is required' });
  }

  try {
    const result = await removeBackground(imageBase64);
    res.json(result);
  } catch (error) {
    console.error('Remove background error:', error);
    res.status(500).json({ error: error.message || 'Failed to remove background' });
  }
});

export default router;
