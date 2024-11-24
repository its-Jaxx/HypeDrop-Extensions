// ==UserScript==
// @name         Anti-idle
// @namespace    Anti-idle
// @version      1.0
// @description  Simulates phantom clicks at intervals to keep you from going idle and stopping chat.
// @author       HD Code: jaxx
// @match        https://www.hypedrop.com/*
// @icon         https://raw.githubusercontent.com/its-Jaxx/HypeDrop-Extensions/refs/heads/main/Anti-Idle/Anti-Idle.png
// @grant        none
// @downloadURL  https://raw.githubusercontent.com/its-Jaxx/HypeDrop-Extensions/refs/heads/main/Anti-Idle/Anti-Idle.user.js
// @updateURL    https://raw.githubusercontent.com/its-Jaxx/HypeDrop-Extensions/refs/heads/main/Anti-Idle/Anti-Idle.user.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function simulateInteraction() {
        let phantomElement = document.getElementById('phantom-click-target');
        if (!phantomElement) {
            phantomElement = document.createElement('div');
            phantomElement.id = 'phantom-click-target';
            phantomElement.style.position = 'absolute';
            phantomElement.style.top = '-9999px';
            phantomElement.style.left = '-9999px';
            document.body.appendChild(phantomElement);
        }

        phantomElement.click();
        console.log('Phantom click simulated at:', new Date().toLocaleTimeString());

        scheduleNextInteraction();
    }

    function scheduleNextInteraction() {
        const randomInterval = Math.floor(Math.random() * (20 - 5 + 1) + 5) * 60000;
        console.log('Next phantom click in:', randomInterval / 60000, 'minutes');
        setTimeout(simulateInteraction, randomInterval);
    }

    function startScript() {
        simulateInteraction();
    }

    startScript();

})();
