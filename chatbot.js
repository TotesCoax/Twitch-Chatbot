require('dotenv').config()
const tmi = require('tmi.js')

console.log(process.env.LOAD_SUCCESS)

const client = new tmi.Client({
    channels: ['totescoax']
})

client.connect().catch(console.error)

client.on('message', (channel, tags, message, self) => {
    console.log(`${tags['display-name']}: ${message}`)
    console.log(tags)
})