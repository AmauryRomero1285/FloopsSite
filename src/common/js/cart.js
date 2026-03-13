// cart.js

document.addEventListener("DOMContentLoaded", () => {

  const cartContainer = document.querySelector("#products-list");
  const emptyCartDiv = document.querySelector("#empty-cart");
  const continueWrapper = document.querySelector("#continue-shopping-wrapper");
  const checkoutButton = document.querySelector("#checkout-button");

  const subtotalValueEl = document.querySelector("#subtotal-value");
  const totalValueEl = document.querySelector("#total-value");
  const discountValueEl = document.querySelector("#discount-value");

  const itemsCountEl = document.querySelector("p.mt-2.text-slate-500");

  if (!cartContainer) return;

  function formatPrice(num) {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
    }).format(num);
  }

  // ==============================
  // Mostrar estado carrito vacío
  // ==============================
  function toggleEmptyCart(cart) {

    if (cart.length === 0) {

      emptyCartDiv.classList.remove("hidden");
      cartContainer.classList.add("hidden");
      continueWrapper.classList.add("hidden");

      if (checkoutButton) {
        checkoutButton.disabled = true;
      }

    } else {

      emptyCartDiv.classList.add("hidden");
      cartContainer.classList.remove("hidden");
      continueWrapper.classList.remove("hidden");

      if (checkoutButton) {
        checkoutButton.disabled = false;
      }

    }

  }

  // ==============================
  // Renderizar carrito
  // ==============================
  function renderCartFromStorage() {

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    cartContainer.innerHTML = "";

    toggleEmptyCart(cart);

    cart.forEach((item) => {

      const itemTotal = item.price * item.quantity;

      const card = document.createElement("div");

      card.setAttribute("data-cart-item", item.id);

      card.className =
        "rounded-2xl border bg-white dark:bg-slate-800 p-4 flex gap-4 items-center";

      card.innerHTML = `

        <img src="${item.image}" class="w-20 h-20 object-cover rounded-xl"/>

        <div class="flex-1">

          <h3 class="font-bold">
            ${item.name}
          </h3>

          <p class="text-primary font-bold mt-1">
            ${formatPrice(item.price)}
          </p>

          <div class="flex items-center gap-3 mt-2">

            <button class="qty-btn" data-action="remove">
              -
            </button>

            <span class="font-bold">
              ${item.quantity}
            </span>

            <button class="qty-btn" data-action="add">
              +
            </button>

          </div>

        </div>

        <div class="text-right">

          <p class="font-black">
            ${formatPrice(itemTotal)}
          </p>

          <button class="remove-item text-red-500 text-sm mt-2">
            Eliminar
          </button>

        </div>

      `;

      cartContainer.appendChild(card);
    });

    updateTotals();
  }

  // ==============================
  // Actualizar totales
  // ==============================
  function updateTotals() {

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    let subtotal = 0;
    let count = 0;

    cart.forEach((item) => {
      subtotal += item.price * item.quantity;
      count += item.quantity;
    });

    if (subtotalValueEl) {
      subtotalValueEl.textContent = formatPrice(subtotal);
    }

    if (totalValueEl) {
      totalValueEl.textContent = formatPrice(subtotal);
    }

    if (discountValueEl) {
      discountValueEl.textContent = formatPrice(0);
    }

    if (itemsCountEl) {
      itemsCountEl.textContent = `${count} producto${count === 1 ? "" : "s"}`;
    }

    localStorage.setItem("cartItemCount", count);
  }

  // ==============================
  // Eventos carrito
  // ==============================
cartContainer.addEventListener("click", (e) => {

  const removeBtn = e.target.closest(".remove-item");
  const qtyBtn = e.target.closest(".qty-btn");

  if (!removeBtn && !qtyBtn) return;

  const card = e.target.closest("[data-cart-item]");
  const id = card.dataset.cartItem;

  let cart = JSON.parse(localStorage.getItem("cart") || "[]");

  const item = cart.find((p) => p.id === id);

  if (removeBtn) {
    cart = cart.filter((p) => p.id !== id);
  }

  if (qtyBtn && item) {

    const action = qtyBtn.dataset.action;

    if (action === "add") item.quantity++;

    if (action === "remove" && item.quantity > 1) item.quantity--;

  }

  localStorage.setItem("cart", JSON.stringify(cart));

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  localStorage.setItem("cartItemCount", totalItems);

  document.dispatchEvent(new CustomEvent("cart:updated"));
  window.dispatchEvent(new Event("storage"));

  renderCartFromStorage();

});

  document.addEventListener("cart:updated", renderCartFromStorage);

  renderCartFromStorage();

});