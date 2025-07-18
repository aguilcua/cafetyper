import { customerOrders } from '../data.js';
import { resetState, setCurrentDrink, setTypingStats, getTimer, getCustomerIndex, getCustomerCount, getMoney, getQuota } from '../gameState.js';
import { playRandomKeySound, playWrongKeySound } from '../sound.js';
import { showGameOverScreen, showHUD } from '../viewController.js';
import { startIngredientView } from './ingredientView.js';

let phrase = '';
let currentIndex = 0;
let typingStartTime = 0;
let errorCount = 0;
let order = null;

export function startOrderView() {
  typingStartTime = 0; //upon new order typing speed is reset
  const timer = getTimer();
  timer.start(45, updateTimerUI, () => {
    console.log("Times up!");
    //do something when your time is up
    showGameOverScreen(getMoney(), getQuota());
  });

  function updateTimerUI(time) {
    document.getElementById("timerDisplay").textContent = `${time}s`;
  }
  //reset from the previous order screen if any.
  resetState();
  errorCount = 0;

  
  const customerDisplay = document.getElementById("customerDisplay");
  customerDisplay.textContent = `Customer ${getCustomerIndex() + 1}/${getCustomerCount()}`;
  showHUD(true);

  //pick a random order from list of orders
  order = customerOrders[Math.floor(Math.random() * customerOrders.length)];
  phrase = order.quote;
  setCurrentDrink(order.drink);
  //reset cursor to 0
  currentIndex = 0;

  document.getElementById('orderView').style.display = 'block';
  const container = document.getElementById('phraseContainer');
  container.innerHTML = '';

  //split the phrase into different words
  let globalCharIndex = 0;
phrase.split(' ').forEach((word, wordIdx) => {
  const wordSpan = document.createElement('span');
  wordSpan.classList.add('word');
  word.split('').forEach((char) => {
    const span = document.createElement('span');
    span.textContent = char;
    span.classList.add('char');
    if (globalCharIndex === 0) span.classList.add('active');
    wordSpan.appendChild(span);
    globalCharIndex++;
  });

  // Add space after the word unless it's the last one
  if (wordIdx < phrase.split(' ').length - 1) {
    const spaceSpan = document.createElement('span');
    spaceSpan.textContent = '\u00A0';
    spaceSpan.classList.add('char');
    wordSpan.appendChild(spaceSpan);
    globalCharIndex++;
  }

  container.appendChild(wordSpan);
});

  window.addEventListener('keydown', handleTyping);
}

function handleTyping(e) {
  if(currentIndex === 0 && typingStartTime === 0) {
    typingStartTime = Date.now(); //only on first keypress
    console.log("Typing started");
  }
  const container = document.getElementById('phraseContainer');
  const spans = container.querySelectorAll('.char');
  const expectedChar = phrase[currentIndex];

  if (!expectedChar || currentIndex >= spans.length) return;

  const key = e.key;

  // Allow only single characters and space
  if (key.length !== 1 && key !== ' ') return;

  const span = spans[currentIndex];

  // Check correctness
  if (key === expectedChar) {
    playRandomKeySound();
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
      const durationInSeconds = (typingEndTime - typingStartTime) / 1000;
      const charCount = order.length;
      const wpm = (charCount / 5) / (durationInSeconds /60);
      setTypingStats({wpm, errors: errorCount});
      console.log('wpm:', wpm.toFixed(0));
      startIngredientView();
    }
  } else {
      playWrongKeySound();
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