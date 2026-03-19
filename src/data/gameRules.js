// =====================================================
// GAME LOGIC
// =====================================================

export const CHOICES = [
  { id: 'rock',     emoji: '🪨', label: 'Rock',     color: 'var(--color-rock)' },
  { id: 'paper',    emoji: '📄', label: 'Paper',    color: 'var(--color-paper)' },
  { id: 'scissors', emoji: '✂️', label: 'Scissors', color: 'var(--color-scissors)' },
]

// Returns 'win' | 'lose' | 'draw' from the player's perspective
export function getResult(playerChoice, cpuChoice) {
  if (playerChoice === cpuChoice) return 'draw'
  const wins = { rock: 'scissors', paper: 'rock', scissors: 'paper' }
  return wins[playerChoice] === cpuChoice ? 'win' : 'lose'
}

export function getRandomChoice() {
  const ids = CHOICES.map((c) => c.id)
  return ids[Math.floor(Math.random() * ids.length)]
}

export function getChoiceById(id) {
  return CHOICES.find((c) => c.id === id)
}

// =====================================================
// EDUCATIONAL CONTENT
// =====================================================

export const RULES_EXPLANATION = {
  'rock-scissors': {
    rule: '🪨 Rock smashes ✂️ Scissors!',
    why: 'Rock is strong and heavy — it totally crushes scissors flat!',
  },
  'scissors-paper': {
    rule: '✂️ Scissors cut 📄 Paper!',
    why: 'Sharp scissors can slice right through paper — snip snip!',
  },
  'paper-rock': {
    rule: '📄 Paper covers 🪨 Rock!',
    why: 'Paper wraps all the way around rock and covers it completely!',
  },
  'scissors-rock': {
    rule: '🪨 Rock smashes ✂️ Scissors!',
    why: 'Rock is super strong — it breaks the scissors when they meet!',
  },
  'paper-scissors': {
    rule: '✂️ Scissors cut 📄 Paper!',
    why: 'Scissors are sharp and cut paper into tiny pieces!',
  },
  'rock-paper': {
    rule: '📄 Paper covers 🪨 Rock!',
    why: 'Paper can cover up the whole rock — rock is trapped!',
  },
  draw: {
    rule: "It's a Tie!",
    why: 'When both players pick the same thing, nobody wins — play again!',
  },
}

export function getRuleExplanation(playerChoice, cpuChoice) {
  if (playerChoice === cpuChoice) return RULES_EXPLANATION.draw
  const key = `${playerChoice}-${cpuChoice}`
  return RULES_EXPLANATION[key] ?? RULES_EXPLANATION.draw
}

// Fun facts for each choice (rotated by round number)
export const FUN_FACTS = {
  rock: [
    '🪨 Rocks can be over 4 BILLION years old — older than the dinosaurs!',
    '🌋 Rocks from volcanoes are called igneous rocks — they start as hot liquid!',
    '💎 Diamonds are a type of rock — the hardest natural material on Earth!',
    '🪨 Some rocks on the Moon were brought back by astronauts!',
  ],
  paper: [
    '📄 Paper is made from trees — one tree makes about 8,000 sheets of paper!',
    '🇨🇳 Paper was invented in China over 2,000 years ago!',
    '📚 Before paper, people wrote on clay tablets, animal skins, and papyrus!',
    '♻️ Recycling paper saves trees — you can recycle the same paper up to 7 times!',
  ],
  scissors: [
    '✂️ Scissors were invented about 3,000 years ago in ancient Egypt!',
    '🎨 Artists, hairdressers, doctors, and chefs all use scissors!',
    '✂️ The biggest scissors ever made were over 3 metres long — as tall as a giraffe\'s neck!',
    '🧵 Tailors use special scissors just for cutting fabric — they\'re called shears!',
  ],
}

export function getFunFact(choice, round) {
  const facts = FUN_FACTS[choice] ?? FUN_FACTS.rock
  return facts[round % facts.length]
}

// Strategy tips (shown after round 3+)
export const STRATEGY_TIPS = [
  '💡 Try to remember what your opponent picked last round — people often repeat!',
  '🎲 Mixing up your choices makes you harder to predict!',
  '🧠 If you keep losing with one choice, try switching!',
  '👀 Watch for patterns — if someone picks rock a lot, try paper next!',
  '🌟 The best players stay unpredictable — even they don\'t know what they\'ll pick!',
]

export function getStrategyTip(round) {
  return STRATEGY_TIPS[round % STRATEGY_TIPS.length]
}

// Streak messages
export function getStreakMessage(streak, type) {
  if (type === 'win' && streak >= 3)
    return `🔥 You're on a ${streak}-win streak! You're unstoppable!`
  if (type === 'lose' && streak >= 3)
    return `💪 Keep going! Even champions lose sometimes. You've got this!`
  return null
}
