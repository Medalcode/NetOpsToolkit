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

  // Import dynamically if not available (or assume it's available via module scope if we change top of file)
  // Actually, let's just use a helper here or import it at the top. 
  // Since I cannot easily change the top import without reading the whole file again or risking index shifts if I assume line 1 is empty, 
  // I will check if I can just use navigator.clipboard directly for simplicity in this specific file 
  // or rely on a Global UI helper. 
  // But the best practice is to import. 
  // NOTA: The user sees this as a module. I will use navigator.clipboard directly here to avoid breaking imports 
  // if I don't want to re-write the top.
  // HOWEVER, I should try to be consistent. 
  // Let's assume I can duplicate the simple copy logic or just use navigator.clipboard which is standard.
  
  const copyText = async (text, btn) => {
    try {
        await navigator.clipboard.writeText(text);
        const originalText = btn.textContent;
        btn.textContent = 'Copiado!';
        setTimeout(() => btn.textContent = originalText, 1500);
    } catch (err) {
        console.error('Failed to copy', err);
    }
  };

  function showResult(title, content, type = 'info') {
    const cardClass = type === 'error' ? 'result-card error' : 'result-card';
    const cleanContent = content || '';
    
    // Create Elements (safer for event binding)
    const card = document.createElement('div');
    card.className = `card ${cardClass}`;
    
    const h3 = document.createElement('h3');
    h3.className = 'result-title';
    h3.textContent = title;
    
    const codeWrapper = document.createElement('div');
    codeWrapper.style.position = 'relative'; 
    
    const code = document.createElement('code');
    code.className = 'result-code';
    code.textContent = cleanContent;
    
    const copyBtn = document.createElement('button');
    copyBtn.className = 'subnet-copy-btn'; // Re-using existing class or make a new one
    copyBtn.style.position = 'absolute';
    copyBtn.style.top = '0';
    copyBtn.style.right = '0';
    copyBtn.style.fontSize = '0.8rem';
    copyBtn.style.padding = '4px 8px';
    copyBtn.textContent = 'Copiar';
    
    copyBtn.addEventListener('click', () => copyText(cleanContent, copyBtn));
    
    codeWrapper.appendChild(code);
    if (type !== 'error') codeWrapper.appendChild(copyBtn);
    
    card.appendChild(h3);
    card.appendChild(codeWrapper);
    
    resultContainer.innerHTML = '';
    resultContainer.appendChild(card);
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
        
        // Helper to create row with copy
        const createRow = (label, value) => {
            const div = document.createElement('div');
            div.style.position = 'relative';
            
            const strong = document.createElement('strong');
            strong.style.color = 'var(--color-primary)';
            strong.textContent = label + ': ';
            div.appendChild(strong);
            
            const code = document.createElement('code');
            code.className = 'result-code';
            code.style.marginTop = '4px';
            code.textContent = value;
            div.appendChild(code);
            
            // Copy Button
            const btn = document.createElement('button');
            btn.className = 'subnet-copy-btn';
            btn.style.position = 'absolute';
            btn.style.top = '0';
            btn.style.right = '0';
            btn.style.fontSize = '0.7em';
            btn.textContent = 'Copiar';
            btn.onclick = () => copyText(value, btn);
            div.appendChild(btn);
            
            return div;
        };
        
        const card = document.createElement('div');
        card.className = 'card result-card';
        
        const grid = document.createElement('div');
        grid.className = 'result-grid-row';
        
        // Type Row (No copy needed usually, but could add)
        const typeDiv = document.createElement('div');
        typeDiv.innerHTML = `<strong style="color:var(--color-primary);">Tipo:</strong> <span style="margin-left:8px;">${type}</span>`;
        grid.appendChild(typeDiv);
        
        grid.appendChild(createRow('Expandida', exp));
        grid.appendChild(createRow('Comprimida', comp));
        
        card.appendChild(grid);
        
        resultContainer.innerHTML = '';
        resultContainer.appendChild(card);
    }
  }

  btnCompress.addEventListener('click', () => handleAction('compress'));
  btnExpand.addEventListener('click', () => handleAction('expand'));
  btnInfo.addEventListener('click', () => handleAction('info'));
}
