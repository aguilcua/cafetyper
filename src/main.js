import { resetDay, getDayNumber } from "./gameState.js";
import { startOrderView } from "./views/orderView.js";

document.getElementById("startButton").addEventListener("click", () => {
  resetDay();
  document.getElementById("startMenu").style.display = "none";
  startOrderView(getDayNumber());
});
