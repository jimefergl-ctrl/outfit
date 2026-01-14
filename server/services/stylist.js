import { searchProducts } from './amazonApi.js';

const COLOR_WHEEL = {
  red: { complementary: ['green', 'teal'], analogous: ['orange', 'pink', 'burgundy'], neutral: ['black', 'white', 'grey'] },
  blue: { complementary: ['orange', 'coral'], analogous: ['purple', 'teal', 'navy'], neutral: ['black', 'white', 'grey'] },
  green: { complementary: ['red', 'pink'], analogous: ['teal', 'yellow'], neutral: ['black', 'white', 'beige'] },
  yellow: { complementary: ['purple'], analogous: ['orange', 'green'], neutral: ['black', 'white', 'navy'] },
  purple: { complementary: ['yellow', 'gold'], analogous: ['pink', 'blue'], neutral: ['black', 'white', 'grey'] },
  orange: { complementary: ['blue', 'navy'], analogous: ['red', 'yellow'], neutral: ['black', 'white', 'brown'] },
  pink: { complementary: ['green'], analogous: ['purple', 'red', 'coral'], neutral: ['black', 'white', 'grey'] },
  black: { complementary: ['white', 'gold', 'silver'], analogous: ['grey', 'navy'], neutral: ['white', 'beige', 'red'] },
  white: { complementary: ['black'], analogous: ['cream', 'ivory', 'beige'], neutral: ['black', 'navy', 'grey'] },
  brown: { complementary: ['blue', 'teal'], analogous: ['tan', 'beige', 'orange'], neutral: ['white', 'cream', 'gold'] },
  beige: { complementary: ['navy', 'brown'], analogous: ['cream', 'tan', 'ivory'], neutral: ['white', 'black', 'brown'] },
  navy: { complementary: ['coral', 'orange'], analogous: ['blue', 'grey'], neutral: ['white', 'beige', 'gold'] },
  grey: { complementary: ['yellow', 'pink'], analogous: ['black', 'white', 'navy'], neutral: ['black', 'white', 'red'] }
};

const OUTFIT_STRUCTURE = {
  shoes: ['dress', 'bottom', 'top', 'bag', 'jewelry'],
  dress: ['shoes', 'bag', 'jewelry', 'accessories'],
  top: ['bottom', 'shoes', 'bag', 'jewelry'],
  bottom: ['top', 'shoes', 'bag', 'jewelry'],
  bag: ['dress', 'shoes', 'top', 'jewelry'],
  jewelry: ['dress', 'top', 'bag', 'shoes']
};

const STYLE_COMPATIBILITY = {
  casual: ['casual', 'sporty', 'bohemian'],
  formal: ['formal', 'classic', 'modern'],
  sporty: ['sporty', 'casual'],
  bohemian: ['bohemian', 'casual', 'vintage'],
  classic: ['classic', 'formal', 'modern'],
  modern: ['modern', 'classic', 'formal'],
  vintage: ['vintage', 'bohemian', 'classic']
};

export async function generateOutfitSuggestions(baseItem) {
  const { category, color, style } = baseItem;

  const categoriesToFind = OUTFIT_STRUCTURE[category] || ['dress', 'shoes', 'bag', 'jewelry'];
  const matchingColors = getMatchingColors(color);
  const matchingStyles = STYLE_COMPATIBILITY[style] || ['casual'];

  const suggestions = {};

  for (const targetCategory of categoriesToFind.slice(0, 4)) {
    const searchTerms = buildSearchTerms(targetCategory, matchingColors, matchingStyles, style);

    try {
      const products = await searchProducts(searchTerms);
      const filtered = products.filter(p =>
        p.category === targetCategory || isCategoryMatch(p, targetCategory)
      ).slice(0, 3);

      if (filtered.length > 0) {
        suggestions[targetCategory] = filtered;
      } else if (products.length > 0) {
        suggestions[targetCategory] = products.slice(0, 3);
      }
    } catch (error) {
      console.error(`Failed to find ${targetCategory}:`, error);
    }
  }

  return {
    baseItem,
    suggestions,
    colorPalette: matchingColors,
    styleGuide: matchingStyles
  };
}

function getMatchingColors(baseColor) {
  if (!baseColor) {
    return ['black', 'white', 'beige'];
  }

  const colorData = COLOR_WHEEL[baseColor.toLowerCase()];
  if (!colorData) {
    return [baseColor, 'black', 'white'];
  }

  return [
    baseColor,
    ...colorData.complementary.slice(0, 1),
    ...colorData.analogous.slice(0, 1),
    ...colorData.neutral.slice(0, 2)
  ];
}

function buildSearchTerms(category, colors, styles, baseStyle) {
  const categoryKeywords = {
    dress: 'women dress',
    top: 'women blouse top',
    bottom: 'women pants skirt',
    shoes: 'women shoes heels',
    bag: 'women handbag purse',
    jewelry: 'women jewelry necklace',
    accessories: 'women accessories scarf'
  };

  const baseKeyword = categoryKeywords[category] || `women ${category}`;
  const colorTerm = colors[Math.floor(Math.random() * Math.min(colors.length, 3))] || '';
  const styleTerm = baseStyle || styles[0] || '';

  return `${colorTerm} ${styleTerm} ${baseKeyword}`.trim();
}

function isCategoryMatch(product, targetCategory) {
  const categoryKeywords = {
    dress: ['dress', 'gown', 'maxi', 'mini'],
    top: ['blouse', 'shirt', 'top', 'sweater', 'cardigan'],
    bottom: ['pants', 'jeans', 'skirt', 'shorts', 'trousers'],
    shoes: ['shoes', 'heels', 'boots', 'sneakers', 'sandals', 'pumps'],
    bag: ['bag', 'purse', 'handbag', 'clutch', 'tote'],
    jewelry: ['necklace', 'earrings', 'bracelet', 'ring', 'jewelry'],
    accessories: ['scarf', 'belt', 'hat', 'sunglasses']
  };

  const keywords = categoryKeywords[targetCategory] || [targetCategory];
  const title = (product.title || '').toLowerCase();

  return keywords.some(keyword => title.includes(keyword));
}

export function analyzeItem(product) {
  return {
    asin: product.asin,
    title: product.title,
    category: product.category,
    color: product.color,
    style: product.style,
    price: product.price,
    image: product.image,
    url: product.url
  };
}
