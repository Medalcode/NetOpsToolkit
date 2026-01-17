/**
 * Módulo Generador de Configuraciones (Tailwind Version)
 */
export function initConfigGenTool(container) {
  // 1. Render UI Structure
  container.innerHTML = `
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto h-full">
        <!-- Input Panel -->
        <div class="bg-surface-dark cyber-border rounded p-6 flex flex-col gap-6">
            <h4 class="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-border-dark pb-2">Configuration Parameters</h4>
            
            <div>
                 <label class="block text-[10px] font-bold text-slate-500 uppercase mb-2">Platform Template</label>
                 <select id="cfg-template" class="w-full bg-black border border-border-dark rounded px-3 py-2 text-sm mono-data text-white cursor-pointer focus:border-primary transition-colors">
                    <option value="cisco-vlan">Cisco IOS: Interface VLAN</option>
                    <option value="mikrotik-ip">Mikrotik: IP Address</option>
                    <option value="juniper-bgroup">Juniper Junos: Port Config</option>
                 </select>
            </div>
            
            <div id="cfg-form" class="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                <!-- Dynamic Fields Here -->
                 <p class="text-slate-500 text-sm">Select a template to load fields.</p>
            </div>

            <button id="btn-cfg-gen" class="w-full bg-primary hover:bg-primary/80 text-white font-bold uppercase tracking-widest py-3 rounded transition-colors shadow-lg shadow-primary/20 flex items-center justify-center gap-2 mt-auto">
                 <span class="material-symbols-outlined !text-sm">bolt</span> Generate Config
            </button>
        </div>

        <!-- Output Panel -->
        <div class="bg-surface-dark cyber-border rounded p-6 flex flex-col">
            <div class="flex justify-between items-center mb-4 border-b border-border-dark pb-2">
                <h4 class="text-xs font-bold text-slate-500 uppercase tracking-widest">Generated CLI Output</h4>
                <button id="btn-cfg-copy" class="text-xs font-bold text-primary hover:text-white transition-colors uppercase">Copy</button>
            </div>
            
            <div class="relative flex-1 bg-black rounded border border-border-dark p-4 group">
                 <textarea id="cfg-output" readonly class="w-full h-full bg-transparent text-signal-green font-mono text-sm resize-none focus:outline-none" placeholder="# Config will appear here..."></textarea>
                 <div class="absolute bottom-2 right-2 text-[10px] text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">READ ONLY</div>
            </div>
        </div>
    </div>
  `;
  
  const templateSelect = container.querySelector('#cfg-template');
  const formContainer = container.querySelector('#cfg-form');
  const outputArea = container.querySelector('#cfg-output');
  const btnGenerate = container.querySelector('#btn-cfg-gen');
  const btnCopy = container.querySelector('#btn-cfg-copy');

  const templates = {
    'cisco-vlan': {
        name: 'Cisco Interface VLAN',
        fields: [
            { id: 'interface', label: 'Interface Range', placeholder: 'Gi1/0/1-48' },
            { id: 'vlan_data', label: 'Data VLAN ID', placeholder: '10' },
            { id: 'vlan_voice', label: 'Voice VLAN ID', placeholder: '20' },
            { id: 'desc', label: 'Description', placeholder: 'User Ports' }
        ],
        generate: (data) => `
interface range ${data.interface}
 description ${data.desc}
 switchport mode access
 switchport access vlan ${data.vlan_data}
 switchport voice vlan ${data.vlan_voice}
 spanning-tree portfast
 no shutdown
 exit
`
    },
    'mikrotik-ip': {
        name: 'Mikrotik IP Address',
        fields: [
            { id: 'address', label: 'IP Address/CIDR', placeholder: '192.168.88.1/24' },
            { id: 'interface', label: 'Interface Name', placeholder: 'ether1' },
            { id: 'comment', label: 'Comment', placeholder: 'WAN Uplink' }
        ],
        generate: (data) => `/ip address add address=${data.address} interface=${data.interface} comment="${data.comment}"`
    },
    'juniper-bgroup': {
        name: 'Juniper Port Config',
        fields: [
            { id: 'interface', label: 'Interface', placeholder: 'ge-0/0/0' },
            { id: 'desc', label: 'Description', placeholder: 'Uplink' },
            { id: 'vlan', label: 'VLAN Member', placeholder: 'vlan-trust' }
        ],
        generate: (data) => `
set interfaces ${data.interface} description "${data.desc}"
set interfaces ${data.interface} unit 0 family ethernet-switching vlan members ${data.vlan}
`
    }
  };

  function renderForm(templateKey) {
    const tmpl = templates[templateKey];
    if (!tmpl) return;

    formContainer.innerHTML = tmpl.fields.map(field => `
        <div>
            <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1" for="cfg-${field.id}">${field.label}</label>
            <input type="text" id="cfg-${field.id}" placeholder="${field.placeholder}" autocomplete="off" 
                   class="w-full bg-slate-900 border border-border-dark rounded px-3 py-2 text-sm text-white focus:border-primary transition-colors">
        </div>
    `).join('');
  }

  function generate() {
    const templateKey = templateSelect.value;
    const tmpl = templates[templateKey];
    if (!tmpl) return;

    const data = {};
    tmpl.fields.forEach(field => {
        const el = container.querySelector(`#cfg-${field.id}`);
        data[field.id] = el ? el.value : '';
    });

    const result = tmpl.generate(data).trim();
    outputArea.value = result;
  }

  btnCopy.addEventListener('click', () => {
      if (!outputArea.value) return;
      navigator.clipboard.writeText(outputArea.value);
      btnCopy.textContent = 'COPIED!';
      btnCopy.classList.add('text-signal-green');
      setTimeout(() => {
          btnCopy.textContent = 'COPY';
          btnCopy.classList.remove('text-signal-green');
      }, 1500);
  });

  // Event Listeners
  templateSelect.addEventListener('change', (e) => renderForm(e.target.value));
  btnGenerate.addEventListener('click', generate);

  // Init
  renderForm(templateSelect.value);
}
