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
const openBtnHero     = document.getElementById('openModalHero');
const openBtnTaqdimot = document.getElementById('openModalTaqdimot');
const formModal       = document.getElementById('formModal');
const closeModal      = document.getElementById('closeModal');
const form            = document.getElementById('userForm');

openBtnHero.addEventListener('click', () => formModal.style.display = 'flex');
openBtnTaqdimot.addEventListener('click', () => formModal.style.display = 'flex');
closeModal.addEventListener('click', () => formModal.style.display = 'none');

// ================= SOZLAMALAR =================
const BOT_TOKEN = '8328125073:AAEWoSW-yjqgPLq4uLPEKGyemwa2lr47x6I';
const CHAT_ID   = '-4935605017';
const TG_LINK   = 'https://t.me/+PIWZ83zlMeo4NTQy';
const SHEET_URL = 'https://script.google.com/macros/s/AKfycbxska3IZ_ItzB1MVVxizY28ck_CPkP2WuYb-onK5R6o2ecxz5oaTBnnrKkKUgc2DeA/exec';

// ================= FORM YUBORISH =================
form.addEventListener('submit', async function(e) {
  e.preventDefault();

  let phone = document.getElementById('phone').value;

  // 🔥 PROBELNI saqlash uchun
  // Bo‘sh joylar → "~" belgiga almashtiriladi
  let cleanPhone = phone.replace(/ /g, "~");

  // Agar butunlay bo'sh bo'lsa
  if (cleanPhone.trim() === "") cleanPhone = "Boshl joy qoldirilgan";

  const submitBtn = form.querySelector('.submit-btn');
  const originalText = submitBtn.textContent;
  submitBtn.textContent = 'Yuborilmoqda...';
  submitBtn.disabled = true;

  const popup = window.open(TG_LINK, '_blank');
  if (!popup) {
    alert("Popup bloklandi! Brauzerda ruxsat bering.");
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
    return;
  }

  try {
    // Google Sheetsga yuborish
    await fetch(SHEET_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: cleanPhone })
    });

    // Telegramga yuborish
    const text = `Yangi lid!\nTelefon: ${cleanPhone}\nVaqt: ${new Date().toLocaleString('uz-UZ')}`;
    const tgRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: CHAT_ID, text })
    });

    const tgData = await tgRes.json();
    if (!tgData.ok) throw new Error(tgData.description);

    formModal.style.display = 'none';
    form.reset();

  } catch (error) {
    alert("Internetda muammo. Qayta urinib ko‘ring.");
    popup.close();
  } finally {
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }
});
