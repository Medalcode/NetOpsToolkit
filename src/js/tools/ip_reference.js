export function initIpRefTool() {
  const container = document.getElementById("ip-ref-content");
  if (!container) return; // Guard clause

  // Function to generate HTML for a table
  const createTable = (title, columns, data) => `
    <h3 style="margin-top:25px; margin-bottom:15px; color:var(--color-primary);">${title}</h3>
    <div class="ref-table-container">
      <table class="ref-table">
        <thead>
          <tr>${columns.map(c => `<th>${c}</th>`).join("")}</tr>
        </thead>
        <tbody>
          ${data
            .map(
              row => `
            <tr>
              ${Object.values(row)
                .map(val => `<td>${val}</td>`)
                .join("")}
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `;

  // Render Classes Table
  const classesHTML = createTable(
    "Clases de Direcciones IPv4 (Classful)",
    ["Clase", "Rango", "Máscara", "CIDR", "Uso"],
    ipReferenceData.classes
  );

  // Render Private IPs Table
  const privateHTML = createTable(
    "Direcciones Privadas (RFC 1918)",
    ["CIDR Block", "Rango", "Total IPs"],
    ipReferenceData.private
  );

  // Render Special IPs Table
  const specialHTML = createTable(
    "Direcciones Reservadas y Especiales",
    ["Prefijo/IP", "Nombre", "Descripción"],
    ipReferenceData.special
  );

  container.innerHTML = classesHTML + privateHTML + specialHTML;
}

export const ipReferenceData = {
  classes: [
    {
      class: "A",
      range: "1.0.0.0 - 127.255.255.255",
      mask: "255.0.0.0",
      cidr: "/8",
      type: "Unicast Large",
    },
    {
      class: "B",
      range: "128.0.0.0 - 191.255.255.255",
      mask: "255.255.0.0",
      cidr: "/16",
      type: "Unicast Medium",
    },
    {
      class: "C",
      range: "192.0.0.0 - 223.255.255.255",
      mask: "255.255.255.0",
      cidr: "/24",
      type: "Unicast Small",
    },
    {
      class: "D",
      range: "224.0.0.0 - 239.255.255.255",
      mask: "N/A",
      cidr: "N/A",
      type: "Multicast",
    },
    {
      class: "E",
      range: "240.0.0.0 - 255.255.255.255",
      mask: "N/A",
      cidr: "N/A",
      type: "Experimental",
    },
  ],
  private: [
    { cidr: "10.0.0.0/8", range: "10.0.0.0 - 10.255.255.255", hosts: "16,777,214" },
    { cidr: "172.16.0.0/12", range: "172.16.0.0 - 172.31.255.255", hosts: "1,048,574" },
    { cidr: "192.168.0.0/16", range: "192.168.0.0 - 192.168.255.255", hosts: "65,534" },
  ],
  special: [
    { prefix: "127.0.0.0/8", name: "Loopback", desc: "Host local communication" },
    { prefix: "169.254.0.0/16", name: "Link-Local (APIPA)", desc: "Auto-config when DHCP fails" },
    { prefix: "224.0.0.0/4", name: "Multicast", desc: "Group communication" },
    { prefix: "255.255.255.255", name: "Limited Broadcast", desc: "All hosts on local net" },
  ],
};
