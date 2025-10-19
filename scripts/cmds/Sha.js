// ====== CHATBOT GEMINI INTERATIVO ======
// Comando: ~sha [mensagem]
// Autor: Claudio Soares

const axios = require("axios");

module.exports = {
  config: {
    name: "sha",
    aliases: ["gemini", "chat", "ai"],
    version: "2.0",
    author: "Claudio Soares",
    role: 0,
    shortDescription: "Conversa interativa com o bot",
    longDescription: "Fale com o bot de forma natural. Ele responde tudo — desde dúvidas, cálculos, curiosidades ou simples bate-papo.",
    category: "ai",
    guide: {
      pt: "{pn} [mensagem]"
    }
  },

  onStart: async function ({ api, event, args }) {
    const prompt = args.join(" ");
    if (!prompt) {
      return api.sendMessage("💬 | Escreve algo para conversar comigo!", event.threadID, event.messageID);
    }

    const apiKey = "AIzaSyBaC_860TYHtQ-VfW1Oy8QdKw1PjRVMtAk"; // <-- COLOCA AQUI A TUA CHAVE CORRETA

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`;

    // Enviar o pedido ao modelo
    try {
      const response = await axios.post(url, {
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }]
          }
        ]
      }, {
        headers: { "Content-Type": "application/json" }
      });

      // Extrair resposta do Gemini
      let reply = "";
      if (
        response.data &&
        response.data.candidates &&
        response.data.candidates[0] &&
        response.data.candidates[0].content &&
        response.data.candidates[0].content.parts
      ) {
        reply = response.data.candidates[0].content.parts
          .map(p => p.text)
          .join("\n");
      } else {
        reply = "🤖 | Desculpa, não consegui processar tua pergunta.";
      }

      // Enviar resposta ao chat
      await api.sendMessage(`💭 ${reply}`, event.threadID, event.messageID);

    } catch (err) {
      console.error("Erro ao contactar Gemini:", err.response ? err.response.data : err.message);
      return api.sendMessage("❌ | Ocorreu um erro ao contactar a IA. Verifica a tua chave API.", event.threadID, event.messageID);
    }
  }
};
