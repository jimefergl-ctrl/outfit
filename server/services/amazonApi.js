function getConfig() {
  return {
    apiKey: process.env.RAPIDAPI_KEY,
    host: process.env.RAPIDAPI_HOST || 'real-time-amazon-data.p.rapidapi.com',
    country: process.env.RAPID_AMAZON_COUNTRY || 'US'
  };
}

export async function searchProducts(query, category = null) {
  const { apiKey, host, country } = getConfig();
  const url = new URL(`https://${host}/search`);
  url.searchParams.set('query', query);
  url.searchParams.set('country', country);
  url.searchParams.set('sort_by', process.env.RAPID_AMAZON_SORT_BY || 'RELEVANCE');
  url.searchParams.set('product_condition', process.env.RAPID_AMAZON_PRODUCT_CONDITION || 'ALL');

  if (category) {
    url.searchParams.set('category_id', category);
  }

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'x-rapidapi-key': apiKey,
      'x-rapidapi-host': host
    }
  });

  if (!response.ok) {
    throw new Error(`Amazon API error: ${response.status}`);
  }

  const data = await response.json();
  return transformProducts(data.data?.products || []);
}

export async function getProductDetails(asin) {
  const { apiKey, host, country } = getConfig();
  const url = new URL(`https://${host}/product-details`);
  url.searchParams.set('asin', asin);
  url.searchParams.set('country', country);

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'x-rapidapi-key': apiKey,
      'x-rapidapi-host': host
    }
  });

  if (!response.ok) {
    throw new Error(`Amazon API error: ${response.status}`);
  }

  const data = await response.json();
  return transformProduct(data.data);
}

function transformProducts(products) {
  return products.map(transformProduct).filter(Boolean);
}

function transformProduct(product) {
  if (!product) return null;

  return {
    asin: product.asin,
    title: product.product_title || product.title,
    price: product.product_price || product.price,
    originalPrice: product.product_original_price,
    image: product.product_photo || product.product_main_image_url || product.thumbnail,
    images: product.product_photos || [product.product_photo],
    rating: product.product_star_rating,
    reviewCount: product.product_num_ratings,
    url: product.product_url || `https://www.amazon.com/dp/${product.asin}`,
    category: product.category || extractCategory(product.product_title || ''),
    color: extractColor(product.product_title || ''),
    style: extractStyle(product.product_title || '')
  };
}

function extractCategory(title) {
  const categories = {
    'dress': ['dress', 'gown', 'maxi', 'mini dress'],
    'top': ['blouse', 'shirt', 'top', 'tee', 't-shirt', 'sweater', 'cardigan'],
    'bottom': ['pants', 'jeans', 'skirt', 'shorts', 'trousers'],
    'shoes': ['shoes', 'heels', 'boots', 'sneakers', 'sandals', 'flats', 'pumps'],
    'bag': ['bag', 'purse', 'handbag', 'clutch', 'tote', 'backpack'],
    'jewelry': ['necklace', 'earrings', 'bracelet', 'ring', 'jewelry'],
    'accessories': ['scarf', 'belt', 'hat', 'sunglasses', 'watch']
  };

  const lowerTitle = title.toLowerCase();
  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some(keyword => lowerTitle.includes(keyword))) {
      return category;
    }
  }
  return 'clothing';
}

function extractColor(title) {
  const colors = [
    'black', 'white', 'red', 'blue', 'navy', 'green', 'yellow', 'orange',
    'purple', 'pink', 'brown', 'beige', 'grey', 'gray', 'gold', 'silver',
    'burgundy', 'teal', 'coral', 'cream', 'ivory', 'nude', 'tan'
  ];

  const lowerTitle = title.toLowerCase();
  for (const color of colors) {
    if (lowerTitle.includes(color)) {
      return color;
    }
  }
  return null;
}

function extractStyle(title) {
  const styles = {
    'casual': ['casual', 'everyday', 'relaxed', 'comfortable'],
    'formal': ['formal', 'elegant', 'evening', 'cocktail', 'gala'],
    'sporty': ['athletic', 'sport', 'workout', 'gym', 'running'],
    'bohemian': ['boho', 'bohemian', 'hippie', 'festival'],
    'classic': ['classic', 'timeless', 'traditional'],
    'modern': ['modern', 'contemporary', 'minimalist'],
    'vintage': ['vintage', 'retro', 'antique']
  };

  const lowerTitle = title.toLowerCase();
  for (const [style, keywords] of Object.entries(styles)) {
    if (keywords.some(keyword => lowerTitle.includes(keyword))) {
      return style;
    }
  }
  return 'casual';
}
