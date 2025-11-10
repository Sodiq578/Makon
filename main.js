// ================= TIMER =================
let minutes = 3;
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
const successModal = document.getElementById('successModal');
const closeModal = document.getElementById('closeModal');
const form = document.getElementById('userForm');
const subscribeBtn = document.getElementById('subscribeLink');

// ================= MODAL OCHISH VA YOPISH =================
openBtnHero.addEventListener('click', () => formModal.style.display = 'flex');
openBtnTaqdimot.addEventListener('click', () => formModal.style.display = 'flex');

closeModal.addEventListener('click', () => formModal.style.display = 'none');

window.addEventListener('click', e => {
  if (e.target === formModal) formModal.style.display = 'none';
  if (e.target === successModal) successModal.style.display = 'none';
});


// ================= TELEGRAM SOZLAMALARI =================
const BOT_TOKEN = '8328125073:AAEWoSW-yjqgPLq4uLPEKGyemwa2lr47x6I';
const CHAT_ID   = '-4935605017';
const TG_LINK   = 'https://t.me/+3URgcHWZZzE4Njcy';

// LocalStorage orqali kunlik yuborishni nazorat qilamiz
let message_id = localStorage.getItem('tg_message_id');
let lastSent   = localStorage.getItem('tg_last_sent'); // YYYY-MM-DD

// ================= FORM YUBORISH =================
form.addEventListener('submit', async e => {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const phone = document.getElementById('phone').value.trim();

  if (!name) {
    alert("Iltimos, ismingizni kiriting!");
    return;
  }

  const text = `Yangi a'zo!\nIsmi: ${name}\nTelefon: ${phone}`;
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  try {
    if (lastSent !== today) {
      // Xabarni birinchi marta yuborish
      const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({chat_id: CHAT_ID, text})
      });
      const data = await res.json();
      if(res.ok) {
        message_id = data.result.message_id;
        localStorage.setItem('tg_message_id', message_id);
        localStorage.setItem('tg_last_sent', today);
        formModal.style.display = 'none';
        successModal.style.display = 'flex';
      } else {
        alert("Xatolik yuz berdi. Qayta urinib ko‘ring.");
      }
    } else if (message_id) {
      // Kun ichida yangi ma'lumot kelgan bo'lsa xabarni edit qilish
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/editMessageText`, {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({chat_id: CHAT_ID, message_id: parseInt(message_id), text})
      });
      formModal.style.display = 'none';
      successModal.style.display = 'flex';
    } else {
      alert("Bugun xabar yuborildi.");
    }
  } catch (err) {
    alert("Internet aloqasi yo‘q.");
  }
});

// ================= OBUNA TUGMASI =================
subscribeBtn.addEventListener('click', () => window.open(TG_LINK, '_blank'));
