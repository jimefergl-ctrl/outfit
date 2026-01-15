// Extract dominant colors from an image
export function extractColorsFromImage(imageUrl) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // Scale down for faster processing
      const maxSize = 100;
      const scale = Math.min(maxSize / img.width, maxSize / img.height);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;

      // Color frequency map
      const colorMap = {};

      for (let i = 0; i < pixels.length; i += 4) {
        const r = Math.round(pixels[i] / 32) * 32;
        const g = Math.round(pixels[i + 1] / 32) * 32;
        const b = Math.round(pixels[i + 2] / 32) * 32;

        const hex = rgbToHex(r, g, b);
        colorMap[hex] = (colorMap[hex] || 0) + 1;
      }

      // Sort by frequency and get top colors
      const sortedColors = Object.entries(colorMap)
        .sort((a, b) => b[1] - a[1])
        .map(([color]) => color)
        .slice(0, 8);

      // Filter out very similar colors
      const distinctColors = filterSimilarColors(sortedColors);

      resolve(distinctColors);
    };

    img.onerror = () => {
      resolve(['#ffffff', '#f5f5f5', '#e0e0e0', '#000000']);
    };

    img.src = imageUrl;
  });
}

function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(x => {
    const hex = Math.min(255, Math.max(0, x)).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function colorDistance(c1, c2) {
  const rgb1 = hexToRgb(c1);
  const rgb2 = hexToRgb(c2);
  if (!rgb1 || !rgb2) return 0;

  return Math.sqrt(
    Math.pow(rgb1.r - rgb2.r, 2) +
    Math.pow(rgb1.g - rgb2.g, 2) +
    Math.pow(rgb1.b - rgb2.b, 2)
  );
}

function filterSimilarColors(colors, threshold = 50) {
  const distinct = [];

  for (const color of colors) {
    const isSimilar = distinct.some(c => colorDistance(c, color) < threshold);
    if (!isSimilar) {
      distinct.push(color);
    }
    if (distinct.length >= 6) break;
  }

  return distinct;
}

// Suggest a layout based on inspiration image analysis
export function analyzeImageLayout(imageUrl) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';

    img.onload = () => {
      const aspectRatio = img.width / img.height;

      // Determine layout suggestion based on aspect ratio
      let layout = 'centered';
      if (aspectRatio > 1.2) {
        layout = 'horizontal';
      } else if (aspectRatio < 0.8) {
        layout = 'vertical';
      }

      resolve({
        aspectRatio,
        layout,
        isPortrait: aspectRatio < 1,
        isLandscape: aspectRatio > 1,
        isSquare: aspectRatio >= 0.9 && aspectRatio <= 1.1
      });
    };

    img.onerror = () => {
      resolve({ layout: 'centered', aspectRatio: 1 });
    };

    img.src = imageUrl;
  });
}
