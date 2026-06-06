/**
 * Real-time input validation utilities
 */

/**
 * Add real-time validation to an IP input
 * @param {HTMLInputElement} input - Input element
 */
export function addIPValidation(input) {
  if (!input) return;

  const validateIP = value => {
    if (!value) return { valid: null, message: "" };

    const ipRegex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
    const match = value.match(ipRegex);

    if (!match) {
      return { valid: false, message: "Invalid IP format" };
    }

    const octets = match.slice(1).map(Number);
    const invalidOctet = octets.find(o => o > 255);

    if (invalidOctet !== undefined) {
      return { valid: false, message: "Octets must be 0-255" };
    }

    return { valid: true, message: "Valid IP address" };
  };

  // Create feedback element
  const feedback = document.createElement("div");
  feedback.className = "absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1";

  // Wrap input in relative container if not already
  if (input.parentElement.style.position !== "relative") {
    input.parentElement.style.position = "relative";
  }

  input.parentElement.appendChild(feedback);

  input.addEventListener("input", e => {
    const result = validateIP(e.target.value);

    // Remove previous classes
    input.classList.remove("border-green-500", "border-red-500", "border-border-dark");
    feedback.innerHTML = "";

    if (result.valid === true) {
      input.classList.add("border-green-500");
      feedback.innerHTML =
        '<span class="material-symbols-outlined text-green-500 !text-sm">check_circle</span>';
    } else if (result.valid === false) {
      input.classList.add("border-red-500");
      feedback.innerHTML = `
                <span class="material-symbols-outlined text-red-500 !text-sm">error</span>
                <span class="text-[10px] text-red-400 hidden md:inline">${result.message}</span>
            `;
    } else {
      input.classList.add("border-border-dark");
    }
  });
}

/**
 * Add real-time validation to a hosts list input
 * @param {HTMLInputElement} input - Input element
 */
export function addHostsValidation(input) {
  if (!input) return;

  const validateHosts = value => {
    if (!value) return { valid: null, message: "", count: 0 };

    const hosts = value
      .split(",")
      .map(h => h.trim())
      .filter(h => h.length > 0);

    if (hosts.length === 0) {
      return { valid: false, message: "Enter at least one value", count: 0 };
    }

    const invalidHost = hosts.find(h => isNaN(h) || Number(h) <= 0);

    if (invalidHost !== undefined) {
      return { valid: false, message: "All values must be positive numbers", count: hosts.length };
    }

    return {
      valid: true,
      message: `${hosts.length} subnet${hosts.length > 1 ? "s" : ""}`,
      count: hosts.length,
    };
  };

  // Create feedback element
  const feedback = document.createElement("div");
  feedback.className = "absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1";

  if (input.parentElement.style.position !== "relative") {
    input.parentElement.style.position = "relative";
  }

  input.parentElement.appendChild(feedback);

  input.addEventListener("input", e => {
    const result = validateHosts(e.target.value);

    input.classList.remove("border-green-500", "border-red-500", "border-border-dark");
    feedback.innerHTML = "";

    if (result.valid === true) {
      input.classList.add("border-green-500");
      feedback.innerHTML = `
                <span class="material-symbols-outlined text-green-500 !text-sm">check_circle</span>
                <span class="text-[10px] text-green-400 hidden md:inline">${result.message}</span>
            `;
    } else if (result.valid === false) {
      input.classList.add("border-red-500");
      feedback.innerHTML = `
                <span class="material-symbols-outlined text-red-500 !text-sm">error</span>
                <span class="text-[10px] text-red-400 hidden md:inline">${result.message}</span>
            `;
    } else {
      input.classList.add("border-border-dark");
    }
  });
}

/**
 * Add example button to input
 * @param {HTMLInputElement} input - Input element
 * @param {string} exampleValue - Example value to fill
 */
export function addExampleButton(input, exampleValue) {
  if (!input) return;

  const button = document.createElement("button");
  button.type = "button";
  button.className =
    "absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-primary hover:text-white bg-primary/10 hover:bg-primary px-2 py-1 rounded transition-all font-bold uppercase tracking-wider";
  button.textContent = "Example";
  button.title = `Try: ${exampleValue}`;

  if (input.parentElement.style.position !== "relative") {
    input.parentElement.style.position = "relative";
  }

  button.addEventListener("click", () => {
    input.value = exampleValue;
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.focus();

    // Animate button
    button.classList.add("animate-scale-in");
    setTimeout(() => button.classList.remove("animate-scale-in"), 200);
  });

  input.parentElement.appendChild(button);
}
