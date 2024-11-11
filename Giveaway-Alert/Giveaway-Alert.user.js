// ==UserScript==
// @name         Giveaway Alert
// @namespace    Giveaway Alert
// @version      1.0.0
// @description  Highlights multiple giveaway balances with customizable alerts, including color-formatted messages.
// @author       HD Code: jaxx
// @supportURL   https://discord.com/users/922843169480122388/
// @match        https://www.hypedrop.com/*
// @icon         https://raw.githubusercontent.com/its-Jaxx/HypeDrop-Extensions/refs/heads/main/Giveaway-Alert/Giveaway-Alert.png
// @grant        GM_addStyle
// @downloadURL  https://raw.githubusercontent.com/its-Jaxx/HypeDrop-Extensions/refs/heads/main/Giveaway-Alert/Giveaway-Alert.user.js
// @updateURL    https://raw.githubusercontent.com/its-Jaxx/HypeDrop-Extensions/refs/heads/main/Giveaway-Alert/Giveaway-Alert.user.js
// ==/UserScript==
/* global $ */

(function () {
    'use strict';

    let userSettings = {
        targetUsernames: ["jaxx"],
        winnerBalanceColor: "#3D9D43",
        enableWinnerBalanceColor: true,
        winnerUsernameColor: "#3D9D43",
        enableWinnerUsernameColor: true,
        loserBalanceColor: "#FF0000",
        enableLoserBalanceColor: true,
        loserUsernameColor: "#FF0000",
        enableLoserUsernameColor: true,
        showAlert: true,
        alertFormat: "{color:rgba(133, 95, 22, 1)}{currentTime} {color:rgba(56, 56, 56, 0.5)}| {color:#00F7FF}{targetUsername} {color:rgba(56, 56, 56, 0.7)}+{color:#00FF00}$1.00{color:default}"
    };

    const savedSettings = localStorage.getItem('giveawayHighlighterSettings');
    if (savedSettings) {
        userSettings = JSON.parse(savedSettings);
    }

    const processedGiveaways = new Set();

    GM_addStyle(`
        .custom-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 1000;
        }

        .custom-alert {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: #0000FF;
            color: #FFFFFF;
            width: 20vw;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            z-index: 1001;
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .custom-alert .message-box {
            background-color: #FFFFFF;
            color: #000000;
            padding: 10px;
            border-radius: 5px;
            max-width: 80%;
            margin-bottom: 15px;
            text-align: center;
        }

        .custom-alert .dismiss-button {
            background-color: #3085d6;
            color: #FFFFFF;
            border: none;
            padding: 10px 20px;
            font-size: 1em;
            border-radius: 5px;
            cursor: pointer;
        }

        .custom-blur {
            filter: blur(5px);
        }
    `);

    // Helper functions
    function isValidColor(color) {
        const hexPattern = /^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
        const rgbaPattern = /^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(0|1|0?\.\d+)\s*\)$/;
        return hexPattern.test(color) || rgbaPattern.test(color);
    }

    function parseUsernames(input) {
        const regex = /'([^']+)'/g;
        const matches = [];
        let match;
        while ((match = regex.exec(input)) !== null) {
            matches.push(match[1].trim());
        }
        return matches;
    }

    function formatUsernamesForDisplay(usernames) {
        return usernames.map(username => `'${username}'`).join(', ');
    }

    function parseAlertMessage(message) {
        const colorRegex = /\{color:([^}]+)\}([^]*?)(?=(\{color:[^}]+\}|\{color:default\}|$))/g;
        let parsedMessage = message;

        parsedMessage = parsedMessage.replace(colorRegex, (match, colorCode, text) => {
            return `<span style="color:${colorCode}">${text}</span>`;
        });

        parsedMessage = parsedMessage.replace(/\{color:default\}/g, '</span>');
        return parsedMessage;
    }

    function showAlert(message) {
        const overlay = document.createElement('div');
        overlay.className = 'custom-overlay';

        const alertBox = document.createElement('div');
        alertBox.className = 'custom-alert';

        const messageBox = document.createElement('div');
        messageBox.className = 'message-box';
        messageBox.innerHTML = parseAlertMessage(message);

        const dismissButton = document.createElement('button');
        dismissButton.className = 'dismiss-button';
        dismissButton.textContent = 'OK';

        alertBox.appendChild(messageBox);
        alertBox.appendChild(dismissButton);
        document.body.appendChild(overlay);
        document.body.appendChild(alertBox);

        Array.from(document.body.children).forEach(child => {
            if (child !== overlay && child !== alertBox) {
                child.classList.add('custom-blur');
            }
        });

        dismissButton.addEventListener('click', () => {
            alertBox.remove();
            overlay.remove();
            document.querySelectorAll('.custom-blur').forEach(el => {
                el.classList.remove('custom-blur');
            });
        });
    }

    function saveSettings() {
        localStorage.setItem('giveawayHighlighterSettings', JSON.stringify(userSettings));
        updateDisplay();
    }

    function formatAlertMessage(usernames) {
        const currentTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        let alertMessage = userSettings.alertFormat
            .replace('{targetUsername}', usernames.join(', '))
            .replace('{currentTime}', currentTime);

        return parseAlertMessage(alertMessage);
    }

    function createSettingsUI() {
        if (document.getElementById('giveaway-highlighter-settings-button')) {
            return;
        }

        const settingsButton = document.createElement('button');
        settingsButton.id = 'giveaway-highlighter-settings-button';
        settingsButton.textContent = 'Giveaway Highlighter Settings';
        settingsButton.style.cssText = `
            position: fixed;
            bottom: 60px;
            left: 20px;
            z-index: 10000;
            padding: 10px;
            background-color: #17224d;
            color: #fff;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        `;
        document.body.appendChild(settingsButton);

        const settingsMenu = document.createElement('div');
        settingsMenu.id = 'giveaway-highlighter-settings-modal';
        settingsMenu.style.cssText = `
            display: none;
            position: fixed;
            z-index: 10000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            overflow: auto;
            background-color: rgba(0,0,0,0.5);
        `;

        const settingsContent = document.createElement('div');
        settingsContent.style.cssText = `
            background-color: #2b2d31;
            margin: 10% auto;
            padding: 20px;
            border: 1px solid #888;
            width: 600px;
            border-radius: 8px;
            color: white;
            position: relative;
        `;

        const closeSettingsButton = document.createElement('span');
        closeSettingsButton.innerHTML = '&times;';
        closeSettingsButton.style.cssText = `
            color: white;
            position: absolute;
            top: 10px;
            right: 10px;
            font-size: 28px;
            font-weight: bold;
            cursor: pointer;
        `;
        closeSettingsButton.onclick = function() {
            settingsMenu.style.display = 'none';
        };
        settingsContent.appendChild(closeSettingsButton);

        const addRow = (labelText, inputElement) => {
            const row = document.createElement('div');
            row.style.cssText = "margin-top: 10px;";
            const label = document.createElement('label');
            label.textContent = labelText;
            label.style.color = 'white';
            row.appendChild(label);
            row.appendChild(inputElement);
            settingsContent.appendChild(row);
        };

        const targetUsernamesInput = document.createElement('input');
        targetUsernamesInput.type = 'text';
        targetUsernamesInput.value = formatUsernamesForDisplay(userSettings.targetUsernames);
        targetUsernamesInput.onchange = function() {
            const parsedUsernames = parseUsernames(targetUsernamesInput.value);
            if (parsedUsernames.length > 0) {
                userSettings.targetUsernames = parsedUsernames;
                saveSettings();
            } else {
                alert("Please enter usernames in the format: 'username1', 'username2'");
                targetUsernamesInput.value = formatUsernamesForDisplay(userSettings.targetUsernames);
            }
        };
        addRow("Target Usernames (use format: 'username1', 'username2'):", targetUsernamesInput);

        const colors = [
            { label: 'Winner Balance Color', key: 'winnerBalanceColor', toggleKey: 'enableWinnerBalanceColor' },
            { label: 'Winner Username Color', key: 'winnerUsernameColor', toggleKey: 'enableWinnerUsernameColor' },
            { label: 'Loser Balance Color', key: 'loserBalanceColor', toggleKey: 'enableLoserBalanceColor' },
            { label: 'Loser Username Color', key: 'loserUsernameColor', toggleKey: 'enableLoserUsernameColor' }
        ];

        colors.forEach(colorSetting => {
            const row = document.createElement('div');
            row.style.cssText = "margin-top: 10px; display: flex; align-items: center;";

            const label = document.createElement('label');
            label.textContent = colorSetting.label;
            label.style.color = 'white';
            row.appendChild(label);

            const input = document.createElement('input');
            input.type = 'text';
            input.value = userSettings[colorSetting.key];
            input.style.marginLeft = '10px';
            input.onchange = function() {
                const color = input.value.trim();
                if (isValidColor(color)) {
                    userSettings[colorSetting.key] = color;
                    saveSettings();
                } else {
                    alert("Invalid color format. Please use #RRGGBB or rgba(r, g, b, a).");
                    input.value = userSettings[colorSetting.key];
                }
            };
            row.appendChild(input);

            const toggle = document.createElement('input');
            toggle.type = 'checkbox';
            toggle.checked = userSettings[colorSetting.toggleKey];
            toggle.style.marginLeft = '10px';
            toggle.onchange = function() {
                userSettings[colorSetting.toggleKey] = toggle.checked;
                saveSettings();
            };
            row.appendChild(toggle);

            settingsContent.appendChild(row);
        });

        const showAlertToggle = document.createElement('input');
        showAlertToggle.type = 'checkbox';
        showAlertToggle.checked = userSettings.showAlert;
        showAlertToggle.onchange = function() {
            userSettings.showAlert = showAlertToggle.checked;
            saveSettings();
        };
        addRow("Show Alert on Win", showAlertToggle);

        const alertInput = document.createElement('input');
        alertInput.type = 'text';
        alertInput.value = userSettings.alertFormat;
        alertInput.style.width = '100%';
        alertInput.onchange = function() {
            userSettings.alertFormat = alertInput.value;
            saveSettings();
        };
        addRow("Alert Message Format", alertInput);

        const saveButtonRow = document.createElement('div');
        saveButtonRow.style.cssText = "margin-top: 20px; text-align: right;";

        const saveButton = document.createElement('button');
        saveButton.textContent = 'Save';
        saveButton.style.cssText = `
            padding: 8px 12px;
            background-color: #28a745;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        `;
        saveButton.onclick = function() {
            saveSettings();
            settingsMenu.style.display = 'none';
        };
        saveButtonRow.appendChild(saveButton);
        settingsContent.appendChild(saveButtonRow);

        settingsMenu.appendChild(settingsContent);
        document.body.appendChild(settingsMenu);

        settingsButton.onclick = function() {
            settingsMenu.style.display = 'block';
        };
    }

    createSettingsUI();

    function updateDisplay() {
        const giveawayMessages = document.querySelectorAll('.user-message.giveaway-completed');
        giveawayMessages.forEach(giveawayMessage => {
            const userContainers = giveawayMessage.querySelectorAll('.d-flex.flex-row.align-items-center');

            userContainers.forEach(container => {
                const usernameElement = container.querySelector('.px-2.ellipsis.text-center');
                const balanceElement = container.querySelector('.currency-value');

                if (usernameElement && balanceElement) {
                    const username = usernameElement.textContent.trim();
                    const isTargetUser = userSettings.targetUsernames.includes(username);

                    if (isTargetUser) {
                        if (userSettings.enableWinnerBalanceColor) balanceElement.style.color = userSettings.winnerBalanceColor;
                        if (userSettings.enableWinnerUsernameColor) usernameElement.style.color = userSettings.winnerUsernameColor;
                    } else {
                        if (userSettings.enableLoserBalanceColor) balanceElement.style.color = userSettings.loserBalanceColor;
                        if (userSettings.enableLoserUsernameColor) usernameElement.style.color = userSettings.loserUsernameColor;
                    }
                }
            });
        });
    }

    function checkGiveawayMessages() {
        const giveawayMessages = document.querySelectorAll('.user-message.giveaway-completed');
        giveawayMessages.forEach(giveawayMessage => {
            const giveawayId = giveawayMessage.getAttribute('data-giveaway-id') || giveawayMessage.innerText;

            if (processedGiveaways.has(giveawayId)) return;

            const userContainers = giveawayMessage.querySelectorAll('.d-flex.flex-row.align-items-center');
            let targetUsers = [];

            userContainers.forEach(container => {
                const usernameElement = container.querySelector('.px-2.ellipsis.text-center');
                const balanceElement = container.querySelector('.currency-value');

                if (usernameElement && balanceElement) {
                    const username = usernameElement.textContent.trim();
                    const isTargetUser = userSettings.targetUsernames.includes(username);

                    if (isTargetUser) {
                        targetUsers.push(username);
                        if (userSettings.enableWinnerBalanceColor) balanceElement.style.color = userSettings.winnerBalanceColor;
                        if (userSettings.enableWinnerUsernameColor) usernameElement.style.color = userSettings.winnerUsernameColor;
                    } else {
                        if (userSettings.enableLoserBalanceColor) balanceElement.style.color = userSettings.loserBalanceColor;
                        if (userSettings.enableLoserUsernameColor) usernameElement.style.color = userSettings.loserUsernameColor;
                    }
                }
            });

            if (userSettings.showAlert && targetUsers.length > 0) {
                showAlert(formatAlertMessage(targetUsers));
            }

            processedGiveaways.add(giveawayId);
        });
    }

    function observeGiveawayMessages() {
        const observer = new MutationObserver(checkGiveawayMessages);
        observer.observe(document.body, { childList: true, subtree: true });
    }

    observeGiveawayMessages();
})();
