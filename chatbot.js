require('dotenv').config()
const { StaticAuthProvider } = require('twitch-auth')
const { ChatClient } = require('twitch-chat-client')
const { PubSubClient } = require('twitch-pubsub-client')

console.log(process.env.LOAD_SUCCESS)

async function main(){
    const BOT_ID = process.env.BOT_CLIENT_ID
    const BOT_TOKEN = process.env.BOT_PASSWORD
    const BOT_SECRET = process.env.BOT_SECRET
    const MY_CHANNEL = '#totescoax'
    const authProvider = new StaticAuthProvider(BOT_ID, BOT_TOKEN)
    const CHAT = new ChatClient(authProvider, { channels: [MY_CHANNEL] })
    await CHAT.connect().catch(console.error())

}
main()


