import { copyToClipboard } from "../shared/clipboard.js";
import { showToast } from "../shared/ui-engine.js";

const templateDatabase = {
  cisco: [
    {
      title: "Basic Router Setup",
      description: "Initial router configuration with hostname, domain, and secret",
      code: `enable
configure terminal
hostname Router1
ip domain-name local.lab
enable secret Class123!
line console 0
 password Cisco123!
 login
 exit
line vty 0 4
 password Cisco123!
 login
 exit`,
    },
    {
      title: "Enable SSH",
      description: "Generates RSA keys and configures SSH version 2",
      code: `crypto key generate rsa modulus 2048
ip ssh version 2
line vty 0 4
 transport input ssh
 login local
 exit
username admin privilege 15 secret Admin123!`,
    },
    {
      title: "Basic OSPF",
      description: "Configure OSPF for a single area",
      code: `router ospf 1
 network 192.168.1.0 0.0.0.255 area 0
 network 10.0.0.0 0.255.255.255 area 0
 passive-interface default
 no passive-interface GigabitEthernet0/0`,
    },
  ],
  mikrotik: [
    {
      title: "Basic Setup",
      description: "Set identity, DNS, and basic security",
      code: `/system identity set name="Router1"
/ip dns set allow-remote-requests=yes servers=8.8.8.8,1.1.1.1
/user add name=admin_new password="Admin123!" group=full
/user disable admin`,
    },
    {
      title: "NAT Configuration",
      description: "Masquerade NAT for WAN interface",
      code: "/ip firewall nat add chain=srcnat out-interface=ether1 action=masquerade comment=\"WAN NAT\"",
    },
    {
      title: "Enable SSH & Disable Telnet",
      description: "Secure management access",
      code: `/ip service disable telnet,ftp,www
/ip service set ssh port=22`,
    },
  ],
  juniper: [
    {
      title: "Initial Setup",
      description: "Root password and hostname",
      code: `configure
set system host-name Router1
set system root-authentication plain-text-password
set system services ssh
commit`,
    },
    {
      title: "Interface IP Configuration",
      description: "Assign an IP address to a physical interface",
      code: `set interfaces ge-0/0/0 unit 0 family inet address 192.168.1.1/24
commit`,
    },
  ],
  fortigate: [
    {
      title: "Basic Interface Setup",
      description: "Configure WAN/LAN interfaces",
      code: `config system interface
 edit "wan1"
  set mode dhcp
  set allowaccess ping
 next
 edit "internal"
  set ip 192.168.1.99 255.255.255.0
  set allowaccess ping https ssh
 next
end`,
    },
    {
      title: "Static Route",
      description: "Default static route",
      code: `config router static
 edit 1
  set dst 0.0.0.0 0.0.0.0
  set gateway 192.168.1.254
  set device "wan1"
 next
end`,
    },
  ],
};

export function initTemplateTool(container) {
  container.innerHTML = `
    <div class="grid grid-cols-12 gap-6 h-[500px]">
      <!-- Sidebar -->
      <div class="col-span-12 md:col-span-3 border-r border-border-dark pr-4 flex flex-col gap-2">
        <h4 class="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Vendors</h4>
        <button class="vendor-btn active w-full text-left px-4 py-2 rounded text-sm transition-colors bg-primary/10 text-primary" data-vendor="cisco">Cisco IOS</button>
        <button class="vendor-btn w-full text-left px-4 py-2 rounded text-sm transition-colors text-slate-400 hover:text-white hover:bg-white/5" data-vendor="mikrotik">Mikrotik</button>
        <button class="vendor-btn w-full text-left px-4 py-2 rounded text-sm transition-colors text-slate-400 hover:text-white hover:bg-white/5" data-vendor="juniper">Juniper</button>
        <button class="vendor-btn w-full text-left px-4 py-2 rounded text-sm transition-colors text-slate-400 hover:text-white hover:bg-white/5" data-vendor="fortigate">Fortigate</button>
      </div>
      <!-- Content -->
      <div class="col-span-12 md:col-span-9 flex flex-col gap-4 overflow-y-auto custom-scrollbar pr-2" id="templates-content">
        <!-- Templates will be injected here -->
      </div>
    </div>
  `;

  const vendorBtns = container.querySelectorAll(".vendor-btn");
  const contentArea = container.querySelector("#templates-content");

  function renderTemplates(vendor) {
    const templates = templateDatabase[vendor];
    contentArea.innerHTML = "";

    if (!templates || templates.length === 0) {
      contentArea.innerHTML =
        "<div class=\"text-slate-500 text-sm\">No templates found for this vendor.</div>";
      return;
    }

    templates.forEach(t => {
      const card = document.createElement("div");
      card.className = "bg-black/50 border border-border-dark rounded p-4 group";

      const header = document.createElement("div");
      header.className = "flex justify-between items-start mb-2";
      header.innerHTML = `
        <div>
          <h4 class="text-white font-bold">${t.title}</h4>
          <p class="text-slate-400 text-xs">${t.description}</p>
        </div>
        <button class="btn-copy-tpl text-slate-500 hover:text-primary transition-colors p-1" title="Copy to clipboard">
          <span class="material-symbols-outlined !text-lg">content_copy</span>
        </button>
      `;

      const pre = document.createElement("pre");
      pre.className =
        "bg-black p-3 rounded mono-data text-signal-green text-xs overflow-x-auto border border-border-dark/50 mt-3";
      pre.textContent = t.code;

      card.appendChild(header);
      card.appendChild(pre);
      contentArea.appendChild(card);

      // Event listener for copy
      const copyBtn = card.querySelector(".btn-copy-tpl");
      copyBtn.addEventListener("click", async () => {
        const success = await copyToClipboard(t.code);
        if (success) {
          showToast("Template copied to clipboard!", "success");
        } else {
          showToast("Failed to copy template", "error");
        }
      });
    });
  }

  vendorBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      // Update active state
      vendorBtns.forEach(b => {
        b.classList.remove("bg-primary/10", "text-primary");
        b.classList.add("text-slate-400", "hover:text-white", "hover:bg-white/5");
      });
      btn.classList.add("bg-primary/10", "text-primary");
      btn.classList.remove("text-slate-400", "hover:text-white", "hover:bg-white/5");

      // Render
      renderTemplates(btn.dataset.vendor);
    });
  });

  // Initial render
  renderTemplates("cisco");
}
