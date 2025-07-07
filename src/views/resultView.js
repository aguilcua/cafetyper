import { currentDrink } from '../gameState.js';
import { startOrderView } from './orderView.js';

export function startResultView() {
  document.getElementById('resultView').style.display = 'block';
  document.getElementById('resultMessage').textContent = `You made a ${currentDrink}! Nice job.`;

  const btn = document.getElementById('nextCustomer');
  btn.addEventListener('click', next);

  function next() {
    document.getElementById('resultView').style.display = 'none';
    btn.removeEventListener('click', next);
    startOrderView();
  }
}
