module.exports = {
  config: {
    name: "chat",
    aliases: ["ai", "prompt", "ask"],
    version: "1.0",
    author: "Cláudio & Sh4n.Dev",
    countDown: 3,
    role: 0,
    shortDescription: "Conversa com a IA (ChatGPT)",
    longDescription: "Permite conversar livremente com uma inteligência artificial (modo ChatGPT).",
    category: "ai",
    guide: {
      pt: "{pn} [mensagem]",
    },
  },

  onStart: async function ({ api, event, args }) {
    const axios = require("axios");
    const message = args.join(" ");
    if (!message) return api.sendMessage("💬 | Escreve algo para conversar comigo!", event.threadID, event.messageID);

    try {
      const res = await axios.get(`https://api.kenliejugarap.com/gpt-4-turbo?q=${encodeURIComponent(message)}`);
      const reply = res.data.result || "Desculpa, não consegui responder agora 😔.";
      return api.sendMessage(`🤖 ${reply}`, event.threadID, event.messageID);
    } catch (e) {
      return api.sendMessage("❌ | Ocorreu um erro ao tentar falar com a IA.", event.threadID, event.messageID);
    }
  },
};
