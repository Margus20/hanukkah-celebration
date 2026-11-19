// ====== INICIALIZACIÓN DE LA APLICACIÓN ======

window.addEventListener('load', function() {
  initShamash();
  buildZones();
  setNight(1, false);
  recompute();
});

window.addEventListener('resize', function() {
  initShamash();
  buildZones();
});

// Revisar cada minuto si ya es hora de encender
setInterval(recompute, 60000);
