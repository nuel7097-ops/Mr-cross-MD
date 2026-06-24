global.isOwner = (jid) => {
    if (!jid) return false
    const number = jid.split('@')[0]
    return global.owner.includes(number)
}
