import { writeText } from "../../platform/clipboard.js";
import { showToast } from "../shared/ui-engine.js";

export function initAclBuilderTool(container) {
  container.innerHTML = `
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Input Form -->
      <div class="bg-surface-dark border border-border-dark rounded p-6">
        <h3 class="text-white font-bold mb-4 uppercase tracking-widest text-xs">Rule Configuration</h3>
        
        <div class="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label class="block text-slate-400 text-xs mb-1">ACL Type</label>
            <select id="acl-type" class="w-full bg-black border border-border-dark rounded p-2 text-white text-sm focus:border-primary focus:outline-none">
              <option value="extended">Extended (100-199)</option>
              <option value="standard">Standard (1-99)</option>
            </select>
          </div>
          <div>
            <label class="block text-slate-400 text-xs mb-1">ACL Number</label>
            <input type="number" id="acl-number" value="100" class="w-full bg-black border border-border-dark rounded p-2 text-white text-sm focus:border-primary focus:outline-none" />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label class="block text-slate-400 text-xs mb-1">Action</label>
            <select id="acl-action" class="w-full bg-black border border-border-dark rounded p-2 text-white text-sm focus:border-primary focus:outline-none">
              <option value="permit">Permit</option>
              <option value="deny">Deny</option>
            </select>
          </div>
          <div id="protocol-container">
            <label class="block text-slate-400 text-xs mb-1">Protocol</label>
            <select id="acl-protocol" class="w-full bg-black border border-border-dark rounded p-2 text-white text-sm focus:border-primary focus:outline-none">
              <option value="ip">IP</option>
              <option value="tcp">TCP</option>
              <option value="udp">UDP</option>
              <option value="icmp">ICMP</option>
            </select>
          </div>
        </div>

        <div class="mb-4">
          <label class="block text-slate-400 text-xs mb-1">Source</label>
          <div class="flex gap-2">
            <select id="src-type" class="w-1/3 bg-black border border-border-dark rounded p-2 text-white text-sm focus:border-primary focus:outline-none">
              <option value="any">Any</option>
              <option value="host">Host</option>
              <option value="network">Network</option>
            </select>
            <input type="text" id="src-ip" placeholder="IP Address" class="w-1/3 hidden bg-black border border-border-dark rounded p-2 text-white text-sm focus:border-primary focus:outline-none" />
            <input type="text" id="src-wc" placeholder="Wildcard Mask" class="w-1/3 hidden bg-black border border-border-dark rounded p-2 text-white text-sm focus:border-primary focus:outline-none" />
          </div>
        </div>

        <div id="dest-container" class="mb-4">
          <label class="block text-slate-400 text-xs mb-1">Destination</label>
          <div class="flex gap-2">
            <select id="dst-type" class="w-1/3 bg-black border border-border-dark rounded p-2 text-white text-sm focus:border-primary focus:outline-none">
              <option value="any">Any</option>
              <option value="host">Host</option>
              <option value="network">Network</option>
            </select>
            <input type="text" id="dst-ip" placeholder="IP Address" class="w-1/3 hidden bg-black border border-border-dark rounded p-2 text-white text-sm focus:border-primary focus:outline-none" />
            <input type="text" id="dst-wc" placeholder="Wildcard Mask" class="w-1/3 hidden bg-black border border-border-dark rounded p-2 text-white text-sm focus:border-primary focus:outline-none" />
          </div>
        </div>

        <div id="port-container" class="mb-6 hidden">
          <label class="block text-slate-400 text-xs mb-1">Destination Port (Optional)</label>
          <div class="flex gap-2">
            <select id="port-op" class="w-1/3 bg-black border border-border-dark rounded p-2 text-white text-sm focus:border-primary focus:outline-none">
              <option value="">None</option>
              <option value="eq">Equals (eq)</option>
              <option value="gt">Greater Than (gt)</option>
              <option value="lt">Less Than (lt)</option>
            </select>
            <input type="text" id="port-val" placeholder="Port (e.g. 80, 443)" class="w-2/3 hidden bg-black border border-border-dark rounded p-2 text-white text-sm focus:border-primary focus:outline-none" />
          </div>
        </div>

        <button id="btn-add-rule" class="w-full bg-primary hover:bg-primary-hover text-black font-bold py-3 px-4 rounded transition-colors">
          Add Rule
        </button>
      </div>

      <!-- Output Display -->
      <div class="bg-surface-dark border border-border-dark rounded p-6 flex flex-col">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-white font-bold uppercase tracking-widest text-xs">Generated ACL</h3>
          <button id="btn-copy-acl" class="text-primary hover:text-white transition-colors text-xs flex items-center gap-1">
            <span class="material-symbols-outlined text-sm">content_copy</span> Copy All
          </button>
        </div>
        <textarea id="acl-output" class="flex-1 w-full bg-black border border-border-dark rounded p-4 text-signal-green font-mono text-sm resize-none focus:border-primary focus:outline-none custom-scrollbar" readonly></textarea>
        <button id="btn-clear-acl" class="mt-4 text-slate-500 hover:text-red-500 transition-colors text-xs uppercase tracking-widest">
          Clear Rules
        </button>
      </div>
    </div>
  `;

  // UI Logic
  const typeSelect = container.querySelector("#acl-type");
  const protocolContainer = container.querySelector("#protocol-container");
  const destContainer = container.querySelector("#dest-container");
  const protocolSelect = container.querySelector("#acl-protocol");
  const portContainer = container.querySelector("#port-container");
  const portOp = container.querySelector("#port-op");
  const portVal = container.querySelector("#port-val");

  const srcType = container.querySelector("#src-type");
  const srcIp = container.querySelector("#src-ip");
  const srcWc = container.querySelector("#src-wc");
  const dstType = container.querySelector("#dst-type");
  const dstIp = container.querySelector("#dst-ip");
  const dstWc = container.querySelector("#dst-wc");

  const aclNumber = container.querySelector("#acl-number");
  const aclAction = container.querySelector("#acl-action");

  const btnAdd = container.querySelector("#btn-add-rule");
  const output = container.querySelector("#acl-output");
  const btnCopy = container.querySelector("#btn-copy-acl");
  const btnClear = container.querySelector("#btn-clear-acl");

  function toggleFields() {
    const isStd = typeSelect.value === "standard";
    protocolContainer.style.display = isStd ? "none" : "block";
    destContainer.style.display = isStd ? "none" : "block";

    if (isStd) {
      portContainer.classList.add("hidden");
    } else {
      const proto = protocolSelect.value;
      if (proto === "tcp" || proto === "udp") {
        portContainer.classList.remove("hidden");
      } else {
        portContainer.classList.add("hidden");
      }
    }
  }

  function handleIpTypeChange(typeEl, ipEl, wcEl) {
    if (typeEl.value === "any") {
      ipEl.classList.add("hidden");
      wcEl.classList.add("hidden");
    } else if (typeEl.value === "host") {
      ipEl.classList.remove("hidden");
      wcEl.classList.add("hidden");
    } else {
      ipEl.classList.remove("hidden");
      wcEl.classList.remove("hidden");
    }
  }

  typeSelect.addEventListener("change", () => {
    if (typeSelect.value === "standard") {
      aclNumber.value = aclNumber.value > 99 ? 10 : aclNumber.value;
    } else {
      aclNumber.value = aclNumber.value < 100 ? 100 : aclNumber.value;
    }
    toggleFields();
  });
  protocolSelect.addEventListener("change", toggleFields);

  srcType.addEventListener("change", () => handleIpTypeChange(srcType, srcIp, srcWc));
  dstType.addEventListener("change", () => handleIpTypeChange(dstType, dstIp, dstWc));

  portOp.addEventListener("change", () => {
    if (portOp.value) portVal.classList.remove("hidden");
    else portVal.classList.add("hidden");
  });

  btnAdd.addEventListener("click", () => {
    const isStd = typeSelect.value === "standard";
    let rule = `access-list ${aclNumber.value} ${aclAction.value}`;

    // Source formatting
    const formatIp = (type, ip, wc) => {
      if (type === "any") return "any";
      if (type === "host") return `host ${ip}`;
      return `${ip} ${wc}`;
    };

    const srcStr = formatIp(srcType.value, srcIp.value, srcWc.value);

    if (isStd) {
      rule += ` ${srcStr}`;
    } else {
      rule += ` ${protocolSelect.value} ${srcStr}`;
      const dstStr = formatIp(dstType.value, dstIp.value, dstWc.value);
      rule += ` ${dstStr}`;

      if (
        (protocolSelect.value === "tcp" || protocolSelect.value === "udp") &&
        portOp.value &&
        portVal.value
      ) {
        rule += ` ${portOp.value} ${portVal.value}`;
      }
    }

    if (output.value) {
      output.value += "\n" + rule;
    } else {
      output.value = rule;
    }
    showToast("Rule added", "success");
  });

  btnCopy.addEventListener("click", async () => {
    if (!output.value) return;
    await writeText(output.value);
    showToast("ACL copied to clipboard!", "success");
  });

  btnClear.addEventListener("click", () => {
    output.value = "";
  });
}
