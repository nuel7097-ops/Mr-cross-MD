const {
    default: makeWASocket,
    useMultiFileAuthState,
    fetchLatestBaileysVersion,
    DisconnectReason,
    Browsers
} = require("@whiskeysockets/baileys")

const P = require("pino")
const readline = require("readline")
const { Boom } = require("@hapi/boom")

const BOT_NAME = "💀 SLAY QUEEN MD"
const OWNER = "2348063898506"

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

const question = (text) =>
    new Promise(resolve => rl.question(text, resolve))

async function startBot() {

    const { state, saveCreds } = await useMultiFileAuthState("./session")
    const { version } = await fetchLatestBaileysVersion()

    const sock = makeWASocket({
        version,
        auth: state,
        logger: P({ level: "silent" }),
        browser: Browsers.ubuntu(BOT_NAME),
        printQRInTerminal: false
    })

    sock.ev.on("creds.update", saveCreds)

    /* 🔥 AUTO PAIRING CODE (RAILWAY FRIENDLY) */
    if (!sock.authState.creds.registered) {
        const number = process.env.NUMBER || await question("Enter WhatsApp number: ")
        const code = await sock.requestPairingCode(number.replace(/[^0-9]/g, ""))
        console.log("\n🔐 PAIRING CODE:", code, "\n")
    }

    /* CONNECTION */
    sock.ev.on("connection.update", (update) => {
        const { connection, lastDisconnect } = update

        if (connection === "open") {
            console.log(`✅ ${BOT_NAME} ONLINE`)
        }

        if (connection === "close") {
            const reason = new Boom(lastDisconnect?.error)?.output?.statusCode

            if (reason !== DisconnectReason.loggedOut) {
                startBot()
            }
        }
    })

    /* MESSAGE HANDLER */
    sock.ev.on("messages.upsert", async ({ messages }) => {
        const msg = messages[0]
        if (!msg.message || msg.key.fromMe) return

        const text =
            msg.message.conversation ||
            msg.message.extendedTextMessage?.text ||
            ""

        const jid = msg.key.remoteJid

        if (text.toLowerCase() === ".menu") {
            await sock.sendMessage(jid, {
                text: `┏━━━━━━━━━━━━━━━┓
┃ ${BOT_NAME}
┣━━━━━━━━━━━━━━━┛
┃ Owner: ${OWNER}
┃ Status: ONLINE ✅
┃ Prefix: .
┗━━━━━━━━━━━━━━━┛`
            })
        }

        if (text.toLowerCase() === ".ping") {
            await sock.sendMessage(jid, {
                text: "🏓 SLAY QUEEN MD is alive!"
            })
        }
    })
}

startBot()
