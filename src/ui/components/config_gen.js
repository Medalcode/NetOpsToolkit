import { calculateVLSM } from "../../core/network.js";
import { writeText } from "../../platform/clipboard.js";
import { showToast } from "../shared/ui-engine.js";

export function initConfigGenTool(container) {
  container.innerHTML = `
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        <!-- Input Panel -->
        <div class="lg:col-span-1 bg-surface-dark cyber-border rounded p-6 flex flex-col gap-4 overflow-y-auto custom-scrollbar">
            <h4 class="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-border-dark pb-2">Full Config Generator</h4>
            
            <div>
                 <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Base Network</label>
                 <input type="text" id="cfg-base-net" placeholder="10.0.0.0/16" value="10.0.0.0/16" class="w-full bg-black border border-border-dark rounded px-3 py-2 text-sm text-white focus:border-primary transition-colors">
            </div>

            <div>
                 <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Number of VLANs (Subnets)</label>
                 <input type="number" id="cfg-vlans" value="4" min="1" max="50" class="w-full bg-black border border-border-dark rounded px-3 py-2 text-sm text-white focus:border-primary transition-colors">
            </div>

            <div>
                 <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Admin Password</label>
                 <input type="text" id="cfg-pass" value="Admin123!" class="w-full bg-black border border-border-dark rounded px-3 py-2 text-sm text-white focus:border-primary transition-colors">
            </div>

            <div class="flex items-center gap-2 mt-2">
                 <input type="checkbox" id="cfg-ospf" checked class="accent-primary size-4">
                 <label class="text-xs text-slate-400">Enable OSPF (Area 0)</label>
            </div>

            <div class="flex items-center gap-2">
                 <input type="checkbox" id="cfg-dhcp" checked class="accent-primary size-4">
                 <label class="text-xs text-slate-400">Enable DHCP Servers</label>
            </div>

            <button id="btn-cfg-gen" class="w-full bg-primary hover:bg-primary-hover text-black font-bold uppercase tracking-widest py-3 px-4 rounded transition-colors mt-auto">
                 Generate Configurations
            </button>
        </div>

        <!-- Output Panel -->
        <div class="lg:col-span-2 bg-surface-dark cyber-border rounded p-6 flex flex-col">
            <div class="flex justify-between items-center mb-4 border-b border-border-dark pb-2">
                <div class="flex gap-4">
                   <button class="tab-btn text-primary border-b-2 border-primary pb-1 text-xs uppercase font-bold transition-colors" data-target="out-cisco">Cisco IOS</button>
                   <button class="tab-btn text-slate-500 hover:text-white border-b-2 border-transparent pb-1 text-xs uppercase font-bold transition-colors" data-target="out-mikrotik">Mikrotik</button>
                   <button class="tab-btn text-slate-500 hover:text-white border-b-2 border-transparent pb-1 text-xs uppercase font-bold transition-colors" data-target="out-junos">JunOS</button>
                </div>
                <button id="btn-cfg-copy" class="text-xs font-bold text-slate-400 hover:text-white transition-colors uppercase flex items-center gap-1">
                   <span class="material-symbols-outlined text-sm">content_copy</span> Copy
                </button>
            </div>
            
            <textarea id="out-cisco" readonly class="out-area w-full flex-1 bg-black rounded border border-border-dark p-4 text-signal-green font-mono text-sm resize-none focus:outline-none custom-scrollbar"></textarea>
            <textarea id="out-mikrotik" readonly class="out-area hidden w-full flex-1 bg-black rounded border border-border-dark p-4 text-signal-green font-mono text-sm resize-none focus:outline-none custom-scrollbar"></textarea>
            <textarea id="out-junos" readonly class="out-area hidden w-full flex-1 bg-black rounded border border-border-dark p-4 text-signal-green font-mono text-sm resize-none focus:outline-none custom-scrollbar"></textarea>
        </div>
    </div>
  `;

  const btnGen = container.querySelector("#btn-cfg-gen");
  const btnCopy = container.querySelector("#btn-cfg-copy");
  const tabs = container.querySelectorAll(".tab-btn");
  const areas = container.querySelectorAll(".out-area");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => {
        t.classList.remove("text-primary", "border-primary");
        t.classList.add("text-slate-500", "border-transparent");
      });
      tab.classList.remove("text-slate-500", "border-transparent");
      tab.classList.add("text-primary", "border-primary");

      areas.forEach(a => a.classList.add("hidden"));
      container.querySelector(`#${tab.dataset.target}`).classList.remove("hidden");
    });
  });

  btnGen.addEventListener("click", () => {
    const baseNet = container.querySelector("#cfg-base-net").value.trim();
    const vlansCount = parseInt(container.querySelector("#cfg-vlans").value, 10);
    const pass = container.querySelector("#cfg-pass").value;
    const useOspf = container.querySelector("#cfg-ospf").checked;
    const useDhcp = container.querySelector("#cfg-dhcp").checked;

    if (!baseNet.includes("/")) {
      showToast("Base network must include CIDR (e.g. 10.0.0.0/16)", "error");
      return;
    }

    const [, prefixStr] = baseNet.split("/");
    const prefix = parseInt(prefixStr, 10);
    const newPrefix = prefix + Math.ceil(Math.log2(vlansCount));
    if (newPrefix > 30) {
      showToast("Not enough space for that many VLANs", "error");
      return;
    }
    const hostsPerSubnet = Math.pow(2, 32 - newPrefix) - 2;

    const requirements = [];
    for (let i = 1; i <= vlansCount; i++) {
      requirements.push({ name: `VLAN_${i * 10}`, size: hostsPerSubnet });
    }

    try {
      const subnets = calculateVLSM(baseNet, requirements);

      let ciscoStr = `! Auto-Generated Cisco IOS Config\nhostname Router1\nenable secret ${pass}\n`;
      let mtStr = `# Auto-Generated Mikrotik Config\n/system identity set name="Router1"\n/user set admin password="${pass}"\n`;
      let junosStr = `# Auto-Generated JunOS Config\nset system host-name Router1\nset system root-authentication plain-text-password-value ${pass}\n`;

      if (useOspf) {
        ciscoStr += "router ospf 1\n";
        mtStr += "/routing ospf instance add name=default\n/routing ospf area add instance=default name=backbone area-id=0.0.0.0\n";
        junosStr += "set protocols ospf area 0.0.0.0\n";
      }

      subnets.forEach((sub, i) => {
        const vlanId = (i + 1) * 10;
        const gw = sub.rangeStart;

        // Cisco
        ciscoStr += `\nvlan ${vlanId}\n name ${sub.name}\n`;
        ciscoStr += `interface Vlan${vlanId}\n description ${sub.name}\n ip address ${gw} ${sub.mask}\n no shutdown\n`;
        if (useOspf) {
          ciscoStr += ` router ospf 1\n network ${sub.network} ${sub.wildcard} area 0\n`;
        }
        if (useDhcp) {
          ciscoStr += `ip dhcp pool ${sub.name}\n network ${sub.network} ${sub.mask}\n default-router ${gw}\n dns-server 8.8.8.8\n`;
        }

        // Mikrotik
        mtStr += `\n/interface vlan add name=vlan${vlanId} vlan-id=${vlanId} interface=ether1\n`;
        mtStr += `/ip address add address=${gw}/${sub.prefix} interface=vlan${vlanId} comment="${sub.name}"\n`;
        if (useOspf) {
          mtStr += `/routing ospf network add network=${sub.network}/${sub.prefix} area=backbone\n`;
        }
        if (useDhcp) {
          const endIp = sub.rangeEnd;
          mtStr += `/ip pool add name=pool_${vlanId} ranges=${gw}-${endIp}\n`;
          mtStr += `/ip dhcp-server add name=dhcp_${vlanId} interface=vlan${vlanId} address-pool=pool_${vlanId} disabled=no\n`;
          mtStr += `/ip dhcp-server network add address=${sub.network}/${sub.prefix} gateway=${gw} dns-server=8.8.8.8\n`;
        }

        // Junos
        junosStr += `\nset vlans ${sub.name} vlan-id ${vlanId}\n`;
        junosStr += `set interfaces irb unit ${vlanId} family inet address ${gw}/${sub.prefix}\n`;
        junosStr += `set vlans ${sub.name} l3-interface irb.${vlanId}\n`;
        if (useOspf) {
          junosStr += `set protocols ospf area 0.0.0.0 interface irb.${vlanId}\n`;
        }
      });

      container.querySelector("#out-cisco").value = ciscoStr;
      container.querySelector("#out-mikrotik").value = mtStr;
      container.querySelector("#out-junos").value = junosStr;

      showToast("Configurations generated", "success");
    } catch (e) {
      showToast(e.message, "error");
    }
  });

  btnCopy.addEventListener("click", async () => {
    let activeArea = null;
    areas.forEach(a => {
      if (!a.classList.contains("hidden")) activeArea = a;
    });
    if (activeArea && activeArea.value) {
      await writeText(activeArea.value);
      showToast("Copied to clipboard!", "success");
    }
  });
}
