# 🚂 Bangladesh Railway – Ultimate "No-Click" Alert Bot

![Platform](https://img.shields.io/badge/platform-Tampermonkey-black.svg)
![Version](https://img.shields.io/badge/version-10.8-blue.svg)

An advanced automation script for the [Bangladesh Railway E-Ticketing Portal](https://eticket.railway.gov.bd/). This version (v10.8) is optimized for **unattended operation**, featuring smart logic to bypass browser audio restrictions and avoid "Too Frequent Request" bans.

---

## 🔥 Key Features

- **🚀 Instant Alert Hijack:** When tickets are found, the page turns into a high-visibility emergency red screen.
- **🔊 Auto-Siren Logic:** Includes workarounds to trigger the alarm even if the tab hasn't been clicked.
- **🛡️ Anti-Ban Engine:** Randomized refresh intervals (15s–28s) to mimic human behavior and avoid IP blocking.
- **📱 Phone Sync:** Integrated support for Telegram and WhatsApp notifications so you can walk away from your desk.
- **🔢 Dual Language Support:** Automatically converts Bengali digits (০-৯) to English for accurate seat counting.

---

## 🛠️ Installation

1. **Install Tampermonkey:** Get the extension for [Chrome](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo) or [Firefox](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/).
2. **Create Script:** Click the Tampermonkey icon > **Create a new script**.
3. **Paste Code:** Delete the default template and paste the `script.js` content from this repo.
4. **Save:** `File` > `Save` (or `Ctrl+S`).

---

## 📢 Important: How to Enable "No-Click" Sound

Modern browsers (Chrome/Edge) block sound unless you click the page. To make the siren work **automatically** without clicking:

1. Copy this into your Chrome address bar: `chrome://settings/content/sound`
2. Under **"Allowed to play sound"**, click **Add**.
3. Type: `[*.]railway.gov.bd`
4. Click **Add** and restart your browser.

---

## ⚙️ Configuration

Open the script and edit the `CONFIG` object at the top:

```javascript
const CONFIG = {
    enableWhatsApp: true,    // Set to true
    waPhone: "88017XXXXXXXX", // Your number
    waApiKey: "XXXXXX",      // From CallMeBot

    enableTelegram: true,    // Set to true
    tgToken: "BOT_TOKEN",    // From @BotFather
    tgChatId: "CHAT_ID"      // From @userinfobot
};
