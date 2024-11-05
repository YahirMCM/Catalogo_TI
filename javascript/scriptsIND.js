const carrito = document.getElementById('emoji_carrito');
const barraCarro = document.getElementById('barrita');
const cerrarCarro = document.getElementById('cerrar_carro');
const carritoOverlay = document.getElementById('capa_carro');

// Con esto abrimos la barra
carrito.addEventListener('click', () => {
  barraCarro.classList.add('open');
  carritoOverlay.classList.add('open');
});

// Acá se cierra
cerrarCarro.addEventListener('click', () => {
  barraCarro.classList.remove('open');
  carritoOverlay.classList.remove('open');
});

// Acá se cierra por si el usuario es dummie
carritoOverlay.addEventListener('click', () => {
  barraCarro.classList.remove('open');
  carritoOverlay.classList.remove('open');
});
