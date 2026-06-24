module.exports = {
    name: "ai",
    run: async (sock, msg, args) => {

        const text = args.join(" ")

        await sock.sendMessage(msg.key.remoteJid, {
            text: "🤖 AI mode (upgrade needed for real AI)\nYou said: " + text
        })
    }
}
