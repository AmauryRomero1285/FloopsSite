// global-search.js
let allProducts = [];

async function loadProducts() {
  try {
    const res = await fetch('/public/data/products.json');
    if (!res.ok) throw new Error(`Error al cargar: ${res.status}`);
    allProducts = await res.json(); // array directo
    console.log(`Cargados ${allProducts.length} productos`);
  } catch (e) {
    console.error('Error cargando products.json', e);
    allProducts = [];
  }
}

function renderResults(filtered) {
  const container = document.getElementById('searchResults');
  if (!container) return;

  container.innerHTML = '';

  if (filtered.length === 0) {
    container.innerHTML = `<p class="text-center py-8 text-slate-500">No encontramos resultados 😕</p>`;
    container.classList.remove('hidden');
    return;
  }

  let html = '';
  filtered.forEach(item => {
    html += `
      <a href="${item.url}" class="flex gap-4 px-6 py-3 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors group">
        <img src="${item.image}" class="w-12 h-12 object-cover rounded-xl flex-shrink-0">
        <div class="flex-1 min-w-0">
          <div class="flex items-start justify-between gap-2">
            <h4 class="font-medium text-slate-900 dark:text-white truncate">${item.title}</h4>
            <span class="text-primary font-semibold whitespace-nowrap">$${Number(item.price).toFixed(2)}</span>
          </div>
          <p class="text-xs text-slate-500 dark:text-slate-400">${item.section}</p>
        </div>
      </a>
    `;
  });

  container.innerHTML = html;
  container.classList.remove('hidden');
}

function fuzzyMatch(text, query) {
  if (!query) return true;
  let queryIdx = 0;
  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();

  for (let i = 0; i < lowerText.length && queryIdx < lowerQuery.length; i++) {
    if (lowerText[i] === lowerQuery[queryIdx]) {
      queryIdx++;
    }
  }
  return queryIdx === lowerQuery.length;
}

function filterProducts(term, category) {
  if (!allProducts.length) return [];

  const lowerTerm = (term || '').toLowerCase().trim();
  const termWords = lowerTerm.split(/\s+/).filter(w => w.length > 1);

  return allProducts.filter(item => {
    let matchesSearch = false;

    if (!lowerTerm) {
      matchesSearch = true;
    } else {
      const searchableText = `${item.title} ${item.section} ${item.keywords?.join(' ') || ''}`.toLowerCase();

      const fuzzyOk = fuzzyMatch(searchableText, lowerTerm);
      const titleMatch   = item.title.toLowerCase().includes(lowerTerm);
      const sectionMatch = item.section.toLowerCase().includes(lowerTerm);
      const keywordsMatch = termWords.some(word =>
        item.keywords?.some(kw => kw.toLowerCase().includes(word)) ?? false
      );

      matchesSearch = fuzzyOk || titleMatch || sectionMatch || keywordsMatch;
    }

    const matchesCategory = !category || item.category === category;

    return matchesSearch && matchesCategory;
  });
}

// Inicializar
document.addEventListener('DOMContentLoaded', async () => {
  await loadProducts();

  const searchInput   = document.getElementById('globalSearch');
  const sectionFilter = document.getElementById('sectionFilter');
  const resultsPanel  = document.getElementById('searchResults');

  if (!searchInput || !resultsPanel) {
    console.warn('Elementos esenciales de búsqueda no encontrados');
    return;
  }

  function doSearch() {
    const term = searchInput.value;
    const cat  = sectionFilter?.value || '';
    const filtered = filterProducts(term, cat);
    renderResults(filtered);
    return filtered; // retornamos filtered para usarlo en Enter
  }

  // Debounce en input (búsqueda mientras escribe)
  let timeout;
  searchInput.addEventListener('input', () => {
    clearTimeout(timeout);
    timeout = setTimeout(doSearch, 250);
  });

  if (sectionFilter) {
    sectionFilter.addEventListener('change', doSearch);
  }

  // Cerrar al clic fuera
  document.addEventListener('click', e => {
    if (!searchInput.contains(e.target) && !resultsPanel.contains(e.target)) {
      resultsPanel.classList.add('hidden');
    }
  });

  // Al enfocar → sugerencias iniciales
  searchInput.addEventListener('focus', () => {
    if (!searchInput.value.trim()) {
      renderResults(allProducts.slice(0, 12));
    } else {
      doSearch();
    }
  });

  // ← Presionar Enter: comportamiento inteligente
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      clearTimeout(timeout);

      const filtered = doSearch(); // ejecuta búsqueda y obtiene resultados

      if (filtered.length === 1 && filtered[0]?.url) {
        // Variante 2: exactamente 1 resultado → redirigir directamente
        window.location.href = filtered[0].url;
      } else if (filtered.length > 1) {
        // Variante 1 + feedback: mostrar resultados y cerrar después de 1.2 segundos
        setTimeout(() => {
          resultsPanel.classList.add('hidden');
        }, 1200);
      } else {
        // Sin resultados → mensaje temporal visible 2 segundos
        resultsPanel.innerHTML = `<p class="text-center py-8 text-slate-500">No encontramos resultados para "${searchInput.value.trim()}"</p>`;
        resultsPanel.classList.remove('hidden');
        setTimeout(() => {
          resultsPanel.classList.add('hidden');
        }, 2000);
      }
    }
  });
});