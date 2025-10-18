module.exports = {
  config: {
    name: "chat",
    aliases: ["ai", "gemini", "ask"],
    version: "1.0",
    author: "Claudio",
    role: 0,
    shortDescription: "Conversa com Gemini (Google)",
    longDescription: "Usa a API Gemini da Google para responder perguntas.",
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
      const apiKey = "OPENAI_API_KEY";  // Coloque tu chave aqui para testar (temporário)
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
      // Ajuste do modelo: gemini-1.5-flash é só exemplo; pode usar outro modelo disponível

      const body = {
        "prompt": {
          "messages": [
            {
              "author": "user",
              "content": {
                "text": prompt
              }
            }
          ]
        }
      };

      const response = await axios.post(url, body, {
        headers: {
          "Content-Type": "application/json"
        }
      });

      // Extrair resposta do retorno
      let reply = "";
      if (response.data && response.data.candidates && response.data.candidates.length > 0) {
        reply = response.data.candidates[0].content.text;
      } else if (response.data && response.data.candidates && response.data.candidates[0].content) {
        reply = response.data.candidates[0].content;
      } else {
        reply = "Desculpa, não consegui processar sua pergunta.";
      }

      return api.sendMessage(`🤖 ${reply}`, event.threadID, event.messageID);

    } catch (err) {
      console.error("Erro Gemini API:", err.response ? err.response.data : err.message);
      return api.sendMessage("❌ | Erro ao contactar Gemini.", event.threadID, event.messageID);
    }
  }
};
