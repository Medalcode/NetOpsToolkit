  import { showInputError, showInputSuccess, resetInputValidation } from '../ui.js';

  export function initDnsTool() {
  const domainInput = document.getElementById('dns-domain');
  const typeSelect = document.getElementById('dns-type');
  const resolverSelect = document.getElementById('dns-resolver');
  const btnLookup = document.getElementById('btn-dns-lookup');
  const resultsContainer = document.getElementById('dns-results');

  if (!domainInput || !resultsContainer) return;

  async function lookup() {
    const domain = domainInput.value.trim();
    if (!domain) {
      showInputError('dns-domain', 'Ingresa un dominio válido');
      return;
    }
    showInputSuccess('dns-domain');

    const type = typeSelect.value;
    const resolver = resolverSelect.value; // 'google' or 'cloudflare'
    
    // DNS over HTTPS endpoints
    const endpoints = {
        'google': 'https://dns.google/resolve',
        'cloudflare': 'https://cloudflare-dns.com/dns-query' // Requires Accept header application/dns-json
    };

    const url = new URL(endpoints[resolver]);
    url.searchParams.append('name', domain);
    url.searchParams.append('type', type);

    resultsContainer.innerHTML = '<div class="loading-msg">Consultando DNS...</div>';

    try {
        const headers = { 'Accept': 'application/dns-json' };
        const response = await fetch(url, { headers });
        
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        
        const data = await response.json();
        renderResults(data);

    } catch (error) {
        resultsContainer.innerHTML = `<div class="error-msg">Error de conexión: ${error.message}</div>`;
    }
  }

  function renderResults(data) {
    if (!data.Answer) {
        resultsContainer.innerHTML = `<div class="warning-message">No se encontraron registros ${typeSelect.value} para ${domainInput.value}. (Status: ${data.Status})</div>`;
        return;
    }

    const rows = data.Answer.map(record => `
        <tr>
            <td>${record.name}</td>
            <td>${record.type}</td>
            <td>${record.TTL}</td>
            <td style="display:flex; justify-content:space-between; align-items:center;">
                <span style="font-family:monospace; color:var(--color-text-highlight); overflow-wrap:anywhere; margin-right:8px;">${record.data}</span>
                <button class="subnet-copy-btn btn-copy-dns" data-copy="${record.data.replace(/"/g, '&quot;')}" style="font-size:0.75rem; padding:2px 6px;">Copy</button>
            </td>
        </tr>
    `).join('');

    resultsContainer.innerHTML = `
        <div class="card" style="padding:0; overflow:hidden; border:1px solid var(--color-border);">
            <table class="ref-table">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Tipo</th>
                        <th>TTL</th>
                        <th>Data</th>
                    </tr>
                </thead>
                <tbody>
                    ${rows}
                </tbody>
            </table>
        </div>
        <div style="margin-top:10px; font-size:0.8rem; color:var(--color-text-secondary); text-align:right;">
            Resolución vía ${resolverSelect.options[resolverSelect.selectedIndex].text}
        </div>
    `;
  }

  // Copy Event Delegation
  resultsContainer.addEventListener('click', async (e) => {
    if (e.target.classList.contains('btn-copy-dns')) {
        const text = e.target.getAttribute('data-copy');
        const btn = e.target;
        try {
            await navigator.clipboard.writeText(text);
            const originalText = btn.textContent;
            btn.textContent = '✓';
            setTimeout(() => btn.textContent = originalText, 1000);
        } catch (err) {
            console.error('Error copying', err);
        }
    }
  });

  btnLookup.addEventListener('click', lookup);
  domainInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') lookup();
  });
}
