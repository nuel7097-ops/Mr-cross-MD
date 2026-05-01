const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, Browsers, downloadContentFromMessage } = require('@whiskeysockets/baileys')
const qrcode = require('qrcode-terminal')
const moment = require('moment-timezone')
const axios = require('axios')
const fs = require('fs')
const os = require('os')

// CONFIG - YOUR DETAILS
const PREFIX = '.'
const OWNER = ['2348063898506']
const BOT_NAME = '༗༊MR CROSS彡★🦋❦'
const OWNER_NAME = '༄NUEL♛'
const VERSION = '3.0.0'

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('session')

    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true,
        browser: Browsers.macOS('MR CROSS'),
        getMessage: async () => ({ conversation: 'MR CROSS' })
    })

    sock.ev.on('creds.update', saveCreds)

    sock.ev.on('connection.update', ({ connection, lastDisconnect, qr }) => {
        if(qr) qrcode.generate(qr, {small: true})
        if(connection === 'close') {
            const shouldReconnect = lastDisconnect.error?.output?.statusCode!== DisconnectReason.loggedOut
            if(shouldReconnect) startBot()
        } else if(connection === 'open') {
            console.log(`${BOT_NAME} ONLINE ✅`)
        }
    })

    sock.ev.on('messages.upsert', async ({ messages }) => {
        const msg = messages[0]
        if (!msg.message || msg.key.fromMe) return

        const from = msg.key.remoteJid
        const sender = msg.key.participant || from
        const isGroup = from.endsWith('@g.us')
        const body = msg.message.conversation || msg.message.extendedTextMessage?.text || msg.message.imageMessage?.caption || msg.message.videoMessage?.caption || ''
        const pushname = msg.pushName || 'User'

        const isCmd = body.startsWith(PREFIX)
        const command = isCmd? body.slice(PREFIX.length).trim().split(' ')[0].toLowerCase() : ''
        const args = body.trim().split(/ +/).slice(1)
        const q = args.join(' ')
        const isOwner = OWNER.includes(sender.split('@')[0])

        if (body.length > 5000) return sock.sendMessage(from, { text: 'Message too long 🚫' }, { quoted: msg })

        const groupMetadata = isGroup? await sock.groupMetadata(from) : ''
        const groupAdmins = isGroup? groupMetadata.participants.filter(v => v.admin!== null).map(v => v.id) : []
        const isBotAdmin = isGroup? groupAdmins.includes(sock.user.id) : false
        const isAdmin = isGroup? groupAdmins.includes(sender) : false

        switch(command) {
            case 'menu':
            case 'help':
                let uptime = process.uptime()
                let h = Math.floor(uptime / 3600)
                let m = Math.floor((uptime % 3600) / 60)
                let s = Math.floor(uptime % 60)
                let speed = Date.now() - msg.messageTimestamp * 1000
                let ram = (process.memoryUsage().rss / 1024 / 1024).toFixed(0)
                let ramPercent = Math.floor(process.memoryUsage().rss / os.totalmem() * 100)

                let menuText = `┌─────────────────────────┐
│ ${BOT_NAME}
├─────────────────────────┤
│ *Bot Name*: ${BOT_NAME}
┃ *ᴏᴡɴᴇʀ* : ${OWNER_NAME}
┃ *ᴘʀᴇғɪx* : [ ${PREFIX} ]
┃ *ʜᴏsᴛ* : Replit
┃ *ᴜsᴇʀ* : ${pushname}
┃ *ᴘʟᴜɢɪɴs* : 200+
┃ *ᴍᴏᴅᴇ* : Public
┃ *ᴠᴇʀsɪᴏɴ* : ${VERSION}
┃ *sᴘᴇᴇᴅ* : ${speed} ms
┃ *ᴜsᴀɢᴇ* : ${ram} MB
┃ *ʀᴀᴍ:* [${'█'.repeat(Math.floor(ramPercent/10))}${'░'.repeat(10-Math.floor(ramPercent/10))}] ${ramPercent}%
┗▣
♨︎ ɢʀᴏᴜᴘ ᴍᴇɴᴜ ♨︎
│
   ${PREFIX}hidetag
│
   ${PREFIX}tagall
│
   ${PREFIX}demote
│
   ${PREFIX}promote
│
   ${PREFIX}mute
│
   ${PREFIX}unmute
│
   ${PREFIX}kick
│
   ${PREFIX}add
│
   ${PREFIX}grouplink
│
   ${PREFIX}resetlink
│
   ${PREFIX}listadmins
│
   ${PREFIX}antilink
│
   ${PREFIX}welcome
│
   ${PREFIX}closetime
│
   ${PREFIX}opentime
┗┅┅┅➢

♨︎ ᴅᴏᴡɴʟᴏᴀᴅ ᴍᴇɴᴜ ♨︎
│
   ${PREFIX}play
│
   ${PREFIX}tiktok
│
   ${PREFIX}ytmp3
│
   ${PREFIX}ytmp4
│
   ${PREFIX}apk
│
   ${PREFIX}toimg
│
   ${PREFIX}tourl
│
   ${PREFIX}qrcode
│
   ${PREFIX}say
┗┅┅┅➢

♨︎ ᴀɴɪᴍᴇ ᴍᴇɴᴜ ♨︎
│
   ${PREFIX}waifu
│
   ${PREFIX}animepoke
│
   ${PREFIX}animewink
│
   ${PREFIX}animesmile
│
   ${PREFIX}animehappy
│
   ${PREFIX}animedance
│
   ${PREFIX}animecringe
│
   ${PREFIX}animehighfive
┗┅┅┅➢

♨︎ sᴛɪᴄᴋᴇʀ ᴍᴇɴᴜ ♨︎
│
   ${PREFIX}sticker
│
   ${PREFIX}cry
│
   ${PREFIX}hug
│
   ${PREFIX}happy
│
   ${PREFIX}dance
│
   ${PREFIX}slap
│
   ${PREFIX}kiss
│
   ${PREFIX}pat
│
   ${PREFIX}bonk
│
   ${PREFIX}bite
│
   ${PREFIX}cuddle
│
   ${PREFIX}blush
┗┅┅┅➢

♨︎ ᴠᴏɪᴄᴇ ᴍᴇɴᴜ ♨︎
│
   ${PREFIX}bass
│
   ${PREFIX}blown
│
   ${PREFIX}deep
│
   ${PREFIX}fast
│
   ${PREFIX}nightcore
│
   ${PREFIX}robot
│
   ${PREFIX}slow
│
   ${PREFIX}squirrel
┗┅┅┅➢

♨︎ ɢғx / ʟᴏɢᴏ ᴍᴇɴᴜ ♨︎
│
   ${PREFIX}gfx
│
   ${PREFIX}gfx2
│
   ${PREFIX}gfx3
│
   ${PREFIX}gfx4
│
   ${PREFIX}gfx5
┗┅┅┅➢

♨︎ ᴇᴘʜᴏᴛᴏ ᴍᴇɴᴜ ♨︎
│
   ${PREFIX}glitchtext
│
   ${PREFIX}writetext
│
   ${PREFIX}neonglitch
│
   ${PREFIX}logomaker
│
   ${PREFIX}blackpinklogo
│
   ${PREFIX}luxurygold
│
   ${PREFIX}galaxystyle
┗┅┅┅➢

♨︎ ꜰᴜɴ ᴍᴇɴᴜ ♨︎
│
   ${PREFIX}joke
│
   ${PREFIX}truth
│
   ${PREFIX}dare
│
   ${PREFIX}meme
│
   ${PREFIX}fact
│
   ${PREFIX}dog
│
   ${PREFIX}cat
│
   ${PREFIX}coffee
│
   ${PREFIX}8ball
┗┅┅┅➢

♨︎ ɢᴀᴍᴇ ᴍᴇɴᴜ ♨︎
│
   ${PREFIX}rps
│
   ${PREFIX}guess
│
   ${PREFIX}coin
│
   ${PREFIX}dice
│
   ${PREFIX}tictactoe
┗┅┅┅➢

♨︎ ᴏᴛʜᴇʀs ᴍᴇɴᴜ ♨︎
│
   ${PREFIX}ai
│
   ${PREFIX}wiki
│
   ${PREFIX}getpp
│
   ${PREFIX}qc
│
   ${PREFIX}weather
│
   ${PREFIX}calculate
│
   ${PREFIX}iplookup
│
   ${PREFIX}time
│
   ${PREFIX}dictionary
│
   ${PREFIX}currency
┗┅┅┅➢

♨︎ ᴏᴡɴᴇʀ ᴍᴇɴᴜ ♨︎
│
   ${PREFIX}setpp
│
   ${PREFIX}owner
│
   ${PREFIX}alive
│
   ${PREFIX}ping
│
   ${PREFIX}public
│
   ${PREFIX}self
│
   ${PREFIX}block
│
   ${PREFIX}unblock
│
   ${PREFIX}repo
┗┅┅┅➢

𝑖፷𝑴̶𝑹̶ 𝑪̶𝑹̶𝑶̶𝑺̽͢፮▾ ༑̴⟆`
                await sock.sendMessage(from, { text: menuText }, { quoted: msg })
                break

            case 'ping':
                const start = Date.now()
                await sock.sendMessage(from, { text: 'Testing...' }, { quoted: msg })
                await sock.sendMessage(from, { text: `*Pong!* ${Date.now() - start}ms 🚀` }, { quoted: msg })
                break

            case 'alive':
                await sock.sendMessage(from, { text: `*${BOT_NAME}* is alive!\n*Owner:* ${OWNER_NAME}\n*Runtime:* ${h}h ${m}m ${s}s` }, { quoted: msg })
                break

            case 'owner':
                await sock.sendMessage(from, { text: `*Owner:* ${OWNER_NAME}\n*Contact:* wa.me/${OWNER[0]}` }, { quoted: msg })
                break

            case 'repo':
                await sock.sendMessage(from, { text: `*MR CROSS MD*\n\nGithub: https://github.com/\n\nStar the repo ⭐` }, { quoted: msg })
                break

            case 'hidetag':
                if (!isGroup ||!isAdmin) return sock.sendMessage(from, { text: 'Group + Admin only!' }, { quoted: msg })
                let mem = groupMetadata.participants.map(v => v.id)
                sock.sendMessage(from, { text: q || 'Hidden tag by admin', mentions: mem }, { quoted: msg })
                break

            case 'tagall':
                if (!isGroup ||!isAdmin) return
                let text = `*Tag All*\n\n`
                for (let mem of groupMetadata.participants) text += `@${mem.id.split('@')[0]}\n`
                sock.sendMessage(from, { text: text, mentions: groupMetadata.participants.map(a => a.id) }, { quoted: msg })
                break

            case 'kick':
                if (!isGroup ||!isAdmin ||!isBotAdmin) return sock.sendMessage(from, { text: 'Bot needs admin!' }, { quoted: msg })
                let users = msg.mentionedJid[0]? msg.mentionedJid : msg.quoted? [msg.quoted.sender] : []
                if (!users[0]) return sock.sendMessage(from, { text: 'Tag user' }, { quoted: msg })
                await sock.groupParticipantsUpdate(from, users, 'remove')
                sock.sendMessage(from, { text: 'User removed ✅' }, { quoted: msg })
                break

            case 'promote':
                if (!isGroup ||!isAdmin ||!isBotAdmin) return
                let userP = msg.mentionedJid[0]? msg.mentionedJid : msg.quoted? [msg.quoted.sender] : []
                if (!userP[0]) return
                await sock.groupParticipantsUpdate(from, userP, 'promote')
                sock.sendMessage(from, { text: 'Promoted ✅' }, { quoted: msg })
                break

            case 'demote':
                if (!isGroup ||!isAdmin ||!isBotAdmin) return
                let userD = msg.mentionedJid[0]? msg.mentionedJid : msg.quoted? [msg.quoted.sender] : []
                if (!userD[0]) return
                await sock.groupParticipantsUpdate(from, userD, 'demote')
                sock.sendMessage(from, { text: 'Demoted ✅' }, { quoted: msg })
                break

            case 'grouplink':
                if (!isGroup ||!isBotAdmin) return
                let code = await sock.groupInviteCode(from)
                sock.sendMessage(from, { text: `https://chat.whatsapp.com/${code}` }, { quoted: msg })
                break

            case 'mute':
                if (!isGroup ||!isAdmin ||!isBotAdmin) return
                await sock.groupSettingUpdate(from, 'announcement')
                sock.sendMessage(from, { text: 'Group muted 🔇' }, { quoted: msg })
                break

            case 'unmute':
                if (!isGroup ||!isAdmin ||!isBotAdmin) return
                await sock.groupSettingUpdate(from, 'not_announcement')
                sock.sendMessage(from, { text: 'Group unmuted 🔊' }, { quoted: msg })
                break

            case 'joke':
                let joke = await axios.get('https://official-joke-api.appspot.com/random_joke')
                sock.sendMessage(from, { text: `${joke.data.setup}\n\n${joke.data.punchline}` }, { quoted: msg })
                break

            case 'fact':
                let fact = await axios.get('https://uselessfacts.jsph.pl/random.json?language=en')
                sock.sendMessage(from, { text: `*Fact:* ${fact.data.text}` }, { quoted: msg })
                break

            case 'coin':
                let coin = Math.random() < 0.5? 'Heads' : 'Tails'
                sock.sendMessage(from, { text: `🪙 *${coin}*` }, { quoted: msg })
                break

            case 'dice':
                let dice = Math.floor(Math.random() * 6) + 1
                sock.sendMessage(from, { text: `🎲 You rolled: *${dice}*` }, { quoted: msg })
                break

            case 'wiki':
                if (!q) return sock.sendMessage(from, { text: 'What to search?' }, { quoted: msg })
                try {
                    let res = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${q}`)
                    sock.sendMessage(from, { text: `*${res.data.title}*\n\n${res.data.extract}` }, { quoted: msg })
                } catch {
                    sock.sendMessage(from, { text: 'Not found' }, { quoted: msg })
                }
                break

            case 'calculate':
            case 'calc':
                if (!q) return sock.sendMessage(from, { text: 'Enter:.calc 2+2' }, { quoted: msg })
                try {
                    let result = eval(q.replace(/[^0-9+\-*/().]/g, ''))
                    sock.sendMessage(from, { text: `*Result:* ${result}` }, { quoted: msg })
                } catch {
                    sock.sendMessage(from, { text: 'Invalid calculation' }, { quoted: msg })
                }
                break

            case 'public':
                if (!isOwner) return
                sock.public = true
                sock.sendMessage(from, { text: 'Mode: Public ✅' }, { quoted: msg })
                break

            case 'self':
                if (!isOwner) return
                sock.public = false
                sock.sendMessage(from, { text: 'Mode: Self ✅' }, { quoted: msg })
                break

            case 'block':
                if (!isOwner) return
                let blockUser = msg.mentionedJid[0]? msg.mentionedJid[0] : msg.quoted? msg.quoted.sender : ''
                if (!blockUser) return
                await sock.updateBlockStatus(blockUser, 'block')
                sock.sendMessage(from, { text: 'User blocked' }, { quoted: msg })
                break

            case 'unblock':
                if (!isOwner) return
                let unblockUser = msg.mentionedJid[0]? msg.mentionedJid[0] : msg.quoted? msg.quoted.sender : ''
                if (!unblockUser) return
                await sock.updateBlockStatus(unblockUser, 'unblock')
                sock.sendMessage(from, { text: 'User unblocked' }, { quoted: msg })
                break
        }
    })
}

startBot()
