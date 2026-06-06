import { showToast } from "../shared/ui-engine.js";

export function initSettings() {
  const modalHTML = `
    <div id="settings-modal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm hidden opacity-0 transition-opacity">
      <div class="bg-surface-dark border border-primary/50 shadow-[0_0_20px_rgba(0,255,170,0.15)] rounded max-w-md w-full p-6 transform scale-95 transition-transform duration-200">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-white font-bold uppercase tracking-[0.2em] flex items-center gap-2">
            <span class="material-symbols-outlined text-primary">settings</span> Settings
          </h2>
          <button id="btn-close-settings" class="text-slate-500 hover:text-white transition-colors">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <div class="space-y-6">
          <div>
            <h3 class="text-signal-green text-sm font-bold mb-2 flex items-center gap-2">
              <span class="material-symbols-outlined text-sm">smart_toy</span> AI Integration (BYOK)
            </h3>
            <p class="text-slate-400 text-xs mb-4">
              To use the AI Network Assistant, provide your own Google Gemini API Key. Keys are stored locally in your browser and never sent anywhere else.
            </p>
            <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Google Gemini API Key</label>
            <input type="password" id="input-gemini-key" placeholder="AIzaSy..." class="w-full bg-black border border-border-dark rounded px-3 py-2 text-sm text-white focus:border-primary transition-colors focus:outline-none mb-2">
            <p class="text-[10px] text-slate-500">Get a free key at <a href="https://aistudio.google.com/app/apikey" target="_blank" class="text-primary hover:underline">Google AI Studio</a>.</p>
          </div>
          
          <button id="btn-save-settings" class="w-full bg-primary hover:bg-primary-hover text-black font-bold uppercase tracking-widest py-3 rounded transition-colors shadow-[0_0_15px_rgba(0,255,170,0.2)]">
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", modalHTML);

  const modal = document.getElementById("settings-modal");
  const modalContent = modal.querySelector("div");
  const btnClose = document.getElementById("btn-close-settings");
  const btnSave = document.getElementById("btn-save-settings");
  const inputKey = document.getElementById("input-gemini-key");

  // Load existing key
  const savedKey = localStorage.getItem("gemini_api_key");
  if (savedKey) {
    inputKey.value = savedKey;
  }

  function openModal() {
    modal.classList.remove("hidden");
    // Trigger reflow
    void modal.offsetWidth;
    modal.classList.remove("opacity-0");
    modalContent.classList.remove("scale-95");
  }

  function closeModal() {
    modal.classList.add("opacity-0");
    modalContent.classList.add("scale-95");
    setTimeout(() => {
      modal.classList.add("hidden");
    }, 200);
  }

  btnClose.addEventListener("click", closeModal);
  modal.addEventListener("click", e => {
    if (e.target === modal) closeModal();
  });

  btnSave.addEventListener("click", () => {
    const key = inputKey.value.trim();
    if (key) {
      localStorage.setItem("gemini_api_key", key);
      showToast("Settings saved successfully", "success");
    } else {
      localStorage.removeItem("gemini_api_key");
      showToast("API Key removed", "notice");
    }
    closeModal();
  });

  // Attach to the header button
  const headerBtn = document.getElementById("btn-open-settings");
  if (headerBtn) {
    headerBtn.addEventListener("click", openModal);
  }
}
