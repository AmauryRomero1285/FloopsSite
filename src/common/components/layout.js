// layout.js (versión corregida)

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

    // Disparamos el evento después de insertar el HTML
    document.dispatchEvent(
      new CustomEvent("partial:loaded", {   // ← nota: usa "partial:loaded" consistente
        detail: { id },
      })
    );
  } catch (err) {
    console.error(`Fallo al cargar partial ${id}:`, err);
  }
}

// ¡Importante! Esperar a que el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
  loadPartial("header",    `${COMPONENT_PATH}/header.html`);
  loadPartial("footer",    `${COMPONENT_PATH}/footer.html`);
  loadPartial("sidebar",   `${COMPONENT_PATH}/sidebar.html`);
  loadPartial("breadcrumb", `${COMPONENT_PATH}/breadcrumb.html`);
});