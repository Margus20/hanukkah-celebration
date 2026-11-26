// ====== CÁLCULO DEL ATARDECER (Algoritmo NOAA) - BILINGÜE ======

// Calcula el día del año (1 a 366)
function dayOfYear(d) {
  const s = new Date(Date.UTC(d.y, d.m - 1, 1));
  return Math.floor((Date.UTC(d.y, d.m - 1, d.d) - s) / 864e5) + 1;
}

// Calcula la hora UTC del atardecer para una fecha y coordenadas dadas
function sunsetUTC(d, lat, lng) {
  const rad = Math.PI / 180;
  const N = dayOfYear(d);
  const L = (280.460 + 0.9856474 * N) % 360;
  const g = ((357.528 + 0.9856003 * N) % 360) * rad;
  const lambda = (L + 1.915 * Math.sin(g) + 0.020 * Math.sin(2 * g)) * rad;
  const eps = 23.4397 * rad;
  const decl = Math.asin(Math.sin(eps) * Math.sin(lambda));
  let RA = Math.atan2(Math.cos(eps) * Math.sin(lambda), Math.cos(lambda)) / rad;
  RA = ((RA % 360) + 360) % 360 / 15;
  const EoT = L / 15 - RA;
  const zenith = 90.833 * rad;
  const cosH = (Math.cos(zenith) - Math.sin(lat * rad) * Math.sin(decl)) / (Math.cos(lat * rad) * Math.cos(decl));
  if (cosH > 1 || cosH < -1) return null;
  const H = Math.acos(cosH) / rad;
  let t = 12 + H / 15 - EoT - lng / 15;
  return ((t % 24) + 24) % 24;
}

// Obtiene el desfase de la zona horaria en minutos
function tzOffsetMin(dateUTC, tz) {
  const p = new Intl.DateTimeFormat('en-US', {
    timeZone: tz, hour12: false, year: 'numeric', month: '2-digit',
    day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'
  }).formatToParts(dateUTC).reduce((a, x) => { a[x.type] = x.value; return a; }, {});
  const asUTC = Date.UTC(p.year, p.month - 1, p.day, (p.hour % 24), p.minute, p.second);
  return (asUTC - dateUTC.getTime()) / 60000;
}

// Calcula el instante exacto de encendido para una noche específica
function lightingTime(n) {
  const d = NOCHES[n - 1];
  const su = sunsetUTC(d, LOC.lat, LOC.lng);
  if (su === null) return null;
  const base = new Date(Date.UTC(d.y, d.m - 1, d.d, Math.floor(su), Math.round((su % 1) * 60)));
  const wd = new Date(Date.UTC(d.y, d.m - 1, d.d)).getUTCDay();
  const mode = document.getElementById('modeSelect').value;
  let offMin;
  if (wd === 5) offMin = (mode === 'israel') ? -40 : -18;
  else if (wd === 6) offMin = 42;
  else offMin = 30;
  return new Date(base.getTime() + offMin * 60000);
}

// Formatea una fecha en texto legible según el idioma actual
function fmtLocal(date, tz) {
  const locale = currentLang === 'en' ? 'en-US' : 'es-ES';
  return new Intl.DateTimeFormat(locale, {
    timeZone: tz, hour: '2-digit', minute: '2-digit',
    weekday: 'long', day: 'numeric', month: 'long', hour12: true
  }).format(date);
}

// Formatea solo los números de la cuenta regresiva (sin texto)
function fmtCount(ms) {
  if (ms < 0) ms = 0;
  const s = Math.floor(ms / 1000);
  const d = Math.floor(s / 86400), h = Math.floor(s % 86400 / 3600), m = Math.floor(s % 3600 / 60);
  return (d ? d + 'd ' : '') + (h ? h + 'h ' : '') + m + 'm';
}

// ====== NUEVAS FUNCIONES BILINGÜES ======

// Devuelve el texto completo de la cuenta regresiva traducido
function fmtCountdown(ms) {
  const nums = fmtCount(ms);
  return tFormat('countdown_tpl', { d: Math.floor(ms / 86400000), h: Math.floor(ms % 86400000 / 3600000), m: Math.floor(ms % 3600000 / 60000) });
}

// Devuelve el mensaje de estado completo traducido
function fmtStatusMessage(firstLightDate, tz) {
  const formatted = fmtLocal(firstLightDate, tz);
  const parts = formatted.split(', ');
  const datePart = parts.slice(0, -1).join(', ');
  const timePart = parts[parts.length - 1];
  return tFormat('status_first', { date: datePart, time: timePart });
}

// Devuelve el mensaje de "Es hora" traducido
function fmtReadyMessage() {
  return t('status_ready_full');
}
