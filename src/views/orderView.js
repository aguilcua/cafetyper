import { customerOrders } from '../data.js';
import { resetState, setCurrentDrink, setTypingStats } from '../gameState.js';
import { startIngredientView } from './ingredientView.js';

let phrase = '';
let currentIndex = 0;
let typingStartTime = 0;
let errorCount = 0;

export function startOrderView() {
  let typingStartTime = Date.now();
  //reset from the previous order screen if any.
  resetState();
  errorCount = 0;

  //pick a random order from list of orders
  const order = customerOrders[Math.floor(Math.random() * customerOrders.length)];
  phrase = order.quote;
  setCurrentDrink(order.drink);
  //reset cursor to 0
  currentIndex = 0;

  document.getElementById('orderView').style.display = 'block';
  const container = document.getElementById('phraseContainer');
  container.innerHTML = '';

  //split the phrase into different words
  phrase.split('').forEach((char, i) => {
    const span = document.createElement('span');
    span.textContent = char === ' ' ? '\u00A0' : char;
    span.classList.add('char');
    if (i === 0) span.classList.add('active');
    container.appendChild(span);
  });

  window.addEventListener('keydown', handleTyping);
}

function handleTyping(e) {
  const container = document.getElementById('phraseContainer');
  const spans = container.querySelectorAll('span');
  const expectedChar = phrase[currentIndex];

  if (!expectedChar || currentIndex >= spans.length) return;

  const key = e.key;

  // Allow only single characters and space
  if (key.length !== 1 && key !== ' ') return;

  const span = spans[currentIndex];

  // Check correctness
  if (key === expectedChar) {
    span.classList.add('correct');
    span.classList.remove('active', 'incorrect');
    currentIndex++;

    if (spans[currentIndex]) {
      spans[currentIndex].classList.add('active');
    } else {
      // Done typing
      window.removeEventListener('keydown', handleTyping);
      document.getElementById('orderView').style.display = 'none';
      
      const typingEndTime = Date.now();
      const durationInMinutes = (typingEndTime - typingStartTime) / 60000;
      const wordCount = phrase.trim().split(/\s+/).length;
      const wpm = wordCount / durationInMinutes;
      setTypingStats({wpm, errors: errorCount});
      startIngredientView();
    }
  } else {
    // Show incorrect feedback
    span.classList.add('incorrect');
    span.classList.remove('active');
    // Don't advance currentIndex
    setTimeout(() => {
      span.classList.remove('incorrect');
      span.classList.add('active');
    }, 150); // Flash red then return to active
  }
}
function getAdjustedDifficulty(dayNumber, wpm){
  const base = getDifficultyLevel(dayNumber);

}

