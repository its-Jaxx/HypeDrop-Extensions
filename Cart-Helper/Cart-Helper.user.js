// ==UserScript==
// @name         Cart-Helper
// @namespace    Cart-Helper
// @version      1.0.0
// @description  Automatic item seller based on entered value.
// @match        https://www.hypedrop.com/*
// @author       HD Code: jaxx
// @supportURL   https://discord.com/users/922843169480122388/
// @icon         https://raw.githubusercontent.com/its-Jaxx/HypeDrop-Extensions/refs/heads/main/Cart-Calculator/Cart-Calculator.png
// @grant        none
// @downloadURL  https://raw.githubusercontent.com/its-Jaxx/HypeDrop-Extensions/refs/heads/main/Cart-Calculator/Cart-Calculator.user.js
// @updateURL    https://raw.githubusercontent.com/its-Jaxx/HypeDrop-Extensions/refs/heads/main/Cart-Calculator/Cart-Calculator.user.js
// @grant        none
// ==/UserScript==
/* global $ */

(function() {
    'use strict';

    function watchForCartHeader() {
        let isButtonAdded = false;

        const observer = new MutationObserver((mutations, observerInstance) => {
            const cartHeader = document.querySelector(".header.d-flex.align-items-center.justify-content-between");

            if (cartHeader && !isButtonAdded) {
                addCustomButton(cartHeader);
                isButtonAdded = true;
            } else if (!cartHeader && isButtonAdded) {
                isButtonAdded = false;
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    watchForCartHeader();

    function addCustomButton(cartHeader) {
        const existingButton = document.querySelector(".custom-cart-button");
        if (existingButton) {
            existingButton.remove();
        }

        const customButtonContainer = document.createElement("div");
        customButtonContainer.className = "custom-cart-button d-flex align-items-center justify-content-between";
        customButtonContainer.style.marginTop = "10px";
        customButtonContainer.style.borderTop = "1px solid #ccc";
        customButtonContainer.style.padding = "5px 0";

        const numberInput = document.createElement("span");
        numberInput.className = "number-input";
        numberInput.setAttribute("contenteditable", "true");
        numberInput.style.width = "50px";
        numberInput.style.textAlign = "center";
        numberInput.style.borderBottom = "1px dotted gray";
        numberInput.style.color = "inherit";

        numberInput.textContent = localStorage.getItem("cartHelperValue") || "0.00";

        const playIcon = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
            </svg>`;
        const pauseIcon = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
            </svg>`;

        const playPauseButton = document.createElement("div");
        playPauseButton.className = "play-pause-button";
        playPauseButton.innerHTML = playIcon;
        playPauseButton.style.cursor = "pointer";

        customButtonContainer.append(numberInput, playPauseButton);
        cartHeader.parentElement.appendChild(customButtonContainer);

        let isRunning = false;
        const maxSelectedItems = 10;

        // Save input to localStorage whenever it changes
        numberInput.addEventListener("input", () => {
            localStorage.setItem("cartHelperValue", numberInput.textContent);
        });

        function parseInput(value) {
            return parseFloat(value.replace(/[€, $]/g, '').replace(',', '.'));
        }

        playPauseButton.addEventListener("click", () => {
            isRunning = !isRunning;
            playPauseButton.innerHTML = isRunning ? pauseIcon : playIcon;

            if (isRunning) {
                const inputValue = parseInput(numberInput.textContent);
                if (isNaN(inputValue)) {
                    alert("Please enter a valid number.");
                    isRunning = false;
                    playPauseButton.innerHTML = playIcon;
                    return;
                }
                autoSelectAndSell(inputValue);
            }
        });

        function autoSelectAndSell(maxValue) {
            let totalValue = 0;

            function performSelectionAndSell() {
                const selectionCount = selectItems(maxValue);
                console.log(`Found ${selectionCount} buttons`);

                if (selectionCount > 0) {
                    const itemValues = getSelectedValues();

                    if (itemValues.length > 0) {
                        totalValue = itemValues.reduce((acc, { value }) => acc + value, 0);
                        const symbol = itemValues[0].symbol;
                        clickSellButton();
                        console.log(`Sold (Worth ${symbol}${totalValue.toFixed(2)})`);
                    }

                    setTimeout(() => {
                        if (selectionCount === maxSelectedItems) {
                            performSelectionAndSell();
                        } else {
                            isRunning = false;
                            playPauseButton.innerHTML = playIcon;
                        }
                    }, 1000);
                } else {
                    isRunning = false;
                    playPauseButton.innerHTML = playIcon;
                }
            }

            performSelectionAndSell();
        }

        function selectItems(maxValue) {
            const itemElements = document.querySelectorAll("[data-test='inventory-items-list']");
            let selectedCount = 0;

            itemElements.forEach(item => {
                if (selectedCount >= maxSelectedItems) return;

                const itemValueText = item.querySelector(".currency-value")?.textContent || '';
                const itemValue = parseInput(itemValueText);

                if (itemValue <= maxValue) {
                    const checkbox = item.querySelector(".mat-checkbox-input");
                    const checkboxLabel = item.querySelector(".mat-checkbox-layout");

                    if (checkbox && checkboxLabel && !checkbox.checked) {
                        checkboxLabel.click();
                        selectedCount++;
                    }
                }
            });

            return selectedCount;
        }

        function getSelectedValues() {
            const selectedItems = document.querySelectorAll("[data-test='inventory-items-list'] .mat-checkbox-input:checked");
            const values = Array.from(selectedItems).map(item => {
                const valueText = item.closest("[data-test='inventory-items-list']").querySelector(".currency-value")?.textContent || '';
                const value = parseInput(valueText);
                const symbol = valueText.includes("€") ? "€" : "$";
                return { value, symbol };
            });

            return values;
        }

        function clickSellButton() {
            const sellButton = document.querySelector("button.mat-button-3d span [data-test='sell-number-items']")?.closest("button");
            if (sellButton) {
                sellButton.click();
            }
        }
    }
})();
