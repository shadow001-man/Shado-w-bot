const axios = require("axios");

module.exports = {
  config: {
    name: "chat",
    aliases: ["gpt", "ia"],
    version: "1.0",
    author: "teu_nome",
    role: 0,
    shortDescription: "Conversar com uma IA",
    longDescription: "Permite conversar com uma IA (ChatGPT).",
    category: "fun",
    guide: "{pn} <mensagem>"
  },

  onStart: async function ({ api, event, args }) {
    const prompt = args.join(" ");
    if (!prompt)
      return api.sendMessage("💬 | Escreve algo para conversar comigo!", event.threadID, event.messageID);

    try {
      const response = await axios.post("https://api.openai.com/v1/chat/completions", {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }]
      }, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}` // tua chave da OpenAI
        }
      });

      const reply = response.data.choices[0].message.content;
      api.sendMessage(reply, event.threadID, event.messageID);
    } catch (error) {
      console.error(error);
      api.sendMessage("❌ | Ocorreu um erro ao tentar falar com a IA.", event.threadID, event.messageID);
    }
  }
};
