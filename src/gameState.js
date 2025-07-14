export let currentDrink = null;
let dayNumber = 1;
let playerMoney = 0;
let typingStats = {
  wpm: 0,
  errors: 0,
};
const MAX_TIP = 15;

export let currentPhrase = null;
export let requiredIngredients = [];
export let usedIngredients = [];

let timer = {
  remainingTime: 60,
  intervalId: null,
  onTick: null,
  onTimeUp: null,

  start(seconds = 60, onTick = () => {}, onTimeUp = () => {}) {
    this.stop();
    this.remainingTime = seconds;
    this.onTick = onTick;
    this.onTimeUp = onTimeUp;

    this.intervalId = setInterval(() => {
      this.remainingTime -= 1;
      this.onTick(this.remainingTime);

      if(this.remainingTime <= 0) {
        this.stop();
        this.onTimeUp();
      }
    }, 1000);
  },

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  },
  getRemaining() {
    return this.remainingTime;
  }
};

export function getTimer(){
  return timer;
}
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
export function getDayNumber() {
  return dayNumber;
}
export function advanceDay() {
  dayNumber++;
}
export function resetDay(){
  dayNumber = 1;
  playerMoney = 0;
}
export function addMoney(amount) {
  playerMoney += amount;
}
export function getMoney() {
  return playerMoney;
}

export function calculateTip(timeRemaining, totalTime = 60, maxTip = MAX_TIP) {
  const proportion = Math.max(0, (timeRemaining + 2) / totalTime);
  return Math.round(proportion * maxTip * 100) / 100; //round to 2 decimals
}