export let currentDrink = null;
export let currentPhrase = null;
export let requiredIngredients = [];
export let usedIngredients = [];

export function resetState() {
  currentDrink = null;
  currentPhrase = null;
  requiredIngredients = [];
  usedIngredients = [];
}
export function getCurrentDrink() {
  return currentDrink;
}

export function setCurrentDrink(drink) {
  currentDrink = drink;
}