async function loadPartial(id, path) {
  const res = await fetch(path);
  const html = await res.text();
  document.getElementById(id).innerHTML = html;

  document.dispatchEvent(
    new CustomEvent("partialLoaded", {
      detail: { id },
    }),
  );
}

const COMPONENT_PATH ="/src/common/components/partials"

loadPartial("header", `${COMPONENT_PATH}/header.html`);
loadPartial("footer", `${COMPONENT_PATH}/footer.html`);
loadPartial("sidebar", `${COMPONENT_PATH}/sidebar.html`);
loadPartial("breadcrumb", `${COMPONENT_PATH}/breadcrumb.html`);

