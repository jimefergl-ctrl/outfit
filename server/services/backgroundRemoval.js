const REMOVEBG_API_KEY = process.env.REMOVEBG_API_KEY;

export async function removeBackground(imageBase64) {
  if (!REMOVEBG_API_KEY) {
    throw new Error('REMOVEBG_API_KEY not configured');
  }

  // Remove data URL prefix if present
  const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');

  try {
    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': REMOVEBG_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        image_file_b64: base64Data,
        size: 'auto',
        format: 'png',
        type: 'auto'
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('remove.bg error:', errorData);
      throw new Error(errorData.errors?.[0]?.title || 'Background removal failed');
    }

    const resultBuffer = await response.arrayBuffer();
    const resultBase64 = Buffer.from(resultBuffer).toString('base64');

    return {
      imageBase64: `data:image/png;base64,${resultBase64}`
    };
  } catch (error) {
    console.error('Background removal error:', error);
    throw error;
  }
}

export async function removeBackgroundFromUrl(imageUrl) {
  if (!REMOVEBG_API_KEY) {
    throw new Error('REMOVEBG_API_KEY not configured');
  }

  try {
    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': REMOVEBG_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        image_url: imageUrl,
        size: 'auto',
        format: 'png',
        type: 'auto'
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('remove.bg error:', errorData);
      throw new Error(errorData.errors?.[0]?.title || 'Background removal failed');
    }

    const resultBuffer = await response.arrayBuffer();
    const resultBase64 = Buffer.from(resultBuffer).toString('base64');

    return {
      imageBase64: `data:image/png;base64,${resultBase64}`
    };
  } catch (error) {
    console.error('Background removal error:', error);
    throw error;
  }
}
