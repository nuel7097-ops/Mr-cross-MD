const axios = require("axios")

module.exports = {
    name: "ai",
    run: async (sock, msg, args) => {

        const jid = msg.key.remoteJid
        const text = args.join(" ")

        if (!text) {
            return sock.sendMessage(jid, {
                text: "❌ Usage: .ai hello"
            })
        }

        try {
            // If no API key set, fallback mode
            if (!global.ai_api) {
                return sock.sendMessage(jid, {
                    text: `🤖 AI MODE (FALLBACK)\n\nYou said: ${text}`
                })
            }

            const res = await axios.post("https://api.openai.com/v1/chat/completions", {
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: text }]
            }, {
                headers: {
                    Authorization: `Bearer ${global.ai_api}`,
                    "Content-Type": "application/json"
                }
            })

            const reply = res.data.choices[0].message.content

            await sock.sendMessage(jid, {
                text: "🤖 " + reply
            })

        } catch (e) {
            await sock.sendMessage(jid, {
                text: "❌ AI error"
            })
        }
    }
}
