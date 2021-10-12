const tmi = require('tmi.js')

const client = new tmi.Client({
    channels: ['totescoax']
})

client.connect().catch(console.error)

client.on('message', (channel, tags, message, self) => {
    console.log(`${tags['display-name']}: ${message}`)
    console.log(tags)
})