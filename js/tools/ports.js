export const portDatabase = [
  { port: 20, protocol: 'TCP', service: 'FTP-DATA', desc: 'File Transfer Protocol (Data)' },
  { port: 21, protocol: 'TCP', service: 'FTP', desc: 'File Transfer Protocol (Control)' },
  { port: 22, protocol: 'TCP', service: 'SSH', desc: 'Secure Shell (Remote Login)' },
  { port: 23, protocol: 'TCP', service: 'Telnet', desc: 'Unencrypted Text Communications' },
  { port: 25, protocol: 'TCP', service: 'SMTP', desc: 'Simple Mail Transfer Protocol' },
  { port: 53, protocol: 'UDP/TCP', service: 'DNS', desc: 'Domain Name System' },
  { port: 67, protocol: 'UDP', service: 'DHCP', desc: 'Dynamic Host Configuration Protocol (Server)' },
  { port: 68, protocol: 'UDP', service: 'DHCP', desc: 'Dynamic Host Configuration Protocol (Client)' },
  { port: 69, protocol: 'UDP', service: 'TFTP', desc: 'Trivial File Transfer Protocol' },
  { port: 80, protocol: 'TCP', service: 'HTTP', desc: 'Hypertext Transfer Protocol' },
  { port: 110, protocol: 'TCP', service: 'POP3', desc: 'Post Office Protocol v3' },
  { port: 123, protocol: 'UDP', service: 'NTP', desc: 'Network Time Protocol' },
  { port: 143, protocol: 'TCP', service: 'IMAP', desc: 'Internet Message Access Protocol' },
  { port: 161, protocol: 'UDP', service: 'SNMP', desc: 'Simple Network Management Protocol' },
  { port: 179, protocol: 'TCP', service: 'BGP', desc: 'Border Gateway Protocol' },
  { port: 389, protocol: 'TCP/UDP', service: 'LDAP', desc: 'Lightweight Directory Access Protocol' },
  { port: 443, protocol: 'TCP', service: 'HTTPS', desc: 'HTTP over TLS/SSL' },
  { port: 445, protocol: 'TCP', service: 'SMB', desc: 'Server Message Block' },
  { port: 500, protocol: 'UDP', service: 'ISAKMP', desc: 'Internet Security Association and Key Management Protocol' },
  { port: 514, protocol: 'UDP', service: 'Syslog', desc: 'System Logging Protocol' },
  { port: 636, protocol: 'TCP', service: 'LDAPS', desc: 'LDAP over SSL' },
  { port: 993, protocol: 'TCP', service: 'IMAPS', desc: 'IMAP over SSL' },
  { port: 995, protocol: 'TCP', service: 'POP3S', desc: 'POP3 over SSL' },
  { port: 1433, protocol: 'TCP', service: 'SQL Server', desc: 'Microsoft SQL Server' },
  { port: 1521, protocol: 'TCP', service: 'Oracle', desc: 'Oracle Database' },
  { port: 3306, protocol: 'TCP', service: 'MySQL', desc: 'MySQL Database System' },
  { port: 3389, protocol: 'TCP', service: 'RDP', desc: 'Remote Desktop Protocol' },
  { port: 5060, protocol: 'TCP/UDP', service: 'SIP', desc: 'Session Initiation Protocol' },
  { port: 5432, protocol: 'TCP', service: 'PostgreSQL', desc: 'PostgreSQL Database' },
  { port: 5900, protocol: 'TCP', service: 'VNC', desc: 'Virtual Network Computing' },
  { port: 8080, protocol: 'TCP', service: 'HTTP-Proxy', desc: 'Common HTTP Proxy/Dev Port' }
];

export function initPortTool() {
  const searchInput = document.getElementById('port-search');
  const resultsContainer = document.getElementById('port-results');

  if (!searchInput || !resultsContainer) return;

  function render(ports) {
    if (ports.length === 0) {
      resultsContainer.innerHTML = `<div class="card p-4" style="text-align:center;">No results found.</div>`;
      return;
    }
    
    resultsContainer.innerHTML = ports.map(p => `
      <div class="card" style="padding: 16px; border-left: 4px solid var(--color-primary);">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <h3 style="margin:0; font-family:var(--font-mono); color:var(--color-primary);">${p.port}</h3>
          <span class="badge" style="background:${p.protocol.includes('UDP') ? '#f59e0b' : '#3b82f6'}; color:#fff; padding:2px 6px; border-radius:4px; font-size:0.7em;">${p.protocol}</span>
        </div>
        <div style="font-weight:bold; margin: 8px 0; color:#fff;">${p.service}</div>
        <div style="font-size:0.9em; color:var(--color-text-secondary);">${p.desc}</div>
      </div>
    `).join('');
  }

  searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase().trim();
    if (!term) {
      resultsContainer.innerHTML = '<div class="card p-4 text-center">Type to search...</div>';
      return;
    }

    const filtered = portDatabase.filter(p => 
      p.port.toString().includes(term) || 
      p.service.toLowerCase().includes(term) ||
      p.desc.toLowerCase().includes(term)
    );

    render(filtered);
  });
  
  // Render common ports initially? Or just empty. User asked for "Catalog".
  // Let's render "Top 10" initially.
  render(portDatabase.slice(0, 12));
}
