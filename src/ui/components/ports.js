export const portDatabase = [
  { port: 20, protocol: "TCP", service: "FTP-DATA", desc: "File Transfer Protocol (Data)" },
  { port: 21, protocol: "TCP", service: "FTP", desc: "File Transfer Protocol (Control)" },
  { port: 22, protocol: "TCP", service: "SSH", desc: "Secure Shell (Remote Login)" },
  { port: 23, protocol: "TCP", service: "Telnet", desc: "Unencrypted Text Communications" },
  { port: 25, protocol: "TCP", service: "SMTP", desc: "Simple Mail Transfer Protocol" },
  { port: 53, protocol: "UDP/TCP", service: "DNS", desc: "Domain Name System" },
  {
    port: 67,
    protocol: "UDP",
    service: "DHCP",
    desc: "Dynamic Host Configuration Protocol (Server)",
  },
  {
    port: 68,
    protocol: "UDP",
    service: "DHCP",
    desc: "Dynamic Host Configuration Protocol (Client)",
  },
  { port: 69, protocol: "UDP", service: "TFTP", desc: "Trivial File Transfer Protocol" },
  { port: 80, protocol: "TCP", service: "HTTP", desc: "Hypertext Transfer Protocol" },
  { port: 110, protocol: "TCP", service: "POP3", desc: "Post Office Protocol v3" },
  { port: 123, protocol: "UDP", service: "NTP", desc: "Network Time Protocol" },
  { port: 143, protocol: "TCP", service: "IMAP", desc: "Internet Message Access Protocol" },
  { port: 161, protocol: "UDP", service: "SNMP", desc: "Simple Network Management Protocol" },
  { port: 179, protocol: "TCP", service: "BGP", desc: "Border Gateway Protocol" },
  {
    port: 389,
    protocol: "TCP/UDP",
    service: "LDAP",
    desc: "Lightweight Directory Access Protocol",
  },
  { port: 443, protocol: "TCP", service: "HTTPS", desc: "HTTP over TLS/SSL" },
  { port: 445, protocol: "TCP", service: "SMB", desc: "Server Message Block" },
  {
    port: 500,
    protocol: "UDP",
    service: "ISAKMP",
    desc: "Internet Security Association and Key Management Protocol",
  },
  { port: 514, protocol: "UDP", service: "Syslog", desc: "System Logging Protocol" },
  { port: 636, protocol: "TCP", service: "LDAPS", desc: "LDAP over SSL" },
  { port: 993, protocol: "TCP", service: "IMAPS", desc: "IMAP over SSL" },
  { port: 995, protocol: "TCP", service: "POP3S", desc: "POP3 over SSL" },
  { port: 1433, protocol: "TCP", service: "SQL Server", desc: "Microsoft SQL Server" },
  { port: 1521, protocol: "TCP", service: "Oracle", desc: "Oracle Database" },
  { port: 3306, protocol: "TCP", service: "MySQL", desc: "MySQL Database System" },
  { port: 3389, protocol: "TCP", service: "RDP", desc: "Remote Desktop Protocol" },
  { port: 5060, protocol: "TCP/UDP", service: "SIP", desc: "Session Initiation Protocol" },
  { port: 5432, protocol: "TCP", service: "PostgreSQL", desc: "PostgreSQL Database" },
  { port: 5900, protocol: "TCP", service: "VNC", desc: "Virtual Network Computing" },
  { port: 8080, protocol: "TCP", service: "HTTP-Proxy", desc: "Common HTTP Proxy/Dev Port" },
];

export function initPortTool(container) {
  // 1. Render UI
  container.innerHTML = `
    <div class="max-w-2xl mx-auto space-y-6">
        <div class="bg-surface-dark cyber-border rounded p-6">
             <div class="relative">
                <span class="material-symbols-outlined absolute left-4 top-3 text-slate-500">search</span>
                <input id="port-search" type="text" placeholder="Search by Port (22), Protocol (SSH), or Keyword" 
                       class="w-full bg-black border border-border-dark rounded-full pl-12 pr-4 py-3 text-white focus:border-primary transition-colors">
             </div>
        </div>

        <div id="port-results" class="grid grid-cols-1 md:grid-cols-2 gap-4">
             <!-- Results -->
        </div>
    </div>
  `;

  const searchInput = container.querySelector("#port-search");
  const resultsContainer = container.querySelector("#port-results");

  function render(ports) {
    if (ports.length === 0) {
      resultsContainer.innerHTML = `
        <div class="col-span-full bg-surface-dark cyber-border rounded p-8 text-center text-slate-500">
            No matching ports found.
        </div>`;
      return;
    }

    resultsContainer.innerHTML = ports
      .map(p => {
        const isUDP = p.protocol.includes("UDP");
        const color = isUDP ? "text-yellow-500" : "text-primary";
        const badgeBg = isUDP ? "bg-yellow-500/10 text-yellow-500" : "bg-primary/10 text-primary";

        return `
      <div class="bg-surface-dark cyber-border rounded p-4 border-l-4 ${isUDP ? "border-l-yellow-600" : "border-l-primary"} hover:bg-white/5 transition-colors group">
        <div class="flex justify-between items-start mb-2">
          <h3 class="font-mono text-2xl font-bold text-white">${p.port}</h3>
          <span class="text-[10px] font-bold uppercase px-2 py-1 rounded ${badgeBg}">${p.protocol}</span>
        </div>
        <div class="font-bold text-white mb-1 group-hover:${color} transition-colors">${p.service}</div>
        <div class="text-xs text-slate-400 group-hover:text-slate-300">${p.desc}</div>
      </div>
    `;
      })
      .join("");
  }

  searchInput.addEventListener("input", e => {
    const term = e.target.value.toLowerCase().trim();
    if (!term) {
      render(portDatabase.slice(0, 12)); // Reset to top
      return;
    }

    const filtered = portDatabase.filter(
      p =>
        p.port.toString().includes(term) ||
        p.service.toLowerCase().includes(term) ||
        p.desc.toLowerCase().includes(term)
    );

    render(filtered);
  });

  // Initial render
  render(portDatabase.slice(0, 12));
}
