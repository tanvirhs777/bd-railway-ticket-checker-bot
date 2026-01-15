// ==UserScript==
// @name         Bangladesh Railway – Ultimate Ticket Alert (FIXED)
// @namespace    http://tampermonkey.net/
// @version      10.4.1
// @description  WhatsApp + Telegram + Voice + Siren + Browser Alerts
// @match        https://eticket.railway.gov.bd/*
// @grant        GM_xmlhttpRequest
// @connect      api.callmebot.com
// @connect      api.telegram.org
// @run-at       document-end
// ==/UserScript==

(function () {
    'use strict';

    // ============================================
    // CONFIGURATION (Fill these in!)
    // ============================================
    const CONFIG = {
        refreshInterval: 12000,
        checkDelay: 10000,

        // WhatsApp (CallMeBot)
        enableWhatsApp: false,
        waPhone: "88017XXXXXXXX",
        waApiKey: "XXXXXX",

        // Telegram (Bot Token from @BotFather, Chat ID from @userinfobot)
        enableTelegram: false,
        tgToken: "YOUR_BOT_TOKEN",
        tgChatId: "YOUR_CHAT_ID",

        // Voice Alert
        enableVoice: true,
        voiceMessage: "Attention! Train tickets are available. Book now!"
    };

    if (localStorage.getItem("bdRailway_stopped") === "true") { showStoppedUI(); return; }

    function sendTelegram(msg) {
        if (!CONFIG.enableTelegram) return;
        const url = `https://api.telegram.org/bot${CONFIG.tgToken}/sendMessage?chat_id=${CONFIG.tgChatId}&text=${encodeURIComponent(msg)}`;
        GM_xmlhttpRequest({ method: "GET", url: url });
    }

    function sendWhatsApp(msg) {
        if (!CONFIG.enableWhatsApp) return;
        const url = `https://api.callmebot.com/whatsapp.php?phone=${CONFIG.waPhone}&text=${encodeURIComponent(msg)}&apikey=${CONFIG.waApiKey}`;
        GM_xmlhttpRequest({ method: "GET", url: url });
    }

    function playSiren() {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        setInterval(() => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(880, audioCtx.currentTime); // Fixed typo here
            osc.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 0.5);
            gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.5);
        }, 600);
    }

    function speakAlert() {
        if (!CONFIG.enableVoice) return;
        const utterance = new SpeechSynthesisUtterance(CONFIG.voiceMessage);
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
    }

    function findTickets() {
        let total = 0;
        const elements = document.querySelectorAll('div, span, b, td');
        elements.forEach(el => {
            if (el.children.length > 0) return;
            let text = el.innerText.trim().replace(/[০-৯]/g, d => "০১২৩৪৫৬৭৮৯".indexOf(d));
            const count = parseInt(text);
            if (!isNaN(count) && count > 0 && count < 1000) {
                const context = el.parentElement.innerText.toLowerCase();
                if (context.includes('available') || context.includes('seat') || context.includes('টি')) {
                    total += count;
                }
            }
        });
        return total;
    }

    function triggerUltimateAlert(count) {
        const msg = `🚨 BD RAILWAY: ${count} TICKETS FOUND!`;
        speakAlert();
        playSiren();
        sendTelegram(msg);
        sendWhatsApp(msg);

        document.body.innerHTML = `
            <div style="background:red; color:white; height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; font-family:sans-serif; position:fixed; top:0; left:0; width:100%; z-index:999999;">
                <h1 style="font-size:80px; margin:0;">${count} TICKETS FOUND!</h1>
                <p style="font-size:30px;">I am screaming so you can hear me!</p>
                <button onclick="location.reload()" style="padding:20px; font-size:30px; cursor:pointer; background:white; color:red; border:none; border-radius:10px;">I AM READY TO BOOK</button>
            </div>
        `;
        document.title = "🚨 TICKETS FOUND!! 🚨";
    }

    function init() {
        if (!window.location.href.includes("booking/train/search")) return;

        const statusPanel = document.createElement("div");
        statusPanel.id = "bot-status";
        statusPanel.style.cssText = "position:fixed; top:10px; left:10px; z-index:99999; background:black; color:lime; padding:15px; border:2px solid lime; font-family:monospace;";
        document.body.appendChild(statusPanel);

        setTimeout(() => {
            const count = findTickets();
            if (count > 0) {
                triggerUltimateAlert(count);
            } else {
                statusPanel.innerHTML = "No tickets. Refreshing...";
                setTimeout(() => location.reload(), 1500);
            }
        }, CONFIG.checkDelay);
    }

    function showStoppedUI() {
        const btn = document.createElement("button");
        btn.innerHTML = "▶️ Restart Bot";
        btn.style.cssText = "position:fixed; top:10px; left:10px; z-index:99999; padding:15px; background:green; color:white; border:none; cursor:pointer;";
        btn.onclick = () => { localStorage.removeItem("bdRailway_stopped"); location.reload(); };
        document.body.appendChild(btn);
    }

    window.addEventListener('load', init);
})();
