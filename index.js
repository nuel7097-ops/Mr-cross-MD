const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, Browsers } = require('@whiskeysockets/baileys')
const { Boom } = require('@hapi/boom')
const P = require('pino')
const qrcode = require('qrcode-terminal')

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('session')

    const sock = makeWASocket({
        logger: P({ level: 'silent' }),
        auth: state,
        browser: Browsers.macOS('MR CROSS'),
        printQRInTerminal: false
    })

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update

        if(qr) {
            console.log('SCAN THIS QR CODE WITH WHATSAPP:')
            qrcode.generate(qr, {small: true})
        }

        if(connection === 'close') {
            const shouldReconnect = (lastDisconnect?.error instanceof Boom)?.output?.statusCode!== DisconnectReason.loggedOut
            console.log('Connection closed. Reconnecting:', shouldReconnect)
            if(shouldReconnect) {
                startBot()
            }
        } else if(connection === 'open') {
            console.log('༗༊MR CROSS彡★🦋❦ ONLINE ✅')
        }
    })

    sock.ev.on('creds.update', saveCreds)

    sock.ev.on('messages.upsert', async (m) => {
        const msg = m.messages[0]
        if (!msg.message || msg.key.fromMe) return

        const text = msg.message.conversation || msg.message.extendedTextMessage?.text || ''
        const sender = msg.key.remoteJid

        if (text.toLowerCase() === '.menu') {
            await sock.sendMessage(sender, {
                text: `*༗༊MR CROSS彡★🦋❦*\n\n*Bot Commands:*\n.menu - Show menu\n.ping - Check bot\n\n*Owner:* wa.me/2348063898506`
            })
        }

        if (text.toLowerCase() === '.ping') {
            await sock.sendMessage(sender, { text: '*Pong!* ༗༊MR CROSS彡★🦋❦ is active ✅' })
        }
    })
}

startBot()
