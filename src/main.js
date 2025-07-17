
import { advanceDay, getMoney, getQuota, hasNextCustomer, nextCustomer, resetCustomerLoop, resetState, startCustomerLoop } from "./gameState.js";
import { showGameOverScreen, showView } from "./viewController.js";
import { showDaySummary } from "./views/ingredientView.js";
import { startOrderView } from "./views/orderView.js";

window.addEventListener("DOMContentLoaded", () => {
  showView("startMenu");

  document.addEventListener("keydown", function handleStart(e) {
    if (e.key === "Enter") {
      document.removeEventListener("keydown", handleStart);
      startCustomerLoop();
      showView("orderView");
      startOrderView();
    }
  });
});

window.addEventListener("resultContinue", () => {
  const earned = getMoney();
  const quota = getQuota();

  if (hasNextCustomer()) {
    nextCustomer();
    startOrderView();
  } else if(earned < quota) {
    showGameOverScreen(earned, quota);
  } else {
    advanceDay();
    showDaySummary();
  }
});

window.addEventListener("nextDay", () => {
  advanceDay();
  resetCustomerLoop();
  resetState();
  showView("orderView");
  startOrderView();
});

