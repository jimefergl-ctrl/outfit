import OpenAI from 'openai';

let openai = null;

function getOpenAI() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY not configured. Please add it to your .env file.');
  }
  if (!openai) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }
  return openai;
}

const AESTHETIC_PROMPTS = {
  minimalist: 'clean, simple, white space, muted colors, elegant simplicity',
  cottagecore: 'pastoral, floral, soft colors, vintage countryside, cozy warmth',
  'dark academia': 'moody, scholarly, rich browns and deep greens, vintage books, classical art',
  bohemian: 'eclectic, colorful patterns, natural textures, free-spirited, warm earth tones',
  vintage: 'retro, nostalgic, aged textures, sepia tones, classic elegance',
  modern: 'sleek, contemporary, bold geometry, clean lines, sophisticated',
  romantic: 'soft pinks, florals, dreamy, delicate, whimsical',
  grunge: 'edgy, distressed textures, dark colors, urban, raw',
  coastal: 'beach vibes, blues and whites, sandy textures, nautical, serene',
  ethereal: 'dreamy, soft light, pastels, magical, otherworldly glow'
};

export async function generateAestheticImage(aesthetic) {
  const aestheticLower = aesthetic.toLowerCase();
  const styleHints = AESTHETIC_PROMPTS[aestheticLower] || aesthetic;

  const prompt = `Create a beautiful Pinterest-worthy aesthetic background image. Style: ${styleHints}. The image should be visually stunning, suitable as a background for a collage or mood board. No text, no people, just decorative aesthetic elements and textures. Vertical orientation suitable for Pinterest (2:3 aspect ratio).`;

  try {
    const response = await getOpenAI().images.generate({
      model: 'dall-e-3',
      prompt: prompt,
      n: 1,
      size: '1024x1792',
      quality: 'standard'
    });

    return {
      imageUrl: response.data[0].url,
      revisedPrompt: response.data[0].revised_prompt
    };
  } catch (error) {
    console.error('DALL-E generation error:', error);
    throw new Error('Failed to generate aesthetic image');
  }
}

export async function generateTextIdeas(aesthetic, context = '') {
  const prompt = `Generate 6 short, creative text ideas for a Pinterest pin with a "${aesthetic}" aesthetic. ${context ? `Context: ${context}` : ''}

The text should be:
- Short and punchy (1-5 words each)
- Aesthetic and on-brand for the style
- Could be quotes, single words, or short phrases
- Instagram/Pinterest caption worthy

Return only the 6 text options, one per line, no numbering or bullets.`;

  try {
    const response = await getOpenAI().chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a creative social media content expert specializing in Pinterest aesthetics.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 200,
      temperature: 0.8
    });

    const ideas = response.choices[0].message.content
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .slice(0, 6);

    return { ideas };
  } catch (error) {
    console.error('GPT text generation error:', error);
    throw new Error('Failed to generate text ideas');
  }
}

export function getAestheticSuggestions() {
  return Object.keys(AESTHETIC_PROMPTS);
}
