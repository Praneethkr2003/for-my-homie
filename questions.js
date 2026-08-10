// ============================================================
//  questions.js — Edit this file to change any question/option
// ============================================================

const QUIZ_DATA = [

  // ── ROUND 1: ANIME ──────────────────────────────────────────
  {
    id: 'r1_intro', type: 'round_intro', round: 1,
    accent: '#a855f7', emoji: '⚔️',
    title: 'ROUND 1: ANIME',
    subtitle: "You've been dropped into the anime universe.",
    text: 'Choose your weapon.'
  },
  {
    id: 'q1', type: 'choice', round: 1, required: true,
    question: 'If someone gave you ONE thing from this list, what would you choose?',
    options: [
      { label: '🏴‍☠️  One Piece merch',                   value: 'One Piece merch' },
      { label: '🍃  Naruto merch',                        value: 'Naruto merch' },
      { label: '🔵🔴 Messi / Barcelona merch',            value: 'Messi / Barcelona merch' },
      { label: '⚡  Lamine Yamal / football merch',       value: 'Lamine Yamal / football merch' },
      { label: '🚗  Hot Wheels',                          value: 'Hot Wheels' },
      { label: '🤷  Something completely unrelated',      value: 'Something completely unrelated' }
    ]
  },
  {
    id: 'q2', type: 'choice', round: 1, required: true,
    question: 'Which character/player would you actually want on a gift?',
    options: [
      { label: '🏴‍☠️  Luffy',          value: 'Luffy' },
      { label: '⚔️  Zoro',            value: 'Zoro' },
      { label: '🍃  Naruto',          value: 'Naruto' },
      { label: '🌑  Itachi',          value: 'Itachi' },
      { label: '🐐  Messi',           value: 'Messi' },
      { label: '⚡  Lamine Yamal',    value: 'Lamine Yamal' }
    ]
  },
  {
    id: 'q3', type: 'text', round: 1, required: false,
    question: 'Someone else which is illegal? or GAWK GAWK FOR YOUR COCK',
    placeholder: 'Type here if you dare...',
    helpText: 'Optional. No judgement. (there is judgement)'
  },
  {
    id: 'q4', type: 'choice', round: 1, required: true,
    question: 'Pick your ideal type of gift:',
    options: [
      { label: '🖼️  Something I can display',                   value: 'Something I can display' },
      { label: '🛠️  Something I can actually use',              value: 'Something I can actually use' },
      { label: '👕  Something I can wear',                      value: 'Something I can wear' },
      { label: '📦  Something I can collect',                   value: 'Something I can collect' },
      { label: '🍕  Something edible',                          value: 'Something edible' },
      { label: '🎁  Surprise me OR YK IK HEHEHEHEHE',          value: 'Surprise me OR YK IK HEHEHEHEHE' }
    ]
  },

  // ── ROUND 2: FOOTBALL ───────────────────────────────────────
  {
    id: 'r2_intro', type: 'round_intro', round: 2,
    accent: '#3b82f6', emoji: '⚽',
    title: 'ROUND 2: FOOTBALL',
    subtitle: '90th minute. Final match.',
    text: 'You get ONE birthday gift.'
  },
  {
    id: 'q5', type: 'multiselect', round: 2, required: true,
    question: 'Pick your football preferences:',
    helpText: 'Select all that apply',
    options: [
      { label: '🐐  Messi',              value: 'Messi' },
      { label: '⚡  Lamine Yamal',       value: 'Lamine Yamal' },
      { label: '🤝  Messi + Yamal',      value: 'Messi + Yamal' },
      { label: '🔵🔴 Barcelona',         value: 'Barcelona' },
      { label: '🇦🇷  Argentina',         value: 'Argentina' },
      { label: '⚽  Football in general', value: 'Football in general' }
    ]
  },
  {
    id: 'q6', type: 'choice', round: 2, required: true,
    question: 'Which would you rather receive?',
    options: [
      { label: '💎  One really cool gift',           value: 'One really cool gift' },
      { label: '🎁🎁🎁 Three smaller gifts',         value: 'Three smaller gifts' },
      { label: '🏆  One collectible',                value: 'One collectible' },
      { label: '🎲  Something completely unexpected', value: 'Something completely unexpected' }
    ]
  },

  // ── ROUND 3: THE GARAGE ─────────────────────────────────────
  {
    id: 'r3_intro', type: 'round_intro', round: 3,
    accent: '#f59e0b', emoji: '🚗',
    title: 'ROUND 3: THE GARAGE',
    subtitle: 'We need to investigate',
    text: 'your automotive priorities.'
  },
  {
    id: 'q7', type: 'choice', round: 3, required: true,
    question: 'Hot Wheels question — choose wisely.',
    options: [
      { label: '😎  A cool-looking car',                        value: 'A cool-looking car' },
      { label: '🇯🇵  JDM',                                     value: 'JDM' },
      { label: '🏎️  Supercars',                                 value: 'Supercars' },
      { label: '🏁  F1 / racing cars',                          value: 'F1 / racing cars' },
      { label: '🎬  Movie / TV themed cars',                    value: 'Movie / TV themed cars' },
      { label: "🎰  I don't discriminate. Give me any Hot Wheels.", value: "I don't discriminate. Give me any Hot Wheels." }
    ]
  },

  // ── ROUND 4: THE ACTUAL INVESTIGATION ───────────────────────
  {
    id: 'r4_intro', type: 'round_intro', round: 4,
    accent: '#ef4444', emoji: '🔍',
    title: 'ROUND 4: THE ACTUAL INVESTIGATION',
    subtitle: 'This section is totally normal.',
    text: 'Nothing suspicious here.'
  },
  {
    id: 'q8', type: 'textarea', round: 4, required: true,
    question: 'If you had Cash lets say 2k or 4k to spend on yourself right now, what would you buy?',
    helpText: 'Be specific. This answer may or may not be extremely important.',
    placeholder: 'Be honest. Nobody is watching. (we are watching)'
  },
  {
    id: 'q9', type: 'textarea', round: 4, required: false,
    question: "What's something you've wanted recently but haven't bought yet?",
    placeholder: "Don't be shy..."
  },
  {
    id: 'q10', type: 'choice', round: 4, required: true,
    question: "Which of these would make you say 'BROOOO' when you open it?",
    options: [
      { label: '🗿  Anime figure',             value: 'Anime figure' },
      { label: '📚  Manga',                   value: 'Manga' },
      { label: '👕  Anime clothing',           value: 'Anime clothing' },
      { label: '⚽  Football jersey',          value: 'Football jersey' },
      { label: '🏆  Football collectible',     value: 'Football collectible' },
      { label: '🚗  Hot Wheels',               value: 'Hot Wheels' },
      { label: '😈  Something else or GAWK GAWK 69', value: 'Something else or GAWK GAWK 69' }
    ]
  },
  {
    id: 'q11', type: 'text', round: 4, required: false,
    question: "Is there anything you absolutely DON'T want?",
    placeholder: 'Speak freely. This is a safe space.'
  },
  {
    id: 'q12', type: 'sizes', round: 4, required: false,
    sectionLabel: 'Totally normal questions. Nothing suspicious here.',
    fields: [
      { id: 'tshirt_size', label: 'T-shirt size', placeholder: 'S / M / L / XL / XXL' },
      { id: 'jersey_size', label: 'Jersey size',  placeholder: 'S / M / L / XL' },
      { id: 'shoe_size',   label: 'Shoe size',    placeholder: 'UK 8 / EU 42...' }
    ]
  },

  // ── FINAL SECURITY QUESTION ─────────────────────────────────
  {
    id: 'q13', type: 'final_choice', round: 4, required: true,
    sectionLabel: '🔐 FINAL SECURITY QUESTION',
    question: "Why do you think I'm asking you all these questions?",
    options: [
      { label: "🤔  You're genuinely curious",              value: "You're genuinely curious" },
      { label: "😏  You're planning something",             value: "You're planning something" },
      { label: '😨  This is definitely a trap',             value: 'This is definitely a trap' },
      { label: "🎁  You're buying me a GAWK GAWK",         value: "You're buying me a GAWK GAWK" },
      { label: '⚖️  I refuse to answer without a lawyer',  value: 'I refuse to answer without a lawyer' }
    ]
  }
];

// ── ANALYSIS SCREEN STATS (edit values 0-100) ──────────────────
const ANALYSIS_STATS = [
  { label: 'Anime obsession',    value: 90,  color: '#a855f7' },
  { label: 'Football obsession', value: 100, color: '#3b82f6' },
  { label: 'Hot Wheels addiction', value: 70, color: '#f59e0b' },
  { label: 'Suspicion level',    value: 100, color: '#ef4444' },
  { label: 'GAWK GAWK meter',    value: 100, color: '#ec4899' }
];
