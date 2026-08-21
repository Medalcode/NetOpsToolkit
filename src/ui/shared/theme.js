/**
 * Módulo de Tema
 * Manejo del modo oscuro/claro
 * @module theme
 */

const THEME_KEY = "vlsm-theme";
const THEMES = {
  LIGHT: "light",
  DARK: "dark",
  AUTO: "auto",
};

/**
 * Obtiene la preferencia del sistema
 * @returns {string} 'dark' o 'light'
 */
function getSystemPreference() {
  if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return THEMES.DARK;
  }
  return THEMES.LIGHT;
}

/**
 * Obtiene el tema guardado o usa el del sistema
 * @returns {string} Tema actual
 */
export function getCurrentTheme() {
  try {
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme && Object.values(THEMES).includes(savedTheme)) {
      return savedTheme;
    }
  } catch (error) {
    console.warn("No se pudo acceder a localStorage:", error);
  }
  return THEMES.AUTO;
}

/**
 * Obtiene el tema efectivo (resuelve AUTO)
 * @returns {string} 'dark' o 'light'
 */
export function getEffectiveTheme() {
  const currentTheme = getCurrentTheme();
  if (currentTheme === THEMES.AUTO) {
    return getSystemPreference();
  }
  return currentTheme;
}

/**
 * Aplica el tema al documento
 * @param {string} theme - Tema a aplicar ('dark', 'light', o 'auto')
 */
export function applyTheme(theme) {
  const effectiveTheme = theme === THEMES.AUTO ? getSystemPreference() : theme;

  // Remover clases de tema anteriores
  document.documentElement.classList.remove("theme-light", "theme-dark");

  // Agregar nueva clase de tema
  document.documentElement.classList.add(`theme-${effectiveTheme}`);

  // Actualizar atributo data-theme
  document.documentElement.setAttribute("data-theme", effectiveTheme);
}

/**
 * Guarda el tema en localStorage
 * @param {string} theme - Tema a guardar
 */
export function saveTheme(theme) {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (error) {
    console.warn("No se pudo guardar el tema:", error);
  }
}

/**
 * Cambia al siguiente tema en el ciclo
 * @returns {string} Nuevo tema
 */
export function toggleTheme() {
  const current = getCurrentTheme();
  let newTheme;

  // Ciclo: auto -> light -> dark -> auto
  switch (current) {
  case THEMES.AUTO:
    newTheme = THEMES.LIGHT;
    break;
  case THEMES.LIGHT:
    newTheme = THEMES.DARK;
    break;
  case THEMES.DARK:
    newTheme = THEMES.AUTO;
    break;
  default:
    newTheme = THEMES.AUTO;
  }

  saveTheme(newTheme);
  applyTheme(newTheme);
  return newTheme;
}

/**
 * Setea un tema específico
 * @param {string} theme - Tema a establecer
 */
export function setTheme(theme) {
  if (!Object.values(THEMES).includes(theme)) {
    console.error(`Tema inválido: ${theme}`);
    return;
  }

  saveTheme(theme);
  applyTheme(theme);
}

/**
 * Inicializa el sistema de temas
 * Aplica el tema guardado y escucha cambios en la preferencia del sistema
 */
export function initTheme() {
  // Aplicar tema inicial
  const currentTheme = getCurrentTheme();
  applyTheme(currentTheme);

  // Escuchar cambios en la preferencia del sistema
  if (window.matchMedia) {
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
      // Solo actualizar si el tema está en AUTO
      if (getCurrentTheme() === THEMES.AUTO) {
        applyTheme(THEMES.AUTO);
      }
    });
  }

  console.log(`✅ Tema inicializado: ${currentTheme} (efectivo: ${getEffectiveTheme()})`);
}

/**
 * Crea el botón de toggle de tema
 * @returns {HTMLElement} Botón de toggle
 */
export function createThemeToggle() {
  const button = document.createElement("button");
  button.className = "theme-toggle";
  button.setAttribute("aria-label", "Cambiar tema");
  button.setAttribute("title", "Cambiar tema (Auto → Claro → Oscuro)");

  updateThemeToggleIcon(button);

  button.addEventListener("click", () => {
    toggleTheme();
    updateThemeToggleIcon(button);
  });

  return button;
}

/**
 * Actualiza el icono del botón de toggle según el tema actual
 * @param {HTMLElement} button - Botón a actualizar
 */
function updateThemeToggleIcon(button) {
  const currentTheme = getCurrentTheme();
  const effectiveTheme = getEffectiveTheme();

  let icon, text;

  switch (currentTheme) {
  case THEMES.AUTO:
    icon = "🌓";
    text = `Auto (${effectiveTheme === THEMES.DARK ? "Oscuro" : "Claro"})`;
    break;
  case THEMES.LIGHT:
    icon = "☀️";
    text = "Claro";
    break;
  case THEMES.DARK:
    icon = "🌙";
    text = "Oscuro";
    break;
  default:
    icon = "🌓";
    text = "Auto";
  }

  button.innerHTML = `${icon} <span class="theme-toggle-text">${text}</span>`;
  button.setAttribute("title", `Tema: ${text}. Click para cambiar.`);
}

// Exportar constantes
export { THEMES };
