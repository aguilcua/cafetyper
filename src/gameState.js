import {items as itemDefs} from "./items.js";


const MAX_TIP = 15;
const BASECUSTOMERS = 2;
export let currentDrink = null;
let dayNumber = 1;
let playerMoney = 0;
let typingStats = {
  wpm: 0,
  errors: 0,
};
let customerIndex = 0;
let totalCustomers = 0;
let quota = 30;

//item stuff
let activeItems = {
  stackables: {},
  consumables: null,
  permanent: [],
};

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


    this.onTick(this.remainingTime);
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
  increaseQuota(); //change amount with difficulty or just linear growth?
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
  let tip = Math.round(proportion * maxTip * 100) / 100;

  const {stackables} = getItems();
  if (stackables['bonusTip']) {
    for (let i = 0; i < stackables['bonusTip']; i++) {
      tip = itemDefs.bonusTip.effect(tip);
    }
  }

  return Math.round(tip * 100) / 100;
}
export function getDifficulty() {
  const base = 1;
  const dayMultiplier = Math.pow(1.2, dayNumber);
  const {wpm} = typingStats;

  let speedFactor = 1;
  if (wpm < 45) {
    speedFactor = 0.8;
  } else if (wpm >= 70) {
    speedFactor = 1.2;
  }

  return base * dayMultiplier * speedFactor;
}

export function getCustomerCount(difficulty = getDifficulty()) {
  return Math.floor(BASECUSTOMERS + difficulty * 0.5);
}

function extraOrderChance(difficulty) {
  return Math.random() < 0.1 + difficulty + 0.05;
}

export function startCustomerLoop() {
  const difficulty = getDifficulty();
  totalCustomers = getCustomerCount();
  customerIndex = 0;
}

export function hasNextCustomer() {
  return customerIndex < totalCustomers;
}

export function nextCustomer() {
  return customerIndex++;
}

export function getCustomerIndex() {
  return customerIndex;
}
export function resetCustomerLoop() {
  customerIndex = 0;
  totalCustomers = 0;
}
export function getQuota() {
  return quota;
}

export function increaseQuota() {
  let increase = 15;
  quota += increase;
}

export function resetQuota() {
  quota = 50;
}

export function addItem(item) {
  if (item.type === 'stackable') {
    if (!activeItems.stackables[item.id]) {
      activeItems.stackables[item.id] = 0;
    }
    activeItems.stackables[item.id]++;
  } else if (item.type === 'consumable') {
    activeItems.consumable = item;
  } else if(item.type === 'permanent') {
    if (!activeItems.permanent.includes(item.id)) {
      activeItems.permanent.push(item.id);
    }
  }
}
export function getItems() {
  return activeItems;
}
export function useConsumable() {
  const used = activeItems.consumable;
  activeItems.consumable = null;
  return used;
}

export function resetItems() {
  activeItems = {
    stackables: {},
    consumable: null,
    permanent: [],
  };
}