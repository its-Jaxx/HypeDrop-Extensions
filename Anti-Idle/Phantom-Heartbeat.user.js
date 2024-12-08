// ==UserScript==
// @name         Phantom Heartbeat
// @namespace    Phantom Heartbeat
// @version      1.0
// @description  Simulates phantom heartbeats at intervals to keep you from going idle and stopping chat.
// @author       HD Code: jaxx
// @match        https://www.hypedrop.com/*
// @icon         https://raw.githubusercontent.com/its-Jaxx/HypeDrop-Extensions/refs/heads/main/Anti-Idle/Phantom-Heartbeat.png
// @grant        none
// @downloadURL  https://raw.githubusercontent.com/its-Jaxx/HypeDrop-Extensions/refs/heads/main/Anti-Idle/Phantom-Heartbeat.user.js
// @updateURL    https://raw.githubusercontent.com/its-Jaxx/HypeDrop-Extensions/refs/heads/main/Anti-Idle/Phantom-Heartbeat.user.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function simulateInteraction() {
        let phantomElement = document.getElementById('phantom-heartbeat-target');
        if (!phantomElement) {
            phantomElement = document.createElement('div');
            phantomElement.id = 'phantom-heartbeat-target';
            phantomElement.style.position = 'absolute';
            phantomElement.style.top = '-9999px';
            phantomElement.style.left = '-9999px';
            document.body.appendChild(phantomElement);
        }

        phantomElement.click();

        scheduleNextInteraction();
    }

    function scheduleNextInteraction() {
        const randomInterval = Math.floor(Math.random() * (16) + 5) * 60000;
        setTimeout(simulateInteraction, randomInterval);
    }

    function startScript() {
        simulateInteraction();
    }

    startScript();

})();
