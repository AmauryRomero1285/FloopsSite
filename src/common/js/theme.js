// 1. Aplicación inmediata del tema (Evita el "flash" blanco al cargar)
(function () {
  const savedTheme = localStorage.getItem("theme");
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  if (savedTheme === "dark" || (!savedTheme && systemDark)) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
})();

//globalfunction
function toggleDarkMode() {
  const isDark = document.documentElement.classList.toggle("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
}
