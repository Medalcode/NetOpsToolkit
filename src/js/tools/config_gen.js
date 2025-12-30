export function initConfigGenTool() {
  const templateSelect = document.getElementById('cfg-template');
  const formContainer = document.getElementById('cfg-form');
  const outputArea = document.getElementById('cfg-output');
  const btnGenerate = document.getElementById('btn-cfg-gen');

  if (!templateSelect || !outputArea) return;

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
        <div class="input-group">
            <label for="cfg-${field.id}">${field.label}</label>
            <input type="text" id="cfg-${field.id}" placeholder="${field.placeholder}" autocomplete="off">
        </div>
    `).join('');
  }

  function generate() {
    const templateKey = templateSelect.value;
    const tmpl = templates[templateKey];
    if (!tmpl) return;

    const data = {};
    tmpl.fields.forEach(field => {
        const el = document.getElementById(`cfg-${field.id}`);
        data[field.id] = el ? el.value : '';
    });

    const result = tmpl.generate(data).trim();
    outputArea.textContent = result;
  }

  // Event Listeners
  templateSelect.addEventListener('change', (e) => renderForm(e.target.value));
  btnGenerate.addEventListener('click', generate);

  // Init
  renderForm(templateSelect.value);
}
