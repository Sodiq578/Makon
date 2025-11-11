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

// faqat “×” bosilganda yopiladi
closeModal.addEventListener('click', () => formModal.style.display = 'none');

// tashqariga bosilganda ENDI YOPILMAYDI ❌
// window.addEventListener('click', e => {
//   if (e.target === formModal) formModal.style.display = 'none';
// });

// ================= TELEGRAM SOZLAMALARI =================
const BOT_TOKEN = '8328125073:AAEWoSW-yjqgPLq4uLPEKGyemwa2lr47x6I';
const CHAT_ID   = '-4935605017';
const TG_LINK   = 'https://t.me/megaaksiya2026';

// ================= FORM YUBORISH =================
form.addEventListener('submit', async e => {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const phone = document.getElementById('phone').value.trim();

  if (!name || !phone) {
    alert("Iltimos, ism va telefon raqamingizni kiriting!");
    return;
  }

  const text = `📢 Yangi ishtirokchi!\n👤 Ism: ${name}\n📞 Telefon: ${phone}`;

  try {
    const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ chat_id: CHAT_ID, text })
    });

    if (res.ok) {
      formModal.style.display = 'none';
      window.open(TG_LINK, '_blank'); // Kanalga avtomatik o'tish
    } else {
      alert("Xatolik yuz berdi. Qayta urinib ko‘ring.");
    }
  } catch (err) {
    alert("Internet aloqasi yo‘q yoki server bilan bog‘lanib bo‘lmadi.");
  }
});
