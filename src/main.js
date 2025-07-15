
import { advanceDay, hasNextCustomer, nextCustomer, resetCustomerLoop, resetState } from "./gameState.js";
import { showView } from "./viewController.js";
import { showDaySummary } from "./views/ingredientView.js";
import { startOrderView } from "./views/orderView.js";

window.addEventListener("DOMContentLoaded", () => {
  showView("startMenu");

  document.addEventListener("keydown", function handleStart(e) {
    if (e.key === "Enter") {
      document.removeEventListener("keydown", handleStart);
      showView("orderView");
      startOrderView();
    }
  });
});

window.addEventListener("resultContinue", () => {
  if (hasNextCustomer()) {
    nextCustomer();
    startOrderView();
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
