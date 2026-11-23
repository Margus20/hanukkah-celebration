// ====== INICIALIZACIÓN DE LA APLICACIÓN ======

window.addEventListener('load', function() {
  initMenorah(); // Dibuja el candelabro SVG
  setNight(1, false); // Establece la noche 1 por defecto
  recompute(); // Inicia la cuenta regresiva
});

window.addEventListener('resize', function() {
  // El SVG se escala solo, pero redibujamos por seguridad
  initMenorah();
});

// Revisar cada minuto si ya es hora de encender
setInterval(recompute, 60000);
