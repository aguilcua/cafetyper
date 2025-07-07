import { drinks, wordPool } from '../data.js';
import { currentDrink, requiredIngredients, usedIngredients } from '../gameState.js';
import { startResultView } from './resultView.js';

export function startIngredientView() {
  const ingredientList = document.getElementById('ingredientList');
  const input = document.getElementById('ingredientInput');
  const view = document.getElementById('ingredientView');

  view.style.display = 'block';
  input.value = '';
  input.focus();

  const ingredients = drinks[currentDrink];
  requiredIngredients.splice(0, requiredIngredients.length, ...ingredients);

  const ingredientWords = ingredients.map(ingredient => {
    const word = wordPool[Math.floor(Math.random() * wordPool.length)];
    ingredientList.innerHTML += `<p data-ingredient="${ingredient}">${ingredient}: <strong>${word}</strong></p>`;
    return { ingredient, word };
  });

  input.addEventListener('input', handleInput);

  function handleInput(e) {
    const match = ingredientWords.find(obj =>
      obj.word === e.target.value && !usedIngredients.includes(obj.ingredient)
    );

    if (match) {
      usedIngredients.push(match.ingredient);
      e.target.value = '';
      const item = [...document.querySelectorAll('#ingredientList p')]
        .find(p => p.dataset.ingredient === match.ingredient);
      if (item) item.style.textDecoration = "line-through";
    }

    if (usedIngredients.length === requiredIngredients.length) {
      input.removeEventListener('input', handleInput);
      view.style.display = 'none';
      startResultView();
    }
  }
}
