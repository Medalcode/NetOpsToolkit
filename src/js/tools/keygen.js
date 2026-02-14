/**
 * Módulo Key Generator (Tailwind Version)
 */
export function initKeyGenTool(container) {
  // 1. Render UI
  container.innerHTML = `
    <div class="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Controls -->
        <div class="bg-surface-dark cyber-border rounded p-6">
            <h4 class="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6 border-b border-border-dark pb-2">Generation Parameters</h4>
            
            <div class="space-y-6">
                <!-- Type Selection -->
                <div>
                    <label class="block text-[10px] font-bold text-slate-500 uppercase mb-3">Key Complexity</label>
                    <div class="grid grid-cols-3 gap-2">
                        <button class="type-btn active bg-primary text-white border border-primary text-xs font-bold py-2 rounded transition-all" data-value="wpa">WPA2/3</button>
                        <button class="type-btn bg-black text-slate-400 border border-border-dark hover:border-slate-500 text-xs font-bold py-2 rounded transition-all" data-value="hex">HEX</button>
                        <button class="type-btn bg-black text-slate-400 border border-border-dark hover:border-slate-500 text-xs font-bold py-2 rounded transition-all" data-value="base64">BASE64</button>
                    </div>
                </div>

                <!-- Length Slider -->
                <div>
                    <div class="flex justify-between mb-2">
                        <label class="text-[10px] font-bold text-slate-500 uppercase">Length</label>
                        <span id="len-val" class="text-xs font-mono text-primary">32 chars</span>
                    </div>
                    <input id="keygen-length" type="range" min="8" max="128" value="32" class="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary">
                    <div class="flex justify-between text-[10px] text-slate-600 mt-1">
                        <span>8</span>
                        <span>64</span>
                        <span>128</span>
                    </div>
                </div>

                <button id="btn-keygen" class="w-full bg-primary hover:bg-primary/80 text-white text-xs font-bold uppercase tracking-widest py-3 rounded transition-colors shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
                    <span class="material-symbols-outlined !text-sm">cached</span> Generate Key
                </button>
            </div>
        </div>

        <!-- Output -->
        <div class="bg-surface-dark cyber-border rounded p-6 flex flex-col">
             <h4 class="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Secure Output</h4>
             
             <div class="flex-1 flex flex-col justify-center gap-4">
                 <div class="relative group">
                     <textarea id="keygen-output" readonly class="w-full h-32 bg-black border border-border-dark rounded p-4 text-signal-green font-mono text-lg resize-none focus:outline-none focus:border-signal-green/50 transition-colors" placeholder="Generated key will appear here..."></textarea>
                     <div class="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-signal-green/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                 </div>

                 <div class="grid grid-cols-2 gap-4">
                      <button id="btn-keygen-copy" class="bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold py-2 rounded border border-border-dark transition-colors flex items-center justify-center gap-2">
                           <span class="material-symbols-outlined !text-sm">content_copy</span> Copy
                      </button>
                      <button id="btn-keygen-download" class="bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold py-2 rounded border border-border-dark transition-colors flex items-center justify-center gap-2">
                           <span class="material-symbols-outlined !text-sm">download</span> Save .txt
                      </button>
                 </div>
             </div>
        </div>
    </div>
  `;

  // 2. Select Elements
  const lengthInput = container.querySelector("#keygen-length");
  const lenDisplay = container.querySelector("#len-val");
  const typeBtns = container.querySelectorAll(".type-btn");
  const btnGen = container.querySelector("#btn-keygen");
  const output = container.querySelector("#keygen-output");
  const btnCopy = container.querySelector("#btn-keygen-copy");

  let currentType = "wpa";

  // 3. Logic

  // Type Switcher Logic
  typeBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      typeBtns.forEach(b => {
        b.classList.remove("bg-primary", "text-white", "border-primary");
        b.classList.add("bg-black", "text-slate-400", "border-border-dark");
      });
      btn.classList.remove("bg-black", "text-slate-400", "border-border-dark");
      btn.classList.add("bg-primary", "text-white", "border-primary");
      currentType = btn.dataset.value;
      generateKey();
    });
  });

  // Slider Logic
  lengthInput.addEventListener("input", e => {
    lenDisplay.textContent = `${e.target.value} chars`;
    generateKey(); // Live update
  });

  function generateKey() {
    const len = parseInt(lengthInput.value, 10);
    let chars = "";

    if (currentType === "hex") {
      chars = "0123456789ABCDEF";
    } else if (currentType === "wpa") {
      chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";
    } else if (currentType === "base64") {
      chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    }

    let result = "";
    const randomValues = new Uint32Array(len);
    crypto.getRandomValues(randomValues);

    for (let i = 0; i < len; i++) {
      result += chars[randomValues[i] % chars.length];
    }

    output.value = result;
  }

  function copyToClipboard() {
    if (!output.value) return;
    navigator.clipboard.writeText(output.value).then(() => {
      const originalText = btnCopy.innerHTML;
      btnCopy.innerHTML = "<span class=\"material-symbols-outlined !text-sm\">check</span> Copied!";
      btnCopy.classList.add("text-signal-green");
      setTimeout(() => {
        btnCopy.innerHTML = originalText;
        btnCopy.classList.remove("text-signal-green");
      }, 1500);
    });
  }

  btnGen.addEventListener("click", generateKey);
  btnCopy.addEventListener("click", copyToClipboard);

  // Initial Run
  generateKey();
}
