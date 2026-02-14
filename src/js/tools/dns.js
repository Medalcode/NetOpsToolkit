/**
 * Módulo de Búsqueda DNS (Tailwind Version)
 */
import { platformFetch } from "../platform/fetch.js";
import { buildDnsUrl, getDnsTypeName } from "./dns-core.js";
import { writeText } from "../platform/clipboard.js";

export function initDnsTool(container) {
  // 1. Render UI
  container.innerHTML = `
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <!-- Configuration Panel -->
        <div class="lg:col-span-1 bg-surface-dark cyber-border rounded p-4 h-fit">
            <h4 class="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Query Parameters</h4>
            
            <div class="space-y-4">
                <div>
                    <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Domain Name</label>
                    <input id="dns-domain" type="text" placeholder="example.com" class="w-full bg-black border border-border-dark rounded px-3 py-2 text-sm mono-data text-white placeholder-slate-700 focus:border-primary transition-colors">
                </div>

                <div>
                    <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Record Type</label>
                    <select id="dns-type" class="w-full bg-black border border-border-dark rounded px-3 py-2 text-sm mono-data text-white cursor-pointer">
                        <option value="A">A (IPv4)</option>
                        <option value="AAAA">AAAA (IPv6)</option>
                        <option value="MX">MX (Mail)</option>
                        <option value="TXT">TXT / SPF</option>
                        <option value="NS">NS (Nameserver)</option>
                        <option value="CNAME">CNAME</option>
                        <option value="SOA">SOA</option>
                        <option value="PTR">PTR</option>
                        <option value="ANY">ANY</option>
                    </select>
                </div>

                <div>
                    <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Resolver</label>
                    <select id="dns-resolver" class="w-full bg-black border border-border-dark rounded px-3 py-2 text-sm mono-data text-white cursor-pointer">
                        <option value="google">Google DoH</option>
                        <option value="cloudflare">Cloudflare DoH</option>
                    </select>
                </div>

                <button id="btn-dns-lookup" class="w-full bg-primary hover:bg-primary/80 text-white text-xs font-bold uppercase tracking-widest py-3 rounded transition-colors shadow-lg shadow-primary/20 mt-2">
                    Dig Command
                </button>
            </div>
        </div>

        <!-- Output Terminal -->
        <div class="lg:col-span-3">
            <div class="bg-surface-dark cyber-border rounded flex flex-col min-h-[400px]">
                <div class="flex items-center justify-between px-4 py-2 border-b border-border-dark">
                    <div class="flex items-center gap-2">
                        <span class="material-symbols-outlined !text-sm text-slate-500">terminal</span>
                        <span class="text-[10px] font-mono text-slate-500 uppercase">DNS Response Stream</span>
                    </div>
                    <div id="dns-status-indicator" class="size-2 rounded-full bg-slate-800"></div>
                </div>
                <!-- Scrollable Results Area -->
                <div id="dns-results" class="p-4 font-mono text-sm overflow-auto max-h-[500px] flex-1">
                     <span class="text-slate-600">Waiting for query...</span>
                </div>
            </div>
        </div>
    </div>
  `;

  // 2. Select Elements
  const domainInput = container.querySelector("#dns-domain");
  const typeSelect = container.querySelector("#dns-type");
  const resolverSelect = container.querySelector("#dns-resolver");
  const btnLookup = container.querySelector("#btn-dns-lookup");
  const resultsContainer = container.querySelector("#dns-results");
  const statusIndicator = container.querySelector("#dns-status-indicator");

  // 3. Logic
  async function lookup() {
    const domain = domainInput.value.trim();
    if (!domain) {
      resultsContainer.innerHTML =
        "<span class=\"text-red-500\">Error: Please enter a valid domain name.</span>";
      return;
    }

    const type = typeSelect.value;
    const resolver = resolverSelect.value;

    // UI Loading State
    resultsContainer.innerHTML = `<span class="text-primary animate-pulse">> Querying ${resolver} for ${domain} (${type})...</span>`;
    statusIndicator.className = "size-2 rounded-full bg-yellow-500 animate-pulse";

    const url = buildDnsUrl(resolver, domain, type);

    try {
      const response = await platformFetch(url, { headers: { Accept: "application/dns-json" } });
      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

      const data = await response.json();
      renderResults(data, type);
      statusIndicator.className = "size-2 rounded-full bg-signal-green";
    } catch (error) {
      resultsContainer.innerHTML += `\n<span class="text-red-500">Connection Failed: ${error.message}</span>`;
      statusIndicator.className = "size-2 rounded-full bg-red-500";
    }
  }

  function renderResults(data, requestedType) {
    if (!data.Answer) {
      resultsContainer.innerHTML = `
            <div class="text-slate-400 mb-2">> Query completed with status: <span class="text-white">${data.Status}</span></div>
            <div class="text-yellow-500">> No ${requestedType} records found for ${data.Question[0].name.replace(/\.$/, "")}</div>
        `;
      return;
    }

    let outputHtml = `<div class="text-slate-400 mb-4">> Query successful. Found ${data.Answer.length} records (TTL shown in seconds).</div>`;

    outputHtml += `<table class="w-full text-left border-collapse mb-4">
        <thead class="text-[10px] text-slate-500 uppercase border-b border-slate-800">
            <tr>
                <th class="py-2">Name</th>
                <th class="py-2">Type</th>
                <th class="py-2">TTL</th>
                <th class="py-2">Data</th>
            </tr>
        </thead>
        <tbody class="text-xs">`;

    data.Answer.forEach(record => {
      // Map type integer to string if needed, mostly API returns int sometimes
      // Google/Cloudflare usually return type number, need to handle if strictly needed,
      // but typically 'data.Answer' has 'type' as int. Let's trust user knows 1=A or just show raw.
      // Actually, let's keep it raw or generic.

      outputHtml += `
            <tr class="border-b border-slate-800/50 hover:bg-white/5 transition-colors group">
                <td class="py-2 text-slate-300">${record.name}</td>
                <td class="py-2 text-primary">${getDnsTypeName(record.type)}</td>
                <td class="py-2 text-slate-400">${record.TTL}</td>
                <td class="py-2 text-signal-green break-all">
                    ${record.data}
                    <button class="dns-copy-btn opacity-0 group-hover:opacity-100 ml-2 text-[10px] text-slate-500 hover:text-white border border-slate-700 px-1 rounded transition-opacity" 
                            data-record="${encodeURIComponent(record.data)}">COPY</button>
                </td>
            </tr>
        `;
    });

    outputHtml += "</tbody></table>";

    // Raw JSON details
    outputHtml += `<div class="mt-4 pt-4 border-t border-slate-800">
        <span class="text-[10px] text-slate-600 block mb-1">RAW PROVIDER RESPONSE</span>
        <pre class="text-[10px] text-slate-500 overflow-x-auto">${JSON.stringify(data, null, 2)}</pre>
    </div>`;

    resultsContainer.innerHTML = outputHtml;
    // Attach copy handlers using platform clipboard wrapper
    try {
      const copyButtons = resultsContainer.querySelectorAll(".dns-copy-btn");
      copyButtons.forEach(btn => {
        btn.addEventListener("click", async () => {
          const val = btn.getAttribute("data-record") || "";
          const text = decodeURIComponent(val);
          try {
            await writeText(text);
          } catch (err) {
            console.error("Clipboard write failed", err);
          }
        });
      });
    } catch (err) {
      // Non-fatal: keep original behavior if DOM APIs fail
      console.error("Failed to attach copy handlers", err);
    }
  }

  // getDnsTypeName moved to dns-core.js and imported above

  // Listeners
  btnLookup.addEventListener("click", lookup);
  domainInput.addEventListener("keypress", e => {
    if (e.key === "Enter") lookup();
  });
}
