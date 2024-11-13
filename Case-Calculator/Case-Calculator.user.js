// ==UserScript==
// @name         Case Calculator
// @namespace    Case Calculator
// @version      1.0.1
// @description  Calculates expected profit or loss when opening multiple lootboxes.
// @author       HD Code: jaxx
// @match        https://www.hypedrop.com/*
// @icon         https://raw.githubusercontent.com/its-Jaxx/HypeDrop-Extensions/refs/heads/main/Case-Calculator/Case-Calculator.png
// @grant        none
// @downloadURL  https://raw.githubusercontent.com/its-Jaxx/HypeDrop-Extensions/refs/heads/main/Case-Calculator/Case-Calculator.user.js
// @updateURL    https://raw.githubusercontent.com/its-Jaxx/HypeDrop-Extensions/refs/heads/main/Case-Calculator/Case-Calculator.user.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let currentUrl = window.location.href;

    function initCalculator() {
        let existingButton = document.getElementById('calculate-profit-button');
        if (existingButton) {
            existingButton.remove();
        }

        waitForElement('div.d-flex.flex-wrap.align-items-center.gap-1.ng-star-inserted', (targetElement) => {
            if (!document.getElementById('calculate-profit-button')) {
                const buttonContainer = document.createElement('div');
                buttonContainer.style.display = 'flex';
                buttonContainer.style.alignItems = 'center';
                buttonContainer.style.marginLeft = '10px';

                const calculateProfitButton = document.createElement('div');
                calculateProfitButton.style.width = '18px';
                calculateProfitButton.style.height = '18px';
                calculateProfitButton.style.cursor = 'pointer';
                calculateProfitButton.style.display = 'flex';
                calculateProfitButton.style.alignItems = 'center';
                calculateProfitButton.style.justifyContent = 'center';
                calculateProfitButton.style.marginRight = '8px';
                calculateProfitButton.style.borderRadius = '2px';
                calculateProfitButton.style.position = 'relative';
                calculateProfitButton.id = 'calculate-profit-button';

                calculateProfitButton.innerHTML = `
                    <svg height="64px" width="64px" version="1.1" id="Layer_1"
                xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 512 512" xml:space="preserve" fill="#000000">
                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                    <path style="fill:#FFD782;" d="M35.31,0h176.552c19.501,0,35.31,15.809,35.31,35.31v176.552c0,19.501-15.809,35.31-35.31,35.31
                H35.31c-19.501,0-35.31-15.809-35.31-35.31V35.31C0,15.809,15.809,0,35.31,0z"></path>
                <path style="fill:#FFFFFF;" d="M176.552,105.931h-35.31v-35.31c0-9.751-7.905-17.655-17.655-17.655s-17.655,7.904-17.655,17.655
                v35.31h-35.31c-9.75,0-17.655,7.904-17.655,17.655c0,9.75,7.905,17.655,17.655,17.655h35.31v35.31
                c0,9.75,7.905,17.655,17.655,17.655s17.655-7.905,17.655-17.655v-35.31h35.31c9.75,0,17.655-7.905,17.655-17.655
                C194.207,113.835,186.302,105.931,176.552,105.931z"></path>
                <path style="fill:#FFD782;" d="M35.31,264.828h176.552c19.501,0,35.31,15.809,35.31,35.31V476.69c0,19.501-15.809,35.31-35.31,35.31
                H35.31C15.809,512,0,496.191,0,476.69V300.138C0,280.637,15.809,264.828,35.31,264.828z"></path>
                <path style="fill:#FFFFFF;" d="M148.554,388.414l24.968-24.968c6.895-6.895,6.895-18.073,0-24.968
                c-6.895-6.894-18.073-6.895-24.968,0l-24.968,24.967l-24.968-24.968c-6.895-6.895-18.073-6.895-24.968,0
                c-6.895,6.895-6.895,18.073,0,24.968l24.968,24.969l-24.968,24.968c-6.895,6.894-6.895,18.073,0,24.968
                c6.895,6.894,18.073,6.894,24.968,0l24.968-24.968l24.968,24.968c6.895,6.894,18.073,6.894,24.968,0
                c6.895-6.895,6.895-18.073,0-24.968L148.554,388.414z"></path>
                <path style="fill:#FFD782;" d="M300.138,0H476.69C496.191,0,512,15.809,512,35.31v176.552c0,19.501-15.809,35.31-35.31,35.31
                H300.138c-19.501,0-35.31-15.809-35.31-35.31V35.31C264.828,15.809,280.637,0,300.138,0z"></path>
                <path style="fill:#FFFFFF;" d="M335.448,105.931h105.931c9.751,0,17.655,7.904,17.655,17.655l0,0
                c0,9.751-7.904,17.655-17.655,17.655H335.448c-9.751,0-17.655-7.904-17.655-17.655l0,0
                C317.793,113.835,325.697,105.931,335.448,105.931z"></path>
                <path style="fill:#D7DEED;" d="M300.138,264.828H476.69c19.501,0,35.31,15.809,35.31,35.31V476.69
                c0,19.501-15.809,35.31-35.31,35.31H300.138c-19.501,0-35.31-15.809-35.31-35.31V300.138
                C264.828,280.637,280.637,264.828,300.138,264.828z"></path>
                <g>
                    <path style="fill:#FFFFFF;" d="M335.448,335.448h105.931c9.751,0,17.655,7.904,17.655,17.655l0,0
                c0,9.751-7.904,17.655-17.655,17.655H335.448c-9.751,0-17.655-7.904-17.655-17.655l0,0
                C317.793,343.352,325.697,335.448,335.448,335.448z"></path>
                <path style="fill:#FFFFFF;" d="M335.448,406.069h105.931c9.751,0,17.655,7.904,17.655,17.655l0,0
                c0,9.751-7.904,17.655-17.655,17.655H335.448c-9.751,0-17.655-7.904-17.655-17.655l0,0
                C317.793,413.973,325.697,406.069,335.448,406.069z"></path>
                </g></g></svg>`
                ;

                const calculateProfitLabel = document.createElement('span');
                calculateProfitLabel.innerText = 'Calculate Profit';
                calculateProfitLabel.style.color = '#8e8e99';
                calculateProfitLabel.style.fontSize = '0.75rem';
                calculateProfitLabel.style.fontWeight = '600';
                calculateProfitLabel.style.fontFamily = 'StagSans, sans-serif';
                calculateProfitLabel.style.textTransform = 'uppercase';

                buttonContainer.appendChild(calculateProfitButton);
                buttonContainer.appendChild(calculateProfitLabel);

                targetElement.appendChild(buttonContainer);

                calculateProfitButton.addEventListener('click', function() {
                    calculateProfit();
                });
            }
        });
    }

    function waitForElement(selector, callback) {
        const observer = new MutationObserver((mutations, me) => {
            const element = document.querySelector(selector);
            if (element) {
                callback(element);
                me.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    const urlObserver = new MutationObserver(() => {
        if (currentUrl !== window.location.href) {
            currentUrl = window.location.href;
            console.log('URL changed:', currentUrl);
            initCalculator();
        }
    });

    urlObserver.observe(document.body, { childList: true, subtree: true });

    initCalculator();

    function calculateProfit() {
        try {
            console.log('Lootbox Profit Calculator: Calculation started.');

            let lootboxNameElement = document.querySelector('div.title');
            let openForElement = document.querySelector('button.mat-flat-button cw-pretty-balance span.currency-value');

            if (!lootboxNameElement || !openForElement) {
                alert('Required elements not found. Please ensure you are on the correct page.');
                return;
            }

            let lootboxName = lootboxNameElement.innerText.trim();
            let lootboxCostText = openForElement.innerText.trim();
            let lootboxCost = parseFloat(lootboxCostText.replace(/[€$]/g, '').replace(/,/g, '').replace(/\s/g, ''));

            let rateElements = document.querySelectorAll('div.rate');

            if (rateElements.length === 0) {
                alert('No item percentages found. Please ensure you are on the correct page.');
                return;
            }

            let items = [];
            rateElements.forEach(function(rateElement) {
                let percentageText = rateElement.innerText.trim();
                let percentage = parseFloat(percentageText.replace('%', '').replace(/,/g, '').replace(/\s/g, ''));

                let valueElement = rateElement.closest('.ng-star-inserted').querySelector('span.currency-value[data-test="value"]');
                if (!valueElement) {
                    valueElement = rateElement.parentElement.querySelector('span.currency-value[data-test="value"]');
                }

                if (valueElement) {
                    let valueText = valueElement.innerText.trim();
                    let value = parseFloat(valueText.replace(/[€$]/g, '').replace(/,/g, '').replace(/\s/g, ''));

                    if (!isNaN(percentage) && !isNaN(value)) {
                        items.push({
                            percentage: percentage,
                            value: value
                        });
                    }
                }
            });

            if (items.length === 0) {
                alert('No items were found for calculation. Please check the selectors or contact support.');
                return;
            }

            let quantity = 100;

            let expectedReturnPerLootbox = 0;
            let variancePerLootbox = 0;

            items.forEach(function(item) {
                let probability = item.percentage / 100;
                let expectedValue = item.value * probability;
                let expectedSquare = (item.value * item.value) * probability;

                expectedReturnPerLootbox += expectedValue;
                variancePerLootbox += expectedSquare;
            });

            variancePerLootbox -= (expectedReturnPerLootbox * expectedReturnPerLootbox);

            let expectedProfitPerLootbox = expectedReturnPerLootbox - lootboxCost;

            let totalExpectedProfit = expectedProfitPerLootbox * quantity;
            let totalVariance = variancePerLootbox * quantity;

            let standardDeviation = Math.sqrt(totalVariance);

            let totalValue = (lootboxCost * quantity).toFixed(2);

            let zScore = 1.96;
            let marginOfError = zScore * standardDeviation;

            let lowerBound = totalExpectedProfit - marginOfError;
            let upperBound = totalExpectedProfit + marginOfError;

            let profit = totalExpectedProfit.toFixed(2);
            let lowerBoundFormatted = lowerBound.toFixed(2);
            let upperBoundFormatted = upperBound.toFixed(2);
            let profit_nr = totalExpectedProfit;
            let totalValue_nr = lootboxCost * quantity;

            let difference = ((profit_nr / totalValue_nr) * 100).toFixed(2);
            difference = Math.abs(difference);

            let profitDisplay = `${Math.abs(profit)}`;
            if (profit_nr < 0) {
                profitDisplay = '-' + profitDisplay;
            } else {
                profitDisplay = '+' + profitDisplay;
            }

            let currencySymbol = lootboxCostText.includes('€') ? '€' : '$';
            profitDisplay = currencySymbol + profitDisplay;

            let chanceOfProfit = 100;
            items.forEach(function(item) {
                if (item.value < lootboxCost) {
                    chanceOfProfit -= item.percentage;
                }
            });
            chanceOfProfit = chanceOfProfit.toFixed(2);

            alert(`${lootboxName} - ${quantity}x
Total Cost: ${currencySymbol}${totalValue}
Expected Profit: ${profitDisplay}
Expected Profit Range (95% CI): ${currencySymbol}${lowerBoundFormatted} to ${currencySymbol}${upperBoundFormatted}
Difference: ${difference}%
${chanceOfProfit}% Chance of profit`);

            console.log('Lootbox Profit Calculator: Calculation completed.');

        } catch (error) {
            console.error('An error occurred in the Lootbox Profit Calculator script:', error);
            alert('An error occurred during the calculation. Please check the console for details.');
        }
    }

})();
