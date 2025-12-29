/**
 * Módulo de Herramientas IPv6
 * Provee funciones para manipulación y análisis de direcciones IPv6
 */

export function initIPv6Tool() {
  const input = document.getElementById('ipv6-input');
  const btnCompress = document.getElementById('btn-ipv6-compress');
  const btnExpand = document.getElementById('btn-ipv6-expand');
  const btnInfo = document.getElementById('btn-ipv6-info');
  const resultContainer = document.getElementById('ipv6-results');

  if (!input || !resultContainer) return;

  function showResult(title, content, type = 'info') {
    resultContainer.innerHTML = `
      <div class="card" style="padding: 20px; border-left: 4px solid var(--color-${type === 'error' ? 'error' : 'primary'}); animation: fadeIn 0.3s;">
        <h3 style="margin:0 0 10px 0; font-size: 1rem; color: var(--color-text-secondary);">${title}</h3>
        <code style="font-size: 1.2rem; word-break: break-all; color: var(--color-text-highlight);">${content}</code>
      </div>
    `;
  }

  function validate(addr) {
    // Basic validation regex (loose)
    const regex = /^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){1,7}:)|(([0-9A-Fa-f]{1,4}:){1,6}:[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){1,5}(:[0-9A-Fa-f]{1,4}){1,2})|(([0-9A-Fa-f]{1,4}:){1,4}(:[0-9A-Fa-f]{1,4}){1,3})|(([0-9A-Fa-f]{1,4}:){1,3}(:[0-9A-Fa-f]{1,4}){1,4})|(([0-9A-Fa-f]{1,4}:){1,2}(:[0-9A-Fa-f]{1,4}){1,5})|([0-9A-Fa-f]{1,4}:((:[0-9A-Fa-f]{1,4}){1,6}))|:((:[0-9A-Fa-f]{1,4}){1,7}|:)|fe80:(:[0-9A-Fa-f]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9A-Fa-f]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\s*$/;
    return regex.test(addr);
  }

  function expand(addr) {
    let full = addr.toLowerCase();
    const parts = full.split('::');
    
    // Handle double colon
    if (parts.length > 2) return null; // Invalid multiple ::
    
    let left = parts[0] ? parts[0].split(':') : [];
    let right = parts[1] ? parts[1].split(':') : [];
    
    // Check if parts are empty due to starting/ending ::
    if (parts[0] === '') left = [];
    if (parts[1] === '') right = [];

    const missing = 8 - (left.length + right.length);
    const zeros = Array(missing).fill('0000');
    
    let allParts = [...left, ...zeros, ...right];
    
    // Pad each part to 4 chars
    allParts = allParts.map(p => p.padStart(4, '0'));
    
    return allParts.join(':');
  }

  function compress(addr) {
    const expended = expand(addr);
    if (!expended) return null;

    // Remove leading zeros in each block: 00fe -> fe, 0000 -> 0
    let parts = expended.split(':').map(p => p.replace(/^0+(.+)/, '$1').replace(/^0+$/, '0'));
    
    // Find longest sequence of zeros
    let bestStart = -1;
    let bestLen = 0;
    
    let currentStart = -1;
    let currentLen = 0;
    
    for (let i = 0; i < parts.length; i++) {
        if (parts[i] === '0') {
            if (currentStart === -1) currentStart = i;
            currentLen++;
        } else {
            if (currentLen > bestLen) {
                bestLen = currentLen;
                bestStart = currentStart;
            }
            currentStart = -1;
            currentLen = 0;
        }
    }
    // Check last sequence
    if (currentLen > bestLen) {
        bestLen = currentLen;
        bestStart = currentStart;
    }

    if (bestLen > 1) {
        // Replace with ::
        parts.splice(bestStart, bestLen, '');
        // If it replaced the start or end involved empty strings, handling :: properly
        // Actually splice removes items and inserts ''. 
        // If bestStart=0, parts=['', '1', ...] -> ::1
        // If at end, ['1', ''] -> 1::
        // If middle, ['1', '', '1'] -> 1::1
        
        // This logic is slightly tricky with join. 
        // e.g. 0:0:0:1 -> ['0','0','0','1']. splice(0,3,'') -> ['', '1']. join(':') -> ':1'. 
        // We need '::1'. 
        // If the empty string is at start/end, we need double colon.
        // A simpler way with array: 
        
        // Re-construct manually to handle the double colon logic carefully
        const before = parts.slice(0, bestStart);
        const after = parts.slice(bestStart + 1); // +1 because we inserted empty string
        
        // Actually javaScript splice modifies in place. 
        // let's retry.
        
        // Re-do without splice for clarity:
        const pre = parts.slice(0, bestStart);
        const post = parts.slice(bestStart + 1); // +1 is wrong, we removed bestLen items.
        
        // NO wait. I spliced (bestStart, bestLen, '').
        // So parts array has '' at bestStart.
        // If parts is ['', '1'], join is ':1'. Incorrect.
        
        if (bestStart === 0 && (bestStart + bestLen) === 8) return '::'; // All zeros
        
        let res = parts.join(':');
        // Fix edges
        res = res.replace(/:{3,}/g, '::'); // Triple colon fix? No.
        
        // If we have ['', '1...'] -> :1... -> replace start with ::
        if (parts[0] === '') res = ':' + res;
        // If we have ['...1', ''] -> ...1: -> replace end with ::
        if (parts[parts.length-1] === '') res = res + ':';
        
        return res;
    }
    
    return parts.join(':');
  }

  function getType(addr) {
    const full = expand(addr);
    if (!full) return 'Inválida';
    
    // Check prefixes on full expansion (e.g. 2001:0db8...)
    const p = full.toLowerCase();
    
    if (p === '0000:0000:0000:0000:0000:0000:0000:0000') return 'Unspecified (::)';
    if (p === '0000:0000:0000:0000:0000:0000:0000:0001') return 'Loopback (::1)';
    
    if (p.startsWith('fe80')) return 'Link-Local Unicast';
    if (p.startsWith('fec0')) return 'Site-Local Unicast (Deprecated)';
    if (p.startsWith('fc') || p.startsWith('fd')) return 'Unique Local (ULA)';
    if (p.startsWith('ff')) return 'Multicast';
    if (p.startsWith('2001:0db8')) return 'Documentation';
    if (p.startsWith('2001:0000')) return 'Teredo Tunneling';
    if (p.startsWith('2002')) return '6to4 Tunneling';
    if (p.startsWith('2') || p.startsWith('3')) return 'Global Unicast'; // Broad check
    
    return 'Unknown / Reserved';
  }

  // --- Event Listeners ---

  function handleAction(action) {
    const val = input.value.trim();
    if (!validate(val)) {
        showResult('Error', 'Dirección IPv6 inválida', 'error');
        return;
    }

    if (action === 'compress') {
        const res = compress(val);
        showResult('Comprimida', res);
    } else if (action === 'expand') {
        const res = expand(val);
        showResult('Expandida (Canónica)', res);
    } else if (action === 'info') {
        const type = getType(val);
        const exp = expand(val);
        const comp = compress(val);
        
        resultContainer.innerHTML = `
          <div class="card" style="padding: 20px; border-left: 4px solid var(--color-primary);">
            <div style="display:grid; gap:10px;">
                <div>
                    <strong style="color:var(--color-primary);">Tipo:</strong>
                    <span style="margin-left:8px;">${type}</span>
                </div>
                <div>
                    <strong style="color:var(--color-primary);">Expandida:</strong>
                    <code style="display:block; margin-top:4px; font-size:1.1rem; color: #fff;">${exp}</code>
                </div>
                 <div>
                    <strong style="color:var(--color-primary);">Comprimida:</strong>
                    <code style="display:block; margin-top:4px; font-size:1.1rem; color: #fff;">${comp}</code>
                </div>
            </div>
          </div>
        `;
    }
  }

  btnCompress.addEventListener('click', () => handleAction('compress'));
  btnExpand.addEventListener('click', () => handleAction('expand'));
  btnInfo.addEventListener('click', () => handleAction('info'));
}
