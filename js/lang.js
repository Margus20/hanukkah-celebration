// ====== DICCIONARIO DE IDIOMAS ======
const translations = {
  es: {
    title: "Janucá - Festival de las Luces",
    bigDate: "Janucá 2026 comienza el viernes 4 de diciembre",
    countdown_default: "Calculando...",
    status_wait: "Espera...",
    status_ready: "¡Es hora de encender las velas!",
    city_label: "País / Ciudad:",
    mode_label: "Modo:",
    mode_diaspora: "Diáspora (18 min)",
    mode_israel: "Israel (40 min)",
    btn_auto: "🔥 Encender automático",
    btn_demo: "🎓 Demo",
    btn_guide: "📖 Guía",
    btn_reset: "🔄 Reiniciar",
    guide_default: "Selecciona un día o usa la guía para aprender a encender las velas.",
    menorah_tip: "Toca cualquier vela para encenderla",
    blessings_title: "Bendiciones del encendido",
    blessing1_trans: "Baruj Atá Adonai... que nos santificó con Sus mandamientos y nos ordenó encender la vela de Janucá.",
    blessing2_trans: "She asá nisim la avotenu... que hizo milagros a nuestros padres en aquellos días, en esta época.",
    blessing3_trans: "Shehejeianu... que nos dio vida y nos hizo llegar a este momento.",
    tag_night1: "Solo Noche 1",
    guide_panel_title: "Guía completa de Janucá",
    guide_p1: "Dura 8 noches, del 25 de Kislev. En 2026 va del atardecer del viernes 4 al anochecer del sábado 12 de diciembre.",
    guide_p2: "Se enciende una vela más cada noche (8 en total) más el Shamash, la vela piloto que se enciende primero y se usa para encender las demás.",
    guide_p3: "La hora es al anochecer (unos 30 min tras el atardecer); en viernes se enciende antes del atardecer (18 min, o 40 en Israel) por Shabat, y en sábado después de la salida de Shabat.",
    guide_p4: "Orden: enciende el Shamash, di las bendiciones, y enciende la vela nueva primero, de izquierda a derecha.",
    donate_title: "Tzedaká · Apoyar este proyecto",
    donate_desc: "Tu contribución voluntaria ayuda a mantener y mejorar esta herramienta educativa y espiritual.",
    kofi_title: "☕ Ko-fi",
    kofi_desc: "Apoya este proyecto con una donación segura y voluntaria:",
    kofi_btn: "☕ Invítame un café en Ko-fi",
    binance_title: "🪙 Binance Pay (QR)",
    binance_desc: "Escanea con la app de Binance para pagar:",
    binance_note: "Red: BNB Smart Chain (BEP20) · USDT o BNB",
    // Mensajes dinámicos
    toast_copied: "¡Copiado al portapapeles! 📋",
    toast_max_candles: "Ya encendiste todas las velas de esta noche",
    toast_success: "¡Felicidades! Velas encendidas correctamente 🕎✨",
    guide_step1: "📖 <strong>Guía iniciada.</strong> Primero el Shamash, luego las bendiciones y después las velas de una en una.",
    guide_step2: "<strong>Paso 1:</strong> La vela piloto central (Shamash) ya está encendida. Es la fuente de fuego.",
    guide_step3: "<strong>Paso 2:</strong> Recita las bendiciones (mira las tarjetas de abajo).",
    guide_step4: "<strong>Paso 3:</strong> Toca la vela que brilla en dorado. La vela nueva siempre se enciende primero.",
    guide_done: "✅ ¡Listo! Encendiste las velas en el orden correcto. 🕎"
  },
  en: {
    title: "Hanukkah - Festival of Lights",
    bigDate: "Hanukkah 2026 begins on Friday, December 4th",
    countdown_default: "Calculating...",
    status_wait: "Please wait...",
    status_ready: "It's time to light the candles!",
    city_label: "Country / City:",
    mode_label: "Mode:",
    mode_diaspora: "Diaspora (18 min)",
    mode_israel: "Israel (40 min)",
    btn_auto: "🔥 Auto Light",
    btn_demo: "🎓 Demo",
    btn_guide: "📖 Guide",
    btn_reset: "🔄 Reset",
    guide_default: "Select a night or use the guide to learn how to light the candles.",
    menorah_tip: "Tap any candle to light it",
    blessings_title: "Lighting Blessings",
    blessing1_trans: "Baruch Atah Adonai... who sanctified us with His commandments and commanded us to light the Hanukkah candle.",
    blessing2_trans: "She'asa nisim la'avotenu... who performed miracles for our ancestors in those days, at this time.",
    blessing3_trans: "Shehecheyanu... who has given us life, sustained us, and brought us to this moment.",
    tag_night1: "Night 1 Only",
    guide_panel_title: "Complete Hanukkah Guide",
    guide_p1: "It lasts 8 nights, from the 25th of Kislev. In 2026, it runs from sunset on Friday, Dec 4th to nightfall on Saturday, Dec 12th.",
    guide_p2: "One additional candle is lit each night (8 in total) plus the Shamash, the helper candle lit first and used to light the others.",
    guide_p3: "Lighting is at nightfall (about 30 min after sunset); on Friday, it is lit before sunset (18 min, or 40 in Israel) due to Shabbat, and on Saturday after Shabbat ends.",
    guide_p4: "Order: light the Shamash, say the blessings, and light the newest candle first, from left to right.",
    donate_title: "Tzedakah · Support this project",
    donate_desc: "Your voluntary contribution helps maintain and improve this educational and spiritual tool.",
    kofi_title: "☕ Ko-fi",
    kofi_desc: "Support this project with a safe, voluntary donation:",
    kofi_btn: "☕ Buy me a coffee on Ko-fi",
    binance_title: "🪙 Binance Pay (QR)",
    binance_desc: "Scan with the Binance app to pay:",
    binance_note: "Network: BNB Smart Chain (BEP20) · USDT or BNB",
    // Dynamic messages
    toast_copied: "Copied to clipboard! 📋",
    toast_max_candles: "You have already lit all candles for tonight",
    toast_success: "Congratulations! Candles lit correctly 🕎✨",
    guide_step1: "📖 <strong>Guide started.</strong> First the Shamash, then the blessings, then the candles one by one.",
    guide_step2: "<strong>Step 1:</strong> The central helper candle (Shamash) is already lit. It is the source of fire.",
    guide_step3: "<strong>Step 2:</strong> Recite the blessings (see the cards below).",
    guide_step4: "<strong>Step 3:</strong> Tap the candle glowing in gold. The newest candle is always lit first.",
    guide_done: "✅ Done! You lit the candles in the correct order. 🕎"
  }
};

// Estado actual del idioma (guardado en el navegador o español por defecto)
let currentLang = localStorage.getItem('hanukkah_lang') || 'es';

function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('hanukkah_lang', lang);
  document.documentElement.lang = lang;
  updateTexts();
  updateLangButtons();
}

function updateTexts() {
  const t = translations[currentLang];
  // Actualizar todos los elementos con atributo data-i18n
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key]) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = t[key];
      } else {
        el.innerHTML = t[key]; // innerHTML permite usar etiquetas <strong> o <em>
      }
    }
  });
  
  // Actualizar opciones de select manualmente
  document.querySelector('option[value="diáspora"]').textContent = t.mode_diaspora;
  document.querySelector('option[value="israel"]').textContent = t.mode_israel;
}

function updateLangButtons() {
  document.getElementById('btn-es').classList.toggle('active', currentLang === 'es');
  document.getElementById('btn-en').classList.toggle('active', currentLang === 'en');
}

// Función auxiliar para obtener texto dinámico en el idioma actual
function t(key) {
  return translations[currentLang][key] || key;
}

// Inicializar idioma al cargar
document.addEventListener('DOMContentLoaded', () => {
  updateTexts();
  updateLangButtons();
});
