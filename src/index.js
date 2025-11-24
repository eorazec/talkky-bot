import WebSocket from "ws";

export default class BotClient {
  constructor(token, wsUrl = "wss://talkky.squareweb.app", apiUrl = "https://talkky.squareweb.app") {
    this.wsUrl = `${wsUrl}?bot_token=${token}`;
    this.apiUrl = apiUrl;
    this.token = token;
    this.events = {};
    this.reconnectDelay = 3000;
    this.heartbeatInterval = null;

    // Mantém o Node vivo
    setInterval(() => {}, 1 << 30);
  }

  // ==========
  // SISTEMA DE EVENTOS
  // ==========
  on(event, handler) {
    if (!this.events[event]) this.events[event] = [];
    this.events[event].push(handler);
  }

  emit(event, data) {
    if (this.events[event]) {
      for (const fn of this.events[event]) fn(data);
    }
  }

  // ==========
  // WEBSOCKET
  // ==========
  sendMessage(conversationId, text) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.log("❌ Não conectado, mensagem não enviada.");
      return;
    }

    this.ws.send(JSON.stringify({
      event: "send_message",
      conversation_id: conversationId,
      text
    }));
  }

  startHeartbeat() {
    if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);

    this.heartbeatInterval = setInterval(() => {
      if (this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ event: "ping" }));
      }
    }, 15000);
  }

  run() {
    console.log("🔌 Conectando...");
    this.ws = new WebSocket(this.wsUrl);

    this.ws.on("open", () => {
      this.emit("ready");
      this.startHeartbeat();
    });

    this.ws.on("message", raw => {
      const data = JSON.parse(raw);
      if (data.event === "new_message") this.emit("message", data);
    });

    this.ws.on("close", () => {
      console.log("⚠ Conexão perdida, tentando reconectar...");
      setTimeout(() => this.run(), this.reconnectDelay);
    });

    this.ws.on("error", (err) => {
      console.log("❌ Erro no WebSocket:", err.message);
    });
  }

  // ==========
  // API HTTP
  // ==========

  async request(method, path, body = null) {
    const res = await fetch(`${this.apiUrl}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.token}`
      },
      body: body ? JSON.stringify(body) : undefined
    });

    return res.json();
  }

  // 🔒 BLOQUEAR USUÁRIO
  async block(userId) {
    return await this.request("POST", "/api/bot/block", { user_id: userId });
  }

  // 🔓 DESBLOQUEAR USUÁRIO
  async unBlock(userId) {
    return await this.request("DELETE", "/api/bot/block", { user_id: userId });
  }

  // 📌 LISTAR CONVERSAS
  async conversations() {
    return await this.request("GET", "/api/bot/conversations");
  }

  // ➕ CRIAR CONVERSA
  async createConversation(credentials) {
    return await this.request("POST", "/api/bot/conversation", { credentials });
  }

  // 🗑 EXCLUIR MENSAGEM
  async messageDelete(messageId) {
    return await this.request("DELETE", "/api/bot/conversation/message", { message_id: messageId });
  }
}
