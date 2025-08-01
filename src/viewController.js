import { getCustomerCount, getCustomerIndex, getDayNumber, getItems, getMoney, getQuota } from "./gameState.js";
import { renderItemShop } from "./views/itemShopView.js";


const views = {
  startMenu: document.getElementById("startMenu"),
  orderView: document.getElementById("orderView"),
  ingredientView: document.getElementById("ingredientView"),
  resultView: document.getElementById("resultView"),
  daySummary: document.getElementById("daySummary"),
  gameOverSummary: document.getElementById("gameOverScreen"),
};

export function showView(viewName) {
  Object.values(views).forEach((v) => (v.style.display = "none"));
  const target = views[viewName];
  if (target) {
    target.style.display = "block";
  } else {
    console.warn(`View ${viewName} does not exist.`);
  }
}

export function hideView(viewName) {
  const target = views[viewName];
  if (target) {
    target.style.display = "none";
  }
}

export function setDaySummaryContent(day, money, wpm) {
  views.daySummary.innerHTML = `
    <h2>Day ${day} Complete!</h2>
    <p>Money Earned: $${money.toFixed(2)}</p>
    <p>Typing Speed: ${wpm.toFixed(1)} WPM</p>
    <div id="nextDayButton" style="cursor:pointer;">Next Day</div>
    <div id="shopButton" style="cursor:pointer;">Shop</div>
  `;

  document.getElementById("nextDayButton").onclick = () => {
    hideView("daySummary");
    window.dispatchEvent(new CustomEvent("nextDay"));
  };

  document.getElementById("shopButton").onclick = () => {
    renderItemShop();
    showView('itemShop');
  };
}
export function showGameOverScreen(earned, quota, isTimeUp) {

  showHUD(false);
  hideView("orderView");
  hideView("ingredientView");
  const gameOver = document.getElementById("gameOverScreen");

  if(isTimeUp) {
    gameOver.innerHTML = `
    <h2>Game Over</h2>
    <p>You ran out of time and your customers left very sad. :(</p>
    <button id="restartBtn">Restart</button>
  `;
  gameOver.style.display = 'block';
  } else {
    gameOver.innerHTML = `
    <h2>Game Over</h2>
    <p>You earned $${earned.toFixed(2)} but needed $${quota.toFixed(2)}.</p>
    <button id="restartBtn">Restart</button>
  `;
  }

  gameOver.style.display = 'block';

  document.getElementById('restartBtn').onclick = () => {
    window.location.reload(); // Or implement soft reset logic
  };
}
export function showHUD(flag) {
  const customerDisplay = document.getElementById("customerDisplay");
  const timerDisplay = document.getElementById("timerDisplay");
  const moneyDisplay = document.getElementById("moneyDisplay");
  const dayDisplay = document.getElementById("dayDisplay");
  const itemDisplay = document.getElementById("itemDisplay");
  if (flag) {
    customerDisplay.style.display = "block";
    timerDisplay.style.display = "block";
    moneyDisplay.style.display = "block";
    dayDisplay.style.display = "block";
    itemDisplay.style.display = "block";
  } else {
    customerDisplay.style.display = "none";
    timerDisplay.style.display = "none";
    moneyDisplay.style.display = "none";
    dayDisplay.style.display = "none";
    itemDisplay.style.display = "none";
  }
}
export function renderActiveItems() {
  const itemDisplay = document.getElementById('itemDisplay');
  const { stackables, consumable, permanent } = getItems();
  itemDisplay.innerHTML = '';

  Object.entries(stackables).forEach(([id, count]) => {
    const div = document.createElement('div');
    div.textContent = `${id} x${count}`;
    itemDisplay.appendChild(div);
  });

  if (consumable) {
    const div = document.createElement('div');
    div.textContent = `Consumable: ${consumable.name}`;
    itemDisplay.appendChild(div);
  }

  permanent.forEach(id => {
    const div = document.createElement('div');
    div.textContent = `Permanent: ${id}`;
    itemDisplay.appendChild(div);
  });
}

export function renderHUD() {
  document.getElementById('moneyDisplay').textContent = `${getMoney().toFixed(2)}/${getQuota().toFixed(2)}`;
  document.getElementById('dayDisplay').textContent = `Day ${getDayNumber()}`;
  document.getElementById('customerDisplay').textContent = `Customer ${getCustomerIndex()}/${getCustomerCount()}`;
  renderActiveItems();
}
