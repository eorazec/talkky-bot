# talkky-bot

Cliente oficial em Node.js para criar bots conectados ao Talkky usando WebSocket + API HTTP.

---

## 📥 Instalação

```bash
npm install talkky-bot
```

---

## 🚀 Exemplo Rápido (Usando sua forma real)

```js
import BotClient from "talkky-bot";

const bot = new BotClient("YOU-TOKEN");

bot.on("ready", () => {
  console.log("🤖 Bot conectado!");
});

bot.on("message", (msg) => {
  console.log("📩 Nova mensagem:", msg);

  const args = msg.text.split(" ");

  if (args[0] === "!ping") {
    bot.sendMessage(msg.conversation_id, "pong!");
  }

  if (args[0] === "!conv") {
    let credentials = args[1];

    credentials = credentials.replace(/['"]+/g, "");

    bot.createConversation(credentials);
  }

  if (args[0] === "!block") {
    let credentials = args[1];

    credentials = credentials.replace(/['"]+/g, "");

    bot.block(credentials);
  }
});

bot.run();
```

---

## 🧠 Eventos

### `ready`
Chamado quando o bot conecta com sucesso.

```js
bot.on("ready", () => {
  console.log("Bot iniciado!");
});
```

### `message`
Chamado quando uma nova mensagem chega. O callback recebe o objeto `msg` proveniente do servidor, por exemplo:

```js
{
  "event": "new_message",
  "conversation_id": "abc123",
  "text": "!ping",
  "sender_id": "123456",
  "type": "text"
}
```

---

## 📤 Enviar Mensagens

### `sendMessage(conversationId, text)`
Envia uma mensagem de texto para a conversa especificada.

```js
bot.sendMessage(conversationId, "Olá!");
```

Se o WebSocket não estiver conectado, a chamada apenas fará log e não enviará.

---

## 🖥️ Métodos HTTP (API)

A biblioteca expõe métodos que fazem requisições para a API do servidor (com Authorization: Bearer token).

### `block(userId)`
Bloqueia um usuário via API.

```js
await bot.block("user_id");
```

### `unBlock(userId)`
Desbloqueia um usuário.

```js
await bot.unBlock("user_id");
```

### `conversations()`
Retorna a lista de conversas associadas ao bot.

```js
const list = await bot.conversations();
console.log(list);
```

### `createConversation(credentials)`
Cria uma conversa no servidor. `credentials` deve ser a string ou objeto que o servidor espera.

```js
await bot.createConversation("+11345356");
ou
await bot.createConversation("Razec");
```

### `messageDelete(messageId)`
Deleta uma mensagem.

```js
await bot.messageDelete("message_id");
```

---

## ⚙️ Construtor e opções

```js
new BotClient(token, wsUrl?, apiUrl?)
```

| Parâmetro | Tipo | Default | Descrição |
|---|---:|---|---|
| `token` | string | — | Token do bot (obrigatório) |
| `wsUrl` | string | `wss://talkky.squareweb.app` | URL do WebSocket |
| `apiUrl` | string | `https://talkky.squareweb.app` | URL base da API HTTP |
---

## 🌐 WebSocket, Heartbeat e Reconnect

- Ao chamar `run()` a lib conecta via WebSocket.
- Ao receber evento `open`, emite `ready` e inicia heartbeat (ping a cada 15s).
- Se a conexão fechar, tenta reconectar após 3 segundos (reconnectDelay padrão).
- `startHeartbeat()` envia `{ event: "ping" }` via WebSocket.

---

## 🧩 Estrutura do Projeto

```
dist/           ← código buildado (possivelmente ofuscado)
src/            ← código fonte
README.md
package.json
```

---

## 🔐 Segurança

- **Não** exponha tokens em repositórios públicos.
- Use variáveis de ambiente (por exemplo `.env`) para armazenar tokens.
- Exemplo `.env`:

```
BOT_TOKEN=seu_token
```

---

## ⛑️ Erros Comuns & Resolução Rápida

- **"Não conectado, mensagem não enviada."**  
  Chame `sendMessage` somente após o evento `ready`.

- **"Invalid token" / "Erro no WebSocket"**  
  Verifique se o token é válido e se o servidor está acessível.

- **Problemas após ofuscação**  
  Se você ofuscar o código, proteja strings de eventos (`open`, `message`, `ready`, `new_message`, `send_message`, `ping`) no seu obfuscator config.

---

## 🧾 Licença

Este projeto é licenciado sob a **MIT License**. Veja o arquivo `LICENSE.txt`.

---

## 🆘 Suporte

Abra uma issue no repositório ou entre em contato com o mantenedor do projeto.

