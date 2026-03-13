// product-utils.js

function formatPrice(num) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
}

// ==============================
// Crear card de producto
// ==============================
function createProductCard(product) {
  const {
    id,
    name,
    price,
    unit = "unidad",
    image,
    category = "Categoría",
  } = product;

  const formattedPrice = formatPrice(price);

  const template = document.createElement("template");

  template.innerHTML = `
  <div
    class="bg-primary dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-700 hover:shadow-xl transition-all group flex flex-col h-full"
    data-product-id="${id}"
    data-name="${name}"
    data-price="${price}"
    data-unit="${unit}"
    data-image="${image}"
    data-category="${category}"
  >

    <div class="relative h-48 bg-slate-100">
      <img src="${image}" class="w-full h-full object-cover"/>
    </div>

    <div class="p-4 flex flex-col flex-1">

      <p class="text-xs text-slate-400 mb-1">${category}</p>

      <h3 class="font-bold mb-2">
        ${name}
      </h3>

      <div class="mt-auto">

        <span class="text-xl font-bold">
          ${formattedPrice}
        </span>

        <button
          class="add-to-cart-btn w-full mt-3 py-3 bg-slate-100 hover:bg-primary hover:text-white rounded-xl font-bold flex justify-center gap-2"
        >
          <span class="material-symbols-outlined">add_shopping_cart</span>
          Añadir
        </button>

      </div>

    </div>

  </div>
  `;

  return template.content.firstElementChild;
}

// ==============================
// Renderizar productos
// ==============================
function renderProducts(containerSelector, products) {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  container.innerHTML = "";

  products.forEach((product) => {
    const card = createProductCard(product);
    container.appendChild(card);
  });
}

// ==============================
// Añadir producto al carrito
// ==============================
function handleAddToCart(btn) {
  const card = btn.closest("[data-product-id]");
  if (!card) return;

  const product = {
    id: card.dataset.productId,
    name: card.dataset.name,
    price: parseFloat(card.dataset.price),
    image: card.dataset.image,
    quantity: 1,
  };

  let cart = JSON.parse(localStorage.getItem("cart") || "[]");

  const existing = cart.find((item) => item.id === product.id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push(product);
  }

  localStorage.setItem("cart", JSON.stringify(cart));

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  localStorage.setItem("cartItemCount", totalItems);

  const original = btn.innerHTML;

  btn.innerHTML = "✔ Añadido";
  btn.classList.add("bg-green-600", "text-white");

  setTimeout(() => {
    btn.innerHTML = original;
    btn.classList.remove("bg-green-600", "text-white");
  }, 1200);

  document.dispatchEvent(new CustomEvent("cart:updated"));
}

// ==============================
// Delegación de eventos
// ==============================
document.addEventListener("click", (e) => {
  const btn = e.target.closest(".add-to-cart-btn");

  if (!btn) return;

  e.preventDefault();
  e.stopPropagation();

  handleAddToCart(btn);
});