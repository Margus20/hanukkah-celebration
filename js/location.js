// ====== UBICACIÓN DEL USUARIO ======

function onCityChange() {
  const v = document.getElementById('citySelect').value;
  if (v === 'custom') {
    if (!navigator.geolocation) {
      alert('Tu tableta no soporta GPS. Elige una ciudad de la lista.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      pos => {
        LOC = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          tz: Intl.DateTimeFormat().resolvedOptions().timeZone
        };
        recompute();
      },
      () => alert('No pude leer tu GPS. Elige una ciudad de la lista.')
    );
  } else {
    LOC = CIUDADES[v];
    recompute();
  }
}
