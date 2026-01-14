import { Router } from 'express';
import { generateOutfitSuggestions, analyzeItem } from '../services/stylist.js';

const router = Router();

router.post('/complete-outfit', async (req, res) => {
  try {
    const { item } = req.body;

    if (!item) {
      return res.status(400).json({ error: 'Item is required' });
    }

    const analyzedItem = analyzeItem(item);
    const outfit = await generateOutfitSuggestions(analyzedItem);

    res.json(outfit);
  } catch (error) {
    console.error('Outfit generation error:', error);
    res.status(500).json({ error: 'Failed to generate outfit suggestions' });
  }
});

router.post('/analyze', (req, res) => {
  try {
    const { item } = req.body;

    if (!item) {
      return res.status(400).json({ error: 'Item is required' });
    }

    const analysis = analyzeItem(item);
    res.json(analysis);
  } catch (error) {
    console.error('Item analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze item' });
  }
});

export default router;
