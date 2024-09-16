// GoatBotV2 Module
module.exports = {
  info: {
    name: "ai3",
    description: "AI assistant",
    usage: "ai [query]",
    credits: "KALIX AO" //convert by Alex using AI technology
  },

  // START
  async run(api, event, args) {
    // Define functions
    async function send(__) {
      api.sendMessage(__, event.threadID, event.messageID);
    }
    async function react(__) {
      api.setMessageReaction(__, event.messageID, _ => {}, true);
    }

    // Get user input
    let query = args.join("");
    if (!query) {
      send("Very demure, very mindful, and very helpful! 💫\n\nHello there, I am your AI assistant that will help you answer your questions.\n\nExample: ai what are you?");
    } react("⏳");

    // Callback API
    try {
      const response = await fetch(`https://y2pheq.glitch.me/ai?prompt=${query}&uid=${event.senderID}`);
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        send(`${data.response}\n\n• clear conversation history: ai clear`);
        react("✔️");
      } else {
        send("API DOWN");
      }
    } catch (error) {
      console.error(error);
    }
  }
}
