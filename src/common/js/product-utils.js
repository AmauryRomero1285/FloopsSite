// product-utils.js

// 1. Función para cargar el template externo e insertarlo en el DOM
async function loadExternalTemplate(path) {
  try {
    const response = await fetch(path);
    const text = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'text/html');
    const template = doc.querySelector('#product-card-template');
    
    if (template) {
      document.body.appendChild(template);
      return true;
    }
    return false;
  } catch (err) {
    console.error("Error cargando el archivo del template:", err);
    return false;
  }
}

function formatPrice(num) {
  return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(num);
}

function createProductCard(product) {
  const template = document.getElementById("product-card-template");
  if (!template) return null;

  const clone = template.content.cloneNode(true);
  const card = clone.querySelector(".product-card");

  // Mapeo de clases
  const imgElement = card.querySelector(".product-img img");
  if (imgElement) imgElement.src = product.image;
  
  card.querySelector(".category").textContent = product.category || "General";
  card.querySelector(".name").textContent = product.name;
  card.querySelector(".price").textContent = formatPrice(product.price);
  card.querySelector(".unit").textContent = `/ ${product.unit || 'unidad'}`;

  // Dataset para el carrito
  card.dataset.productId = product.id;
  card.dataset.name = product.name;
  card.dataset.price = product.price;

  return card;
}

function renderProducts(containerSelector, products) {
  const container = document.querySelector(containerSelector);
  if (!container) return;
  container.innerHTML = "";
  products.forEach(p => {
    const card = createProductCard(p);
    if (card) container.appendChild(card);
  });
}

// 2. Cargar Template & JSON -> Renderizar
document.addEventListener("DOMContentLoaded", async () => {
  const isDeep = window.location.pathname.split('/').filter(Boolean).length >= 2;

  const TEMPLATE_PATH = isDeep 
    ? '../../common/components/ui/product-card.html' 
    : '../common/components/ui/product-card.html';
    
  const JSON_PATH = isDeep 
    ? '../../common/data/products.json' 
    : '../common/data/products.json';

  const templateLoaded = await loadExternalTemplate(TEMPLATE_PATH);

  if (templateLoaded) {
    fetch(JSON_PATH)
      .then(res => {
        if (!res.ok) throw new Error("No se encontró el JSON");
        return res.json();
      })
      .then(data => {
        const fruitGrid = document.querySelector('#fruit-grid');
        const meatGrid = document.querySelector("#meat-grid");

        if (fruitGrid && data?.frutas?.products) {
          renderProducts('#fruit-grid', data.frutas.products);
        }
        if (meatGrid && data?.carnes?.products) {
          renderProducts('#meat-grid', data.carnes.products);
        }
      })
      .catch(err => console.error("Error en la carga de productos:", err));
  } else {
    console.error("Error crítico: No se pudo cargar el template desde:", TEMPLATE_PATH);
  }
});

