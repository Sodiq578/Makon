  // ================= MODAL =================
  const openBtnHero = document.getElementById('openModalHero');
  const formModal = document.getElementById('formModal');
  const closeModal = document.getElementById('closeModal');
  const form = document.getElementById('userForm');

  openBtnHero.addEventListener('click', () => formModal.style.display = 'flex');
  closeModal.addEventListener('click', () => formModal.style.display = 'none');

  // ================= SOZLAMALAR =================
  const BOT_TOKEN = '8328125073:AAEWoSW-yjqgPLq4uLPEKGyemwa2lr47x6I';
  const CHAT_ID = '-4935605017';
  const TG_LINK = 'https://t.me/+PIWZ83zlMeo4NTQy';
  const SHEET_URL = 'https://script.google.com/macros/s/AKfycbxska3IZ_ItzB1MVVxizY28ck_CPkP2WuYb-onK5R6o2ecxz5oaTBnnrKkKUgc2DeA/exec';

  // ================= FORM YUBORISH =================
  form.addEventListener('submit', async function(e){
    e.preventDefault();

    let phone = document.getElementById('phone').value.trim();

    // Raqam va ruxsat etilgan belgilarni qoldirish
    phone = phone.replace(/[^0-9+()\-\s]/g, '');
    const digits = phone.replace(/\D/g, '');

    if (!digits.match(/\d/) || digits.length < 9 || (!digits.startsWith('998') && !digits.startsWith('9'))) {
      alert("Iltimos, to'g'ri telefon raqamingizni kiriting!");
      return;
    }

    const cleanPhone = digits.startsWith('998') ? '+' + digits : '+998' + digits.slice(1);

    const submitBtn = form.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Yuborilmoqda...';
    submitBtn.disabled = true;

    // =================== POPUP FAOL ===================
    // Popup faqat foydalanuvchi click eventida ochiladi
    const popup = window.open(TG_LINK, '_blank');
    if (!popup) {
      alert("Popup bloklandi! Iltimos, brauzer sozlamalarida ruxsat bering.");
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      return;
    }

    try {
      // 1. Google Sheets'ga yuborish
      await fetch(SHEET_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({phone: cleanPhone})
      });

      // 2. Telegram botga yuborish
      const text = `Yangi lid!\nTelefon: ${cleanPhone}\nVaqt: ${new Date().toLocaleString('uz-UZ')}`;
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({chat_id: CHAT_ID, text})
      });

      // 3. Modalni yopish va forma reset
      formModal.style.display = 'none';
      form.reset();

    } catch(err){
      console.error(err);
      alert("Internet bilan muammo. Qayta urinib ko‘ring.");
      popup.close();
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }

  });