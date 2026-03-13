// Funciones de ayuda 
function updateCartBadge() {
  const badge = document.getElementById('cart-count-badge');
  if (!badge) return;

  const count = parseInt(localStorage.getItem('cartItemCount') || '0', 10);
  
  if (count > 0) {
    badge.textContent = count > 99 ? '99+' : count;
    badge.classList.remove('hidden');
  } else {
    badge.classList.add('hidden');
  }
}

// Ejecutar cuando el header esté cargado
document.addEventListener('header:loaded', updateCartBadge);
document.addEventListener('cart:updated', updateCartBadge);

// Intentar al cargar (por si el header ya está presente)
document.addEventListener('DOMContentLoaded', updateCartBadge);

// Desde otras pestañas
window.addEventListener('storage', (e) => {
  if (e.key === 'cartItemCount') updateCartBadge();
});