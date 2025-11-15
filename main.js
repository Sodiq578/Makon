// ================= TIMER =================
let minutes = 1;
let seconds = 5;
const timeDisplay = document.getElementById('time');

function updateTimer() {
    let m = minutes < 10 ? '0' + minutes : minutes;
    let s = seconds < 10 ? '0' + seconds : seconds;
    timeDisplay.textContent = `${m}:${s}`;

    if (seconds > 0) {
        seconds--;
    } else {
        if (minutes > 0) {
            minutes--;
            seconds = 59;
        } else {
            clearInterval(timerInterval);
            alert("Vaqt tugadi!");
        }
    }
}

updateTimer();
const timerInterval = setInterval(updateTimer, 1000);

// ================= MODAL ELEMENTLARI =================
const openBtnHero = document.getElementById('openModalHero');
const openBtnTaqdimot = document.getElementById('openModalTaqdimot');
const formModal = document.getElementById('formModal');
const closeModal = document.getElementById('closeModal');
const form = document.getElementById('userForm');

// ================= MODAL OCHISH VA YOPISH =================
openBtnHero.addEventListener('click', () => formModal.style.display = 'flex');
openBtnTaqdimot.addEventListener('click', () => formModal.style.display = 'flex');
closeModal.addEventListener('click', () => formModal.style.display = 'none');

// ================= TELEGRAM SOZLAMALARI =================
const BOT_TOKEN = '8328125073:AAEWoSW-yjqgPLq4uLPEKGyemwa2lr47x6I';
const CHAT_ID   = '-4935605017';
const TG_LINK   = 'https://t.me/+PIWZ83zlMeo4NTQy';

// ================= GOOGLE SHEETS WEB APP URL =================
const SHEET_URL = 'https://script.google.com/macros/s/AKfycbyNKLUolZyGxfILbiRtqckjUq2t0Nfb4LxyJBYaYlbBxEq4WQNKCY7y3Ln0qou-eaFhyQ/exec';

// ================= FORM YUBORISH (TO'LIQ YANGILANGAN) =================
form.addEventListener('submit', async function(e) {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Yuborilmoqda...';
    submitBtn.disabled = true;

    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();

    if (!name || !phone) {
        alert("Iltimos, ism va telefon raqamingizni kiriting!");
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        return;
    }

    try {
        // 1. GOOGLE SHEETS GA YUBORISH
        const sheetResponse = await fetch(SHEET_URL, {
            method: 'POST',
            mode: 'no-cors',  // CORS muammosini hal qiladi
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, phone })
        });

        console.log('Google Sheets javobi:', sheetResponse);

        // 2. TELEGRAM GA YUBORISH
        const text = `Yangi ishtirokchi!\nIsm: ${name}\nTelefon: ${phone}`;
        
        const tgResponse = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: CHAT_ID, text })
        });

        const tgData = await tgResponse.json();

        if (!tgData.ok) {
            throw new Error(tgData.description || "Telegram xatosi");
        }

        // MUVAFFAQIYAT
        formModal.style.display = 'none';
        window.open(TG_LINK, '_blank');
        alert("Muvaffaqiyatli ro'yxatdan o'tdingiz!");

        form.reset();

    } catch (error) {
        console.error('XATO:', error);
        alert("Xatolik yuz berdi: " + error.message);
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
});

// ================= TEST FUNKSIYASI (Console orqali sinash uchun) =================
window.testForm = async function() {
    const fakeName = "Test User " + Date.now();
    const fakePhone = "+9989" + Math.floor(Math.random() * 10000000);

    try {
        await fetch(SHEET_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: fakeName, phone: fakePhone })
        });

        alert(`TEST MUVOFFAQIYATLI!\nIsm: ${fakeName}\nTelefon: ${fakePhone}\nGoogle Sheets da ko'ring!`);
    } catch (err) {
        alert("TEST XATOLIK: " + err.message);
    }
};