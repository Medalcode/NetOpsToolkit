/**
 * Módulo de Conversión de Bases (Hex/Bin/Dec)
 * @module converter
 */

export function initConverter(container) {
  if (!container) return;

  container.innerHTML = `
    <div class="max-w-xl mx-auto space-y-6">
        <div class="bg-surface-dark cyber-border rounded p-6">
            <h4 class="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Hex / Dec / Bin Converter</h4>
            <div class="space-y-4">
                <div>
                    <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Input Value</label>
                    <input id="converter-input" type="text" placeholder="e.g. 255, 0xFF, or 0b11111111" class="w-full bg-black border border-border-dark rounded px-3 py-2 text-sm mono-data text-white focus:border-primary transition-colors">
                    <span class="text-[9px] text-slate-500 mt-1 block">Supports decimal, hexadecimal (0x prefix), or binary (0b prefix)</span>
                </div>
            </div>
        </div>

        <div class="bg-surface-dark cyber-border rounded p-6 space-y-4">
            <h4 class="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 border-b border-border-dark pb-2">Results</h4>
            <div class="grid grid-cols-1 gap-4">
                <div>
                    <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Decimal</label>
                    <input id="res-dec" type="text" readonly class="w-full bg-slate-900 border border-border-dark rounded px-3 py-2 text-sm mono-data text-white">
                </div>
                <div>
                    <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Binary</label>
                    <input id="res-bin" type="text" readonly class="w-full bg-slate-900 border border-border-dark rounded px-3 py-2 text-sm mono-data text-white">
                </div>
                <div>
                    <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Hexadecimal</label>
                    <input id="res-hex" type="text" readonly class="w-full bg-slate-900 border border-border-dark rounded px-3 py-2 text-sm mono-data text-white">
                </div>
            </div>
        </div>
    </div>
  `;

  const input = container.querySelector("#converter-input");
  const resDec = container.querySelector("#res-dec");
  const resBin = container.querySelector("#res-bin");
  const resHex = container.querySelector("#res-hex");

  if (!input) return;

  input.addEventListener("input", () => {
    const rawVal = input.value.trim();
    if (!rawVal) {
      clearResults();
      return;
    }

    let num = NaN;

    // 1. Detección por prefijo
    if (rawVal.startsWith("0x") || rawVal.startsWith("0X")) {
      num = parseInt(rawVal.substring(2), 16);
    } else if (rawVal.startsWith("0b") || rawVal.startsWith("0B")) {
      num = parseInt(rawVal.substring(2), 2);
    }
    // 2. Detección por caracteres
    else if (/[a-fA-F]/.test(rawVal)) {
      num = parseInt(rawVal, 16);
    } else {
      // Asumir decimal por defecto
      num = parseInt(rawVal, 10);
    }

    if (!isNaN(num)) {
      updateResults(num);
    } else {
      // Si falló el parseInt (ej: caracteres inválidos)
      resDec.value = "Error";
      resBin.value = "Error";
      resHex.value = "Error";
    }
  });

  function clearResults() {
    resDec.value = "";
    resBin.value = "";
    resHex.value = "";
  }

  function updateResults(num) {
    try {
      resDec.value = num.toString(10);
      resBin.value = num.toString(2);
      resHex.value = "0x" + num.toString(16).toUpperCase();
    } catch (e) {
      clearResults();
    }
  }
}
