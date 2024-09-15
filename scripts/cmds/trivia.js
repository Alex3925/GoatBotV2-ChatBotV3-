const axios = require('axios');

module.exports = {
  config: {
    name: "trivia",
    aliases: ["randomtrivia", "trivia"],
    version: "1.0.0",
    author: "chan",
    role: 0,
    shortDescription: {
      en: "Fetches a trivia question."
    },
    longDescription: {
      en: "Fetches a random trivia question from the API and sends it to the user."
    },
    category: "fun",
    guide: {
      en: "Use {p}trivia to fetch a random trivia question."
    },
    cooldown: 5,
  },
  onStart: async function ({ api, event, args }) {
    const { threadID, messageID } = event;

    if (args.length > 0) {
      return api.sendMessage("This command does not require additional arguments.", threadID, messageID);
    }

    api.sendMessage("Fetching a trivia question for you...", threadID, messageID);

    try {
      const response = await axios.get('https://nash-rest-api-production.up.railway.app/trivia');
      const trivia = response.data;

      if (!trivia || !trivia.question) {
        return api.sendMessage("Sorry, I couldn't fetch a trivia question at the moment.", threadID, messageID);
      }

      api.sendMessage(`Here's a trivia question for you:\n\n${trivia.question}`, threadID, messageID);
    } catch (error) {
      console.error(error);
      api.sendMessage(`An error occurred: ${error.message}`, threadID, messageID);
    }
  }
};
