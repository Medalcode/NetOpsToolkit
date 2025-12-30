export function initKeyGenTool() {
  const lengthInput = document.getElementById('keygen-length');
  const typeSelect = document.getElementById('keygen-type');
  const btnGen = document.getElementById('btn-keygen');
  const output = document.getElementById('keygen-output');
  const btnCopy = document.getElementById('btn-keygen-copy');

  if (!btnGen || !output) return;

  function generateKey() {
    const len = parseInt(lengthInput.value, 10);
    const type = typeSelect.value;
    let chars = '';
    
    if (type === 'hex') {
        chars = '0123456789ABCDEF';
    } else if (type === 'wpa') {
        chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
    } else if (type === 'base64') {
        chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    }

    let result = '';
    const randomValues = new Uint32Array(len);
    crypto.getRandomValues(randomValues);

    for (let i = 0; i < len; i++) {
        result += chars[randomValues[i] % chars.length];
    }

    output.value = result;
    
    // Auto-select for easier copy
    output.select();
  }

  function copyToClipboard() {
     if (!output.value) return;
     navigator.clipboard.writeText(output.value).then(() => {
         const originalText = btnCopy.textContent;
         btnCopy.textContent = 'Copiado!';
         setTimeout(() => btnCopy.textContent = originalText, 1500);
     });
  }

  btnGen.addEventListener('click', generateKey);
  btnCopy.addEventListener('click', copyToClipboard);
}
