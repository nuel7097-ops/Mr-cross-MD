const {
    default: makeWASocket,
    useMultiFileAuthState,
    fetchLatestBaileysVersion,
    DisconnectReason,
    Browsers
} = require("@whiskeysockets/baileys")

const P = require("pino")
const { Boom } = require("@hapi/boom")
const loadPlugins = require("./lib/loader")

const BOT_NAME = "💀 SLAY QUEEN MD"
const OWNER = "2348063898506"
const PREFIX = "."

async function start() {

    const { state, saveCreds } = await useMultiFileAuthState("./session")
    const { version } = await fetchLatestBaileysVersion()

    const sock = makeWASocket({
        version,
        auth: state,
        logger: P({ level: "silent" }),
        browser: Browsers.ubuntu(BOT_NAME),
        printQRInTerminal: false
    })

    sock.commands = new Map()
    loadPlugins(sock)

    sock.ev.on("creds.update", saveCreds)

    /* CONNECTION */
    sock.ev.on("connection.update", (update) => {
        const { connection, lastDisconnect } = update

        if (connection === "open") {
            console.log(`✅ ${BOT_NAME} ONLINE`)
        }

        if (connection === "close") {
            const code = new Boom(lastDisconnect?.error)?.output?.statusCode

            if (code !== DisconnectReason.loggedOut) {
                start()
            }
        }
    })

    /* MESSAGES */
    sock.ev.on("messages.upsert", async ({ messages }) => {
        const msg = messages[0]
        if (!msg.message || msg.key.fromMe) return

        const text =
            msg.message.conversation ||
            msg.message.extendedTextMessage?.text ||
            ""

        if (!text.startsWith(PREFIX)) return

        const args = text.slice(1).trim().split(" ")
        const cmd = args.shift().toLowerCase()

        const command = sock.commands.get(cmd)
        if (command) {
            await command(sock, msg, args)
        }
    })
}

start()
