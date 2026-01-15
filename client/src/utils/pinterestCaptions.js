// Pinterest caption templates by aesthetic/category
const TITLE_TEMPLATES = {
  fashion: [
    "Style Inspo You NEED to See",
    "Outfit Ideas That Just Hit Different",
    "Your Next Favorite Look",
    "Fashion Finds You'll Love",
    "This Outfit is Everything",
    "Style Goals Achieved",
    "The Look Everyone's Talking About",
    "Must-Have Pieces for Your Wardrobe",
    "Trending Styles Right Now",
    "Effortlessly Chic Outfit Ideas"
  ],
  minimalist: [
    "Clean & Simple Style",
    "Less is More Fashion",
    "Minimalist Aesthetic",
    "Timeless Simplicity",
    "The Art of Simple Dressing"
  ],
  aesthetic: [
    "This Vibe Though",
    "Aesthetic Goals",
    "The Perfect Aesthetic",
    "Mood Board Inspiration",
    "Curated Aesthetic Finds"
  ]
};

const HASHTAG_SETS = {
  fashion: [
    '#fashion', '#style', '#ootd', '#outfitinspo', '#fashionista',
    '#styleinspo', '#outfitideas', '#fashionstyle', '#whatiwore',
    '#dailylook', '#fashionblogger', '#streetstyle', '#instafashion',
    '#fashionaddict', '#styleinspiration', '#fashionlovers'
  ],
  shopping: [
    '#amazonfinds', '#amazonmusthaves', '#amazonfashion',
    '#affordablefashion', '#budgetfashion', '#shoppingaddict',
    '#shopaholic', '#musthave', '#haul', '#newfinds'
  ],
  aesthetic: [
    '#aesthetic', '#aestheticoutfit', '#aestheticfashion',
    '#moodboard', '#vibes', '#aesthetically', '#dreamy',
    '#softaesthetic', '#aestheticstyle'
  ],
  trending: [
    '#trending', '#viral', '#fyp', '#explorepage', '#discover',
    '#trendingnow', '#popular', '#mustsee'
  ],
  seasonal: {
    spring: ['#springfashion', '#springoutfit', '#springvibes', '#springstyle'],
    summer: ['#summerfashion', '#summeroutfit', '#summervibes', '#summerstyle'],
    fall: ['#fallfashion', '#falloutfit', '#fallvibes', '#autumnstyle'],
    winter: ['#winterfashion', '#winteroutfit', '#wintervibes', '#cozystyle']
  }
};

const DESCRIPTION_TEMPLATES = [
  "Love this look? Tap the link to shop all pieces! {hashtags}",
  "Obsessed with this outfit! All items linked in bio. {hashtags}",
  "Your new favorite look is just a click away! Shop the full outfit. {hashtags}",
  "Elevate your wardrobe with these stunning pieces. Link in bio! {hashtags}",
  "This outfit is giving everything! Shop the look now. {hashtags}",
  "Style tip: Mix and match these pieces for endless outfit possibilities! {hashtags}",
  "The perfect outfit exists! Find all these pieces linked. {hashtags}",
  "Dreamy outfit alert! Every piece is shoppable. {hashtags}",
  "When your outfit just hits right! Shop the full look. {hashtags}",
  "Curated style picks you'll wear on repeat. Link in bio! {hashtags}"
];

// Get current season
function getCurrentSeason() {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 4) return 'spring';
  if (month >= 5 && month <= 7) return 'summer';
  if (month >= 8 && month <= 10) return 'fall';
  return 'winter';
}

// Generate random selection from array
function randomPick(arr, count = 1) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return count === 1 ? shuffled[0] : shuffled.slice(0, count);
}

// Generate Pinterest title
export function generatePinterestTitle(aesthetic = 'fashion') {
  const templates = TITLE_TEMPLATES[aesthetic] || TITLE_TEMPLATES.fashion;
  return randomPick(templates);
}

// Generate hashtags
export function generateHashtags(count = 15) {
  const season = getCurrentSeason();
  const allHashtags = [
    ...HASHTAG_SETS.fashion,
    ...HASHTAG_SETS.shopping,
    ...HASHTAG_SETS.aesthetic,
    ...randomPick(HASHTAG_SETS.trending, 3),
    ...HASHTAG_SETS.seasonal[season]
  ];

  // Remove duplicates and pick random selection
  const unique = [...new Set(allHashtags)];
  return randomPick(unique, count);
}

// Generate full Pinterest description
export function generatePinterestDescription() {
  const template = randomPick(DESCRIPTION_TEMPLATES);
  const hashtags = generateHashtags(20).join(' ');
  return template.replace('{hashtags}', '\n\n' + hashtags);
}

// Generate complete Pinterest caption (title + description)
export function generatePinterestCaption(aesthetic = 'fashion') {
  return {
    title: generatePinterestTitle(aesthetic),
    description: generatePinterestDescription(),
    hashtags: generateHashtags(25)
  };
}

// Regenerate just the title
export function regenerateTitle(aesthetic = 'fashion') {
  return generatePinterestTitle(aesthetic);
}

// Regenerate just the description
export function regenerateDescription() {
  return generatePinterestDescription();
}
