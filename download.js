
const ytdl = require("ytdl-core")

module.exports = {
    name: "download",
    run: async (sock, msg, args) => {

        const jid = msg.key.remoteJid
        const url = args[0]

        if (!url) {
            return sock.sendMessage(jid, {
                text: "📥 Usage: .download <youtube url>"
            })
        }

        try {
            if (!ytdl.validateURL(url)) {
                return sock.sendMessage(jid, {
                    text: "❌ Only YouTube links supported"
                })
            }

            const info = await ytdl.getInfo(url)
            const title = info.videoDetails.title

            await sock.sendMessage(jid, {
                text: `⬇️ Downloading:\n${title}`
            })

            const stream = ytdl(url, { quality: "18" })

            await sock.sendMessage(jid, {
                video: { stream },
                caption: title
            })

        } catch (e) {
            await sock.sendMessage(jid, {
                text: "❌ Download failed"
            })
        }
    }
}
