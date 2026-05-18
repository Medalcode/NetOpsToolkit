/**
 * Módulo de Conversión de Bases (Hex/Bin/Dec)
 * @module converter
 */

export function initConverter(container) {
  container.innerHTML = `
    <div class="space-y-4">
      <div>
        <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Enter a number (with or without prefix):</label>
        <input id="converter-input" type="text" placeholder="e.g. 255, 0xFF, 0b11111111" class="w-full bg-black border border-border-dark rounded px-3 py-2 text-sm mono-data text-white placeholder-slate-700 focus:border-primary transition-colors">
      </div>
      <div class="grid grid-cols-3 gap-4">
        <div class="bg-surface-dark cyber-border rounded p-4">
          <div class="text-[10px] text-slate-500 uppercase font-bold mb-1">Decimal</div>
          <div id="res-dec" class="text-2xl font-bold text-white mono-data">—</div>
        </div>
        <div class="bg-surface-dark cyber-border rounded p-4">
          <div class="text-[10px] text-slate-500 uppercase font-bold mb-1">Binary</div>
          <div id="res-bin" class="text-2xl font-bold text-white mono-data break-all">—</div>
        </div>
        <div class="bg-surface-dark cyber-border rounded p-4">
          <div class="text-[10px] text-slate-500 uppercase font-bold mb-1">Hexadecimal</div>
          <div id="res-hex" class="text-2xl font-bold text-white mono-data">—</div>
        </div>
      </div>
    </div>
  `;

  const input = document.getElementById("converter-input");
  if (!input) return;

  const resDec = document.getElementById("res-dec");
  const resBin = document.getElementById("res-bin");
  const resHex = document.getElementById("res-hex");

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
