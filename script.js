document.getElementById("vlsm-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const network = document.getElementById("network").value;
    const hostsInput = document.getElementById("hosts").value;

    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "";

    // Validar la red principal
    const [baseIP, prefix] = network.split("/");
    if (!validateIPAddress(baseIP) || isNaN(prefix)) {
        resultsDiv.innerHTML = "<p style='color: red;'>Red inválida. Por favor, ingresa una dirección en formato CIDR.</p>";
        return;
    }

    // Obtener los requerimientos de hosts
    const hosts = hostsInput.split(",").map(Number).sort((a, b) => b - a);
    if (hosts.some(isNaN)) {
        resultsDiv.innerHTML = "<p style='color: red;'>Lista de hosts inválida. Ingresa números separados por comas.</p>";
        return;
    }

    // Realizar los cálculos de VLSM
    const subnets = calculateVLSM(baseIP, Number(prefix), hosts);
    displayResults(subnets, resultsDiv);
});

// Validar IP
function validateIPAddress(ip) {
    const octets = ip.split(".");
    return octets.length === 4 && octets.every(o => !isNaN(o) && o >= 0 && o <= 255);
}

// Calcular VLSM
function calculateVLSM(baseIP, prefix, hosts) {
    let subnets = [];
    let currentIP = ipToDecimal(baseIP);

    hosts.forEach(hostCount => {
        const bitsNeeded = Math.ceil(Math.log2(hostCount + 2));
        const newPrefix = 32 - bitsNeeded;
        const blockSize = Math.pow(2, bitsNeeded);

        const subnet = {
            network: decimalToIP(currentIP),
            prefix: newPrefix,
            mask: decimalToIP((0xFFFFFFFF << (32 - newPrefix)) >>> 0),
            broadcast: decimalToIP(currentIP + blockSize - 1),
            firstHost: decimalToIP(currentIP + 1),
            lastHost: decimalToIP(currentIP + blockSize - 2),
            hostsAvailable: blockSize - 2
        };

        subnets.push(subnet);
        currentIP += blockSize;
    });

    return subnets;
}

// Convertir IP a decimal
function ipToDecimal(ip) {
    return ip.split(".").reduce((acc, octet) => (acc << 8) | Number(octet), 0);
}

// Convertir decimal a IP
function decimalToIP(decimal) {
    return [24, 16, 8, 0].map(shift => (decimal >> shift) & 255).join(".");
}

// Mostrar resultados
function displayResults(subnets, resultsDiv) {
    subnets.forEach((subnet, index) => {
        const subnetInfo = `
            <div>
                <h4>Subred ${index + 1}</h4>
                <p>Red: ${subnet.network}/${subnet.prefix}</p>
                <p>Máscara: ${subnet.mask}</p>
                <p>Rango: ${subnet.firstHost} - ${subnet.lastHost}</p>
                <p>Broadcast: ${subnet.broadcast}</p>
                <p>Hosts disponibles: ${subnet.hostsAvailable}</p>
            </div>
        `;
        resultsDiv.innerHTML += subnetInfo;
    });
}
