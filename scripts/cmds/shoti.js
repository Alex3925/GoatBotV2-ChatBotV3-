module.exports = {
  name: "shoti",
  description: "Generate a random TikTok video.",
  version: "1.0.0",
  role: 0,
  credits: "Churchill Abing", // fixed & modified by Alex Jhon M. Ponce
  cooldown: 0,
  hasPrefix: true,

  async run({ api, event, args }) {
    api.setMessageReaction("⏳", event.messageID, (err) => {}, true);
    api.sendTypingIndicator(event.threadID, true);

    const prompt = args.join(" ");
    if (!prompt) {
      api.sendMessage("Please provide a prompt.", event.threadID, event.messageID);
      return;
    }

    try {
      const response = await fetch(`https://betadash-shoti-yazky.vercel.app/shotizxx?apikey=shipazu`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apikey: "shipazu" }),
      });

      const data = await response.json();
      const path = __dirname + `/cache/shoti.mp4`;
      const file = fs.createWriteStream(path);
      const rqs = await fetch(encodeURI(data.data.url));
      rqs.body.pipe(file);

      file.on("finish", () => {
        setTimeout(() => {
          api.setMessageReaction("✅", event.messageID, (err) => {}, true);
          api.sendMessage({
            body: `𝖴𝗌𝖾𝗋𝗇𝖺𝗆𝖾 : @${data.data.user.username}\n𝖭𝗂𝖼𝗄𝗇𝖺𝗆𝖾 : ${data.data.user.nickname}`,
            attachment: fs.createReadStream(path),
          }, event.threadID);
        }, 5000);
      });

      file.on("error", (err) => {
        api.sendMessage(`Error: ${err}`, event.threadID, event.messageID);
      });
    } catch (err) {
      api.sendMessage(`Error: ${err}`, event.threadID, event.messageID);
    }
  },
};
