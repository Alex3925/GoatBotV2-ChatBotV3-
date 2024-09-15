const axios = require('axios');

module.exports = {
    config: {
        name: "gpt4",
        version: "1.0.1",
        author: "churchill", //pogi sa lahat
        countDown: 3,
        role: 0,
        aliases: ['ai2'],
        description: {
            en: "Get a response from GPT-4"
        },
        guide: {
            en: "Use: {pn} [your message]"
        }
    },

    onStart: async function ({ api, event, args, usersData, getLang }) {
        const senderID = event.senderID;
        const inputMessage = args.join(' ');

        if (!inputMessage) {
            return api.sendMessage('Please provide a prompt, for example: ai What is the meaning of life?', event.threadID, event.messageID);
        }

        const userInfo = await usersData.get(senderID);
        const userName = userInfo.name;
        const pendingMessage = await new Promise((resolve, reject) => {
            api.sendMessage({
                body: '𝙿𝚛𝚘𝚌𝚎𝚜𝚜𝚒𝚗𝚐...',
                mentions: [{ tag: userName, id: senderID }]
            }, event.threadID, (err, info) => {
                if (err) return reject(err);
                resolve(info);
            }, event.messageID);
        });

        api.setMessageReaction('⏳', event.messageID, (err) => {
            if (err) console.error('Error reacting with loading emoji:', err);
        });

        const apiUrl = `https://deku-rest-api.gleeze.com/gpt4?prompt=${encodeURIComponent(inputMessage)}&uid=${senderID}`;

        try {
            const response = await axios.get(apiUrl);
            const gpt4Response = response.data.gpt4 || 'No response from GPT-4.';

            const formattedResponse = 
` 𝙶𝚙𝚝4++ 𝙲𝚘𝚗𝚝𝚒𝚗𝚞𝚎𝚜
━━━━━━━━━━━━━━━━━━
${gpt4Response}
━━━━━━━━━━━━━━━━━━
👤 𝙰𝚜𝚔𝚎𝚍 𝚋𝚢: ${userName}`;
            await api.editMessage(formattedResponse, pendingMessage.messageID);

            api.setMessageReaction('✅', event.messageID, (err) => {
                if (err) console.error('Error reacting with check emoji:', err);
            });

        } catch (error) {
            console.error('Error:', error);
            await api.editMessage('An error occurred while getting a response from GPT-4. Please try again later.', pendingMessage.messageID);

 api.setMessageReaction('', event.messageID, (err) => {
                if (err) console.error('Error removing loading emoji:', err);
            });
        }
    }
};
