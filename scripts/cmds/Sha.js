module.exports = {
  config: {
    name: "sha",
    aliases: ["ai", "gemini", "chat"],
    version: "1.0",
    author: "Claudio",
    role: 0,
    shortDescription: "Conversa com a IA Gemini",
    longDescription: "Chat interativo com a IA Gemini (Google AI).",
    category: "ai",
    guide: {
      pt: "{pn} [mensagem]"
    }
  },

  onStart: async function ({ api, event, args }) {
    const axios = require("axios");
    const prompt = args.join(" ");
    if (!prompt) {
      return api.sendMessage("💬 | Escreve algo para conversar comigo!", event.threadID, event.messageID);
    }

    try {
      const apiKey = "AIzaSyBaC_860TYHtQ-VfW1Oy8QdKw1PjRVMtAk"; // <-- coloca tua chave aqui
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

      const body = {
        contents: [
          {
            parts: [
              { text: prompt }
            ]
          }
        ]
      };

      const response = await axios.post(url, body, {
        headers: {
          "Content-Type": "application/json"
        }
      });

      let reply = "Não consegui entender.";
      if (
        response.data &&
        response.data.candidates &&
        response.data.candidates[0].content &&
        response.data.candidates[0].content.parts &&
        response.data.candidates[0].content.parts[0].text
      ) {
        reply = response.data.candidates[0].content.parts[0].text;
      }

      return api.sendMessage(`🤖 ${reply}`, event.threadID, event.messageID);

    } catch (err) {
      console.error("Erro Gemini API:", err.response ? err.response.data : err.message);
      return api.sendMessage("❌ | Ocorreu um erro ao contactar a IA. Verifica a tua chave API.", event.threadID, event.messageID);
    }
  }
};
