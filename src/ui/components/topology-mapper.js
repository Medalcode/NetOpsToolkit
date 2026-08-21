/**
 * Network Topology Mapper Component
 * Allows users to add network nodes (Router, Switch, Subnet, Firewall)
 * and connect them interactively with SVG links.
 * @module topology-mapper
 */

import { showToast } from "../shared/ui-engine.js";

let nodes = [
  { id: "node-1", type: "router", name: "Core-RTR-01", x: 150, y: 120 },
  { id: "node-2", type: "switch", name: "Dist-SW-01", x: 400, y: 120 },
  { id: "node-3", type: "subnet", name: "VLAN 10 (192.168.10.0/24)", x: 650, y: 80 },
  { id: "node-4", type: "subnet", name: "VLAN 20 (192.168.20.0/24)", x: 650, y: 180 },
];

let links = [
  { from: "node-1", to: "node-2" },
  { from: "node-2", to: "node-3" },
  { from: "node-2", to: "node-4" },
];

export function initTopologyMapper(container) {
  container.innerHTML = `
    <div class="flex flex-col h-[650px] bg-surface-dark cyber-border rounded p-4 relative">
      <!-- Toolbar -->
      <div class="flex flex-wrap justify-between items-center border-b border-border-dark pb-3 mb-3 gap-2">
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined text-primary">hub</span>
          <h4 class="text-white font-bold tracking-widest uppercase text-sm">Network Topology Mapper</h4>
        </div>
        <div class="flex items-center gap-2">
          <button id="btn-add-router" class="px-3 py-1.5 bg-black border border-border-dark text-xs text-slate-300 hover:text-white hover:border-primary rounded flex items-center gap-1 transition-colors">
            <span class="material-symbols-outlined text-sm text-primary">router</span> + Router
          </button>
          <button id="btn-add-switch" class="px-3 py-1.5 bg-black border border-border-dark text-xs text-slate-300 hover:text-white hover:border-primary rounded flex items-center gap-1 transition-colors">
            <span class="material-symbols-outlined text-sm text-emerald-400">switch</span> + Switch
          </button>
          <button id="btn-add-subnet" class="px-3 py-1.5 bg-black border border-border-dark text-xs text-slate-300 hover:text-white hover:border-primary rounded flex items-center gap-1 transition-colors">
            <span class="material-symbols-outlined text-sm text-cyan-400">lan</span> + Subnet
          </button>
          <button id="btn-clear-topo" class="px-3 py-1.5 bg-red-500/10 border border-red-500/30 text-xs text-red-400 hover:bg-red-500 hover:text-white rounded transition-colors">
            Clear
          </button>
        </div>
      </div>

      <!-- Canvas Container -->
      <div id="topo-canvas-wrapper" class="flex-1 relative bg-black/60 border border-border-dark rounded-lg overflow-hidden custom-scrollbar">
        <svg id="topo-svg" class="absolute inset-0 w-full h-full pointer-events-none z-0">
          <!-- Lines rendered here -->
        </svg>
        <div id="topo-nodes-layer" class="absolute inset-0 z-10 pointer-events-auto">
          <!-- Nodes rendered here -->
        </div>
      </div>
    </div>
  `;

  const svg = container.querySelector("#topo-svg");
  const nodesLayer = container.querySelector("#topo-nodes-layer");

  function renderLines() {
    svg.innerHTML = links
      .map(l => {
        const fromNode = nodes.find(n => n.id === l.from);
        const toNode = nodes.find(n => n.id === l.to);
        if (!fromNode || !toNode) return "";

        return `<line x1="${fromNode.x + 60}" y1="${fromNode.y + 25}" x2="${toNode.x + 60}" y2="${toNode.y + 25}" stroke="#00ffaa" stroke-width="2" stroke-dasharray="4 2" opacity="0.8" />`;
      })
      .join("");
  }

  function renderNodes() {
    nodesLayer.innerHTML = nodes
      .map(n => {
        let icon = "router";
        let colorClass = "border-primary text-primary";
        if (n.type === "switch") {
          icon = "lan";
          colorClass = "border-emerald-500 text-emerald-400";
        } else if (n.type === "subnet") {
          icon = "dns";
          colorClass = "border-cyan-500 text-cyan-400";
        }

        return `
          <div id="${n.id}" class="topo-node absolute bg-surface-dark border ${colorClass} rounded-lg p-2.5 shadow-lg cursor-move flex items-center gap-2 select-none w-36" style="left: ${n.x}px; top: ${n.y}px;">
            <span class="material-symbols-outlined text-base">${icon}</span>
            <span class="text-xs font-bold text-white truncate">${n.name}</span>
          </div>
        `;
      })
      .join("");

    attachNodeEvents();
  }

  function attachNodeEvents() {
    const nodeEls = nodesLayer.querySelectorAll(".topo-node");
    nodeEls.forEach(el => {
      let isDragging = false;
      let startX, startY, initialNodeX, initialNodeY;

      el.addEventListener("mousedown", e => {
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        const nodeObj = nodes.find(n => n.id === el.id);
        if (!nodeObj) return;

        initialNodeX = nodeObj.x;
        initialNodeY = nodeObj.y;

        function onMouseMove(moveEvent) {
          if (!isDragging) return;
          const dx = moveEvent.clientX - startX;
          const dy = moveEvent.clientY - startY;

          nodeObj.x = Math.max(10, initialNodeX + dx);
          nodeObj.y = Math.max(10, initialNodeY + dy);

          el.style.left = `${nodeObj.x}px`;
          el.style.top = `${nodeObj.y}px`;
          renderLines();
        }

        function onMouseUp() {
          isDragging = false;
          window.removeEventListener("mousemove", onMouseMove);
          window.removeEventListener("mouseup", onMouseUp);
        }

        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
      });
    });
  }

  container.querySelector("#btn-add-router").addEventListener("click", () => {
    const id = `node-${Date.now()}`;
    nodes.push({ id, type: "router", name: `Router-${nodes.length + 1}`, x: 50, y: 50 });
    renderNodes();
    renderLines();
  });

  container.querySelector("#btn-add-switch").addEventListener("click", () => {
    const id = `node-${Date.now()}`;
    nodes.push({ id, type: "switch", name: `Switch-${nodes.length + 1}`, x: 50, y: 150 });
    renderNodes();
    renderLines();
  });

  container.querySelector("#btn-add-subnet").addEventListener("click", () => {
    const id = `node-${Date.now()}`;
    nodes.push({ id, type: "subnet", name: `Subnet-${nodes.length + 1}`, x: 50, y: 250 });
    renderNodes();
    renderLines();
  });

  container.querySelector("#btn-clear-topo").addEventListener("click", () => {
    nodes = [];
    links = [];
    renderNodes();
    renderLines();
    showToast("Topology canvas cleared", "notice");
  });

  renderNodes();
  renderLines();
}
