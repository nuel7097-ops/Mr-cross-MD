module.exports = {
    name: "menu",
    run: async (sock, msg) => {

        const jid = msg.key.remoteJid

        await sock.sendMessage(jid, {
            text: `💀 SLAY QUEEN MD MENU

.menu
.ping
.ai
.download`
        })
    }
}
