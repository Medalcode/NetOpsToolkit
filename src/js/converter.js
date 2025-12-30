/**
 * Módulo de Conversión de Bases (Hex/Bin/Dec)
 * @module converter
 */

export function initConverter() {
  const input = document.getElementById('converter-input');
  if (!input) return;

  const resDec = document.getElementById('res-dec');
  const resBin = document.getElementById('res-bin');
  const resHex = document.getElementById('res-hex');

  input.addEventListener('input', () => {
    const rawVal = input.value.trim();
    if (!rawVal) {
        clearResults();
        return;
    }

    let num = NaN;
    let type = 'unknown';

    // 1. Detección por prefijo
    if (rawVal.startsWith('0x') || rawVal.startsWith('0X')) {
        num = parseInt(rawVal.substring(2), 16);
        type = 'hex';
    } else if (rawVal.startsWith('0b') || rawVal.startsWith('0B')) {
        num = parseInt(rawVal.substring(2), 2);
        type = 'bin';
    } 
    // 2. Detección por caracteres
    else if (/[a-fA-F]/.test(rawVal)) {
        num = parseInt(rawVal, 16);
        type = 'hex';
    } else {
        // Asumir decimal por defecto
        num = parseInt(rawVal, 10);
        type = 'dec';
    }

    if (!isNaN(num)) {
      updateResults(num);
    } else {
        // Si falló el parseInt (ej: caracteres inválidos)
        resDec.value = 'Error';
        resBin.value = 'Error';
        resHex.value = 'Error';
    }
  });

  function clearResults() {
    resDec.value = '';
    resBin.value = '';
    resHex.value = '';
  }

  function updateResults(num) {
    try {
        resDec.value = num.toString(10);
        resBin.value = num.toString(2);
        resHex.value = '0x' + num.toString(16).toUpperCase();
    } catch (e) {
        clearResults();
    }
  }
}
