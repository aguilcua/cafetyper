import { addItem, addMoney, getMoney, getTimer } from '../gameState.js';
import {items} from '../items.js';
import { hideView, renderActiveItems, renderHUD, showView } from '../viewController.js';
export function renderItemShop() {
    getTimer().stop();
    const shop = document.getElementById('itemShop');
    shop.innerHTML = '';

    Object.values(items).forEach(item => {
        const el = document.createElement('div');
        el.innerHTML = `
            <h4>${item.name}</h4>
            <p>${item.description}</p>
            <button> Buy for ${item.cost}</button>
        `;
        el.querySelector('button').addEventListener('click', () => {
            if(getMoney() >= item.cost) {
                addItem(item);
                addMoney(-item.cost);
                renderHUD();
                renderItemShop();
            }
        });
        shop.appendChild(el);
    });

    const backButton = document.createElement('div');
    backButton.textContent = 'Back to Summary';
    backButton.addEventListener('click', () => {
        hideView('itemShop');
        showView('daySummary');
        renderHUD();
    });

    shop.appendChild(backButton);
}