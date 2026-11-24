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


// ====== MODAL DE DONACIÓN (TZEDAKÁ) ======

function openDonateModal() {
  document.getElementById('donateModal').classList.add('show');
}

function closeDonateModal(event) {
  // Cierra si se hace clic en el fondo oscuro o en la X
  if (!event || event.target.id === 'donateModal' || event.target.classList.contains('modal-close')) {
    document.getElementById('donateModal').classList.remove('show');
  }
}

function copyPayPal() {
  const email = 'marcosgustavoyhvh@gmail.com';
  
  // Intenta copiar al portapapeles
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(email).then(() => {
      showToast('Correo de PayPal copiado al portapapeles 📋', 'success');
    }).catch(() => {
      showToast('Por favor, copia manualmente: ' + email, 'warning');
    });
  } else {
    showToast('Por favor, copia manualmente: ' + email, 'warning');
  }
}
