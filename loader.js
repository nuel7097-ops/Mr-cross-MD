const fs = require("fs")

module.exports = (sock) => {
    const files = fs.readdirSync("./plugins").filter(f => f.endsWith(".js"))

    for (let file of files) {
        const plugin = require(`../plugins/${file}`)

        if (plugin?.name && plugin?.run) {
            sock.commands.set(plugin.name, plugin.run)
            console.log("⚡ Loaded:", plugin.name)
        }
    }
}
