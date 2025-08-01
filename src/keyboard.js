import { startNewDay } from "./main.js";
import { startOrderView } from "./views/orderView.js";

export function setupGlobalEnterKey() {
  window.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;

    if (isVisible("startMenu")) {
      document.getElementById("startMenu").style.display = "none";
      startNewDay();
    } else if (isVisible("resultView")) {
      document.getElementById("resultView").style.display = "none";
      startOrderView();
    } else if (isVisible("daySummary")) {
      document.getElementById("daySummary").style.display = "none";
      startNewDay();
    }
  });
}

function isVisible(id) {
  const el = document.getElementById(id);
  return el && el.style.display !== "none";
}
