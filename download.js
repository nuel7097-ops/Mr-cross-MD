module.exports = {
    name: "download",
    run: async (sock, msg, args) => {

        await sock.sendMessage(msg.key.remoteJid, {
            text: "📥 Download module ready (upgrade needed for full YouTube/TikTok system)"
        })
    }
}
