/**
 * Módulo de Navegación por Pestañas
 * @module tabs
 */

export function initTabs() {
  const tabs = document.querySelectorAll(".nav-link");

  tabs.forEach(tab => {
    tab.addEventListener("click", e => {
      e.preventDefault();

      // Ignorar tabs deshabilitados
      if (tab.hasAttribute("disabled")) return;

      // Desactivar todos
      document.querySelectorAll(".nav-link").forEach(t => t.classList.remove("active"));
      document.querySelectorAll(".tool-content").forEach(c => c.classList.remove("active"));

      // Activar el seleccionado
      tab.classList.add("active");
      const targetId = tab.getAttribute("data-target");
      const targetContent = document.getElementById(targetId);
      if (targetContent) {
        targetContent.classList.add("active");

        // Enfocar primer input del tab (UX Pro)
        const firstInput = targetContent.querySelector("input");
        if (firstInput) setTimeout(() => firstInput.focus(), 100);
      }
    });
  });
}
