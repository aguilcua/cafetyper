export let currentDrink = null;
let typingStats = {
  wpm: 0,
  errors: 0,
};
export let currentPhrase = null;
export let requiredIngredients = [];
export let usedIngredients = [];

export function resetState() {
  currentDrink = null;
  currentPhrase = null;
  requiredIngredients = [];
  usedIngredients = [];
  typingStats = {wpm: 0, errors: 0};
}
export function getCurrentDrink() {
  return currentDrink;
}

export function setCurrentDrink(drink) {
  currentDrink = drink;
}
export function getTypingStats() {
  return typingStats;
}
export function setTypingStats(stats) {
  typingStats = stats;
}