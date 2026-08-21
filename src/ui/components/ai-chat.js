import { showToast } from "../shared/ui-engine.js";
import { storage } from "../../platform/storage.js";
import { escapeHtml } from "../shared/utils.js";

const SYSTEM_PROMPT = `You are an expert CCIE level Network Engineer assistant. 
Your goal is to help users design networks, troubleshoot configurations (Cisco, Mikrotik, Juniper), explain networking concepts (BGP, OSPF, VLANs, IPSec), and generate configs.
Always provide precise, technical answers. Format code in markdown blocks. Keep explanations concise but extremely accurate.`;

let authCheckInterval = null;

export function initAiChatTool(container) {
  if (authCheckInterval) {
    clearInterval(authCheckInterval);
    authCheckInterval = null;
  }

  container.innerHTML = `
    <div class="flex flex-col h-[600px] bg-surface-dark cyber-border rounded p-4 relative">
       <!-- Header -->
       <div class="flex justify-between items-center border-b border-border-dark pb-3 mb-3">
          <div class="flex items-center gap-2">
             <span class="material-symbols-outlined text-primary">smart_toy</span>
             <h4 class="text-white font-bold tracking-widest uppercase text-sm">AI Network Assistant</h4>
          </div>
          <div id="ai-status" class="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1">
             <span class="size-2 rounded-full bg-slate-500" id="ai-indicator"></span>
             Checking API Key...
          </div>
       </div>

       <!-- Chat History -->
       <div id="chat-history" class="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-4 pr-2 pb-4">
          <div class="flex gap-3">
             <div class="bg-primary/20 text-primary p-2 rounded-full h-fit"><span class="material-symbols-outlined !text-sm">smart_toy</span></div>
             <div class="bg-black/50 border border-border-dark rounded-lg rounded-tl-none p-3 text-sm text-slate-300">
                Hello! I'm your AI Network Assistant. I can help you design subnets, review configs, or troubleshoot protocols. How can I help today?
             </div>
          </div>
       </div>

       <!-- Input Area -->
       <div class="relative mt-2">
          <textarea id="chat-input" class="w-full bg-black border border-border-dark rounded-lg pl-4 pr-12 py-3 text-sm text-white resize-none focus:border-primary focus:outline-none custom-scrollbar" rows="2" placeholder="Ask about BGP, Cisco configs, Mikrotik routing... (Press Enter to send)"></textarea>
          <button id="btn-send-chat" class="absolute right-2 bottom-3 text-primary hover:text-primary-hover transition-colors p-1 disabled:opacity-50 disabled:cursor-not-allowed">
             <span class="material-symbols-outlined">send</span>
          </button>
       </div>

       <!-- API Key Overlay -->
       <div id="ai-overlay" class="absolute inset-0 bg-surface-dark/95 backdrop-blur-sm rounded z-10 flex flex-col items-center justify-center p-6 text-center hidden">
          <span class="material-symbols-outlined text-4xl text-slate-500 mb-4">vpn_key</span>
          <h3 class="text-white font-bold text-lg mb-2">API Key Required</h3>
          <p class="text-slate-400 text-sm mb-6 max-w-md">You need to set your Gemini API Key in Settings to use the AI Assistant.</p>
          <button id="btn-ai-open-settings" class="bg-primary hover:bg-primary-hover text-black font-bold px-6 py-2 rounded transition-colors uppercase tracking-widest text-xs">
             Open Settings
          </button>
       </div>
    </div>
  `;

  const chatHistory = container.querySelector("#chat-history");
  const chatInput = container.querySelector("#chat-input");
  const btnSend = container.querySelector("#btn-send-chat");
  const aiStatus = container.querySelector("#ai-status");
  const aiIndicator = container.querySelector("#ai-indicator");
  const aiOverlay = container.querySelector("#ai-overlay");
  const btnOpenSettings = container.querySelector("#btn-ai-open-settings");

  if (btnOpenSettings) {
    btnOpenSettings.addEventListener("click", () => {
      const settingsBtn = document.getElementById("btn-open-settings");
      if (settingsBtn) settingsBtn.click();
    });
  }

  let apiKey = storage.get("gemini_api_key");

  function checkAuth() {
    apiKey = storage.get("gemini_api_key");
    if (!apiKey) {
      aiOverlay.classList.remove("hidden");
      aiStatus.textContent = "Offline (No Key)";
      aiStatus.className = "text-[10px] uppercase font-bold text-red-500";
      aiIndicator.className = "size-2 rounded-full bg-red-500 inline-block mr-1";
    } else {
      aiOverlay.classList.add("hidden");
      aiStatus.textContent = "Ready";
      aiStatus.className = "text-[10px] uppercase font-bold text-signal-green";
      aiIndicator.className = "size-2 rounded-full bg-signal-green inline-block mr-1";
    }
  }

  checkAuth();
  authCheckInterval = setInterval(checkAuth, 2000);

  const conversationContext = [
    { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
    {
      role: "model",
      parts: [{ text: "Understood. I am ready to assist as an expert Network Engineer." }],
    },
  ];

  function addMessage(role, text) {
    const isModel = role === "model";
    const msgDiv = document.createElement("div");
    msgDiv.className = `flex gap-3 ${isModel ? "" : "flex-row-reverse"}`;

    let contentHtml = text;
    if (isModel && window.marked) {
      contentHtml = window.marked.parse(text);
    }

    const outerBg = isModel ? "bg-primary/20 text-primary" : "bg-slate-700 text-white";
    const icon = isModel ? "smart_toy" : "person";
    const innerBg = isModel
      ? "bg-black/50 border border-border-dark rounded-tl-none prose prose-invert prose-sm max-w-none"
      : "bg-primary/10 text-primary border border-primary/20 rounded-tr-none";

    const safeText = escapeHtml(text);

    msgDiv.innerHTML = `
        <div class="${outerBg} p-2 rounded-full h-fit flex-shrink-0">
           <span class="material-symbols-outlined !text-sm">${icon}</span>
        </div>
        <div class="${innerBg} rounded-lg p-3 text-sm text-slate-300 overflow-x-auto">
           ${isModel ? contentHtml : safeText.replace(/\n/g, "<br/>")}
        </div>
     `;
    chatHistory.appendChild(msgDiv);
    chatHistory.scrollTop = chatHistory.scrollHeight;
  }

  async function sendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;
    if (!apiKey) {
      showToast("API Key missing", "error");
      return;
    }

    addMessage("user", text);
    chatInput.value = "";
    chatInput.disabled = true;
    btnSend.disabled = true;

    const loadingDiv = document.createElement("div");
    loadingDiv.className = "flex gap-3 text-slate-500 italic text-xs items-center pl-10 mb-2";
    loadingDiv.innerHTML =
      '<span class="material-symbols-outlined animate-spin !text-sm">sync</span> AI is typing...';
    chatHistory.appendChild(loadingDiv);
    chatHistory.scrollTop = chatHistory.scrollHeight;

    conversationContext.push({ role: "user", parts: [{ text }] });

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: conversationContext,
            generationConfig: {
              temperature: 0.2,
              maxOutputTokens: 2048,
            },
          }),
        }
      );

      chatHistory.removeChild(loadingDiv);

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error?.message || "API Error");
      }

      const data = await response.json();
      const replyText =
        data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't generate a response.";

      conversationContext.push({ role: "model", parts: [{ text: replyText }] });
      addMessage("model", replyText);
    } catch (e) {
      if (loadingDiv.parentNode) chatHistory.removeChild(loadingDiv);
      addMessage("model", `*Error:* ${e.message}`);
      conversationContext.pop();
    } finally {
      chatInput.disabled = false;
      btnSend.disabled = false;
      chatInput.focus();
    }
  }

  btnSend.addEventListener("click", sendMessage);
  chatInput.addEventListener("keydown", e => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  if (typeof window.marked === "undefined") {
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/marked/lib/marked.umd.js";
    document.head.appendChild(script);
  }
}
