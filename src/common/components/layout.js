// layout.js (versión mejorada)

const COMPONENT_PATH = "/src/common/components/partials";

async function loadPartial(id, path) {
  const target = document.getElementById(id);
  if (!target) {
    console.warn(`No se encontró elemento con id="${id}" para cargar ${path}`);
    return;
  }

  try {
    const res = await fetch(path);
    if (!res.ok) {
      throw new Error(`Error al cargar ${path}: ${res.status}`);
    }
    const html = await res.text();
    target.innerHTML = html;

    // Disparamos evento personalizado
    document.dispatchEvent(
      new CustomEvent("partial:loaded", {
        detail: { id, element: target },
      })
    );

    // Evento especial cuando TODOS los partials críticos están listos
    if (id === "header") {
      document.dispatchEvent(new CustomEvent("header:loaded"));
    }
  } catch (err) {
    console.error(`Fallo al cargar partial ${id}:`, err);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // Cargar partials
  Promise.all([
    loadPartial("header",    `${COMPONENT_PATH}/header.html`),
    loadPartial("footer",    `${COMPONENT_PATH}/footer.html`),
    loadPartial("sidebar",   `${COMPONENT_PATH}/sidebar.html`),
    loadPartial("breadcrumb", `${COMPONENT_PATH}/breadcrumb.html`),
  ]).then(() => {
    // Opcional: evento cuando todo terminó de cargar
    document.dispatchEvent(new CustomEvent("partials:all-loaded"));
  });
});