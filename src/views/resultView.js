import { currentDrink } from '../gameState.js';
import { showView } from '../viewController.js';

export function startResultView() {
  showView("resultView");

  const view = document.getElementById("resultView");
  document.getElementById("resultMessage").textContent = `You made a ${currentDrink}! Nice job.`;

  function handleContinue(e) {
    if (e.key === "Enter") {
      document.removeEventListener("keydown", handleContinue);
      showView("orderView");
      window.dispatchEvent(new CustomEvent("resultContinue"));
    }
  }

  document.addEventListener("keydown", handleContinue);
}