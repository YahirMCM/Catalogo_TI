const carrito = document.getElementById('emoji_carrito');
const barraCarro = document.getElementById('barrita');
const cerrarCarro = document.getElementById('cerrar_carro');
const carritoOverlay = document.getElementById('capa_carro');

carrito.addEventListener('click', () => {
  barraCarro.classList.add('open');
  carritoOverlay.classList.add('open');
});

cerrarCarro.addEventListener('click', () => {
  barraCarro.classList.remove('open');
  carritoOverlay.classList.remove('open');
});

carritoOverlay.addEventListener('click', () => {
  barraCarro.classList.remove('open');
  carritoOverlay.classList.remove('open');
});