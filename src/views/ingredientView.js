import { drinks, wordPool } from "../data.js";
import {
  getCurrentDrink,
  requiredIngredients,
  usedIngredients,
  getTypingStats,
} from "../gameState.js";
import { startResultView } from "./resultView.js";

let currentTargets = []; // tracks progress through each target word
let currentTyped = ""; // global typed string
let typedWrongIngredient = false;

export function startIngredientView(dayNumber) {
  typedWrongIngredient = false;
  usedIngredients.length = 0;

  const { wpm, errors } = getTypingStats();
  const ingredientList = document.getElementById("ingredientList");
  const view = document.getElementById("ingredientView");
  const drinkTitle = document.getElementById("drinkTitle");
  const drinkName = getCurrentDrink();
  drinkTitle.textContent = `Now making: ${drinkName.charAt(0).toUpperCase() + drinkName.slice(1)}`;

  view.style.display = "block";
  ingredientList.innerHTML = "";
  currentTargets = [];
  currentTyped = "";

  const realIngredients = drinks[drinkName].ingredients;
  const decoyOptions = drinks[drinkName].decoys ?? [];

  const difficulty = getDifficulty(dayNumber);
  const decoysToAdd = difficulty === "easy" ? 1 : difficulty === "medium" ? 2 : 3;

  requiredIngredients.splice(0, requiredIngredients.length, ...realIngredients);
  usedIngredients.length = 0;

  const decoys = [];
  while (decoys.length < decoysToAdd && decoyOptions.length > 0) {
    const decoy = decoyOptions[Math.floor(Math.random() * decoyOptions.length)];
    if (!realIngredients.includes(decoy) && !decoys.includes(decoy)) {
      decoys.push(decoy);
    }
  }

  const allIngredients = [...realIngredients, ...decoys];
  shuffleArray(allIngredients);
  const usedWords = new Set();

  allIngredients.forEach((ingredient) => {
    let word = null;
    let attempts = 0;

    while (attempts < 10 && !word) {
      const tier = getWordDifficultyTier(difficulty);
      const pool = wordPool[tier] ?? [];

      const candidates = pool.filter((w) => !usedWords.has(w));
      if (candidates.length > 0) {
        word = candidates[Math.floor(Math.random() * candidates.length)];
        usedWords.add(word);
      }

      attempts++;
    }

    // Fallback: if no unique word could be found
    if (!word) {
      const fallbackPool = Object.values(wordPool)
        .flat()
        .filter((w) => !usedWords.has(w));
      word = fallbackPool[Math.floor(Math.random() * fallbackPool.length)];
      usedWords.add(word);
    }

    const container = document.createElement("div");
    container.classList.add("ingredient");
    container.dataset.ingredient = ingredient;

    const label = document.createElement("div");
    label.textContent = `${ingredient}:`;
    container.appendChild(label);

    const wordBox = document.createElement("div");
    wordBox.classList.add("word");

    const charSpans = word.split("").map((char, i) => {
      const span = document.createElement("span");
      span.classList.add("char");
      span.textContent = char;
      if (i === 0) span.classList.add("active");
      wordBox.appendChild(span);
      return span;
    });

    container.appendChild(wordBox);
    ingredientList.appendChild(container);

    currentTargets.push({
      ingredient,
      word,
      chars: charSpans,
      progress: 0,
      complete: false,
      isReal: realIngredients.includes(ingredient),
    });
  });

  window.addEventListener("keydown", handleGlobalTyping);
}

let currentTarget = null;

function handleGlobalTyping(e) {
  const key = e.key;
  if (key.length !== 1) return;

  currentTyped += key;
  let matched = false;

  // Find all incomplete targets that start with currentTyped
  const candidates = currentTargets.filter(
    (t) => !t.complete && t.word.startsWith(currentTyped)
  );

  if (candidates.length > 0) {
    const target = candidates[0];

    // If switching targets, reset all progress
    if (currentTarget && currentTarget !== target) {
      currentTargets.forEach((t) => {
        if (!t.complete && t.progress > 0) {
          t.chars.forEach((span) => span.classList.remove("correct", "active"));
          t.progress = 0;
          t.chars[0].classList.add("active");
        }
      });
      currentTyped = key; // restart with just the current letter
    }

    currentTarget = target;
    matched = true;

    const span = target.chars[target.progress];
    span.classList.add("correct");
    span.classList.remove("active");

    target.progress++;

    if (target.chars[target.progress]) {
      target.chars[target.progress].classList.add("active");
    } else {
      // Word completed
      target.complete = true;
      currentTarget = null;
      currentTyped = "";

      const box = document.querySelector(
        `[data-ingredient="${target.ingredient}"]`
      );
      box.classList.add("used");

      if (target.isReal) {
        usedIngredients.push(target.ingredient);
      } else {
        box.classList.add("wrong");
        box.addEventListener(
          "animationend",
          () => {
            box.classList.remove("wrong");
            window.removeEventListener("keydown", handleGlobalTyping);
            startIngredientView();
          },
          { once: true }
        );
        return;
      }
    }
  } else {
    // No matching words, reset all progress
    currentTargets.forEach((t) => {
      if (!t.complete && t.progress > 0) {
        t.chars.forEach((span) => span.classList.remove("correct", "active"));
        t.progress = 0;
        t.chars[0].classList.add("active");
      }
    });
    currentTarget = null;
    currentTyped = "";
  }

  // Check for success
  if (usedIngredients.length === requiredIngredients.length) {
    window.removeEventListener("keydown", handleGlobalTyping);
    document.getElementById("ingredientView").style.display = "none";
    startResultView();
  }
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
function getDifficulty(dayNumber, speedFactor) {
  const base = 1;
  const dayMultiplier = Math.pow(1.2, dayNumber);

  return base * dayMultiplier * speedFactor;
}
function getWordDifficultyTier(difficulty) {
  const weights = {
    1: Math.max(0.7 - 0.05 * difficulty, 0.1),
    2: Math.min(0.2 + 0.03 * difficulty, 0.4),
    3: Math.min(0.08 + 0.02 * difficulty, 0.3),
    4: Math.min(0.02 + 0.01 * difficulty, 0.2),
  };

  const roll = Math.random();
  let sum = 0;
  for (let tier = 1; tier <= 4; tier++) {
    sum += weights[tier];
    if (roll <= sum) return tier;
  }
  return 1;
}

function getCustomerCount(difficulty) {
  const baseCustomers = 4;
  return Math.floor(baseCustomers + difficulty * 0.5);
}

function extraOrderChance(difficulty) {
  return Math.random() < 0.1 + difficulty + 0.05;
}
