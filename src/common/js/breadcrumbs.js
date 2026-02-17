document.addEventListener("partial:loaded", (e) => {
  if (e.detail.id !== "breadcrumb") return;

  const currentPage = document.getElementById("current-page");
  if (!currentPage) return;

  let title = document.title.trim();
  let pageName = title.split(" - ").pop()?.trim() || "Página";

  // limpieza extra opcional
  pageName = pageName.replace(/Floops Supermarket/i, "").trim() || pageName;

  currentPage.textContent = pageName;
});