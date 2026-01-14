import { Router } from 'express';
import { searchProducts, getProductDetails } from '../services/amazonApi.js';

const router = Router();

router.get('/search', async (req, res) => {
  try {
    const { q, category } = req.query;

    if (!q) {
      return res.status(400).json({ error: 'Query parameter "q" is required' });
    }

    const searchQuery = parseStyleQuery(q);
    const products = await searchProducts(searchQuery, category);

    res.json({ products, originalQuery: q, searchQuery });
  } catch (error) {
    console.error('Product search error:', error);
    res.status(500).json({ error: 'Failed to search products' });
  }
});

router.get('/:asin', async (req, res) => {
  try {
    const { asin } = req.params;
    const product = await getProductDetails(asin);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ product });
  } catch (error) {
    console.error('Product details error:', error);
    res.status(500).json({ error: 'Failed to get product details' });
  }
});

function parseStyleQuery(query) {
  const lowerQuery = query.toLowerCase();

  const brandPatterns = [
    { pattern: /inspired (?:by|in) (chanel|gucci|prada|louis vuitton|hermes|dior|versace|balenciaga)/i, replacement: '$1 style' },
    { pattern: /like (chanel|gucci|prada|louis vuitton|hermes|dior|versace|balenciaga)/i, replacement: '$1 style' },
    { pattern: /(chanel|gucci|prada|louis vuitton|hermes|dior|versace|balenciaga) style/i, replacement: '$1 style designer look' }
  ];

  let processedQuery = query;
  for (const { pattern, replacement } of brandPatterns) {
    if (pattern.test(processedQuery)) {
      processedQuery = processedQuery.replace(pattern, replacement);
      break;
    }
  }

  const styleEnhancements = {
    'elegant': 'elegant sophisticated classy',
    'casual': 'casual everyday comfortable',
    'formal': 'formal evening dress elegant',
    'sporty': 'athletic sport activewear',
    'boho': 'bohemian boho hippie festival',
    'vintage': 'vintage retro classic'
  };

  for (const [style, enhancement] of Object.entries(styleEnhancements)) {
    if (lowerQuery.includes(style)) {
      processedQuery = processedQuery.replace(new RegExp(style, 'i'), enhancement);
      break;
    }
  }

  return processedQuery;
}

export default router;
