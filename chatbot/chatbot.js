require('dotenv').config()
const { StaticAuthProvider } = require('@twurple/auth')
const { ChatClient } = require('@twurple/chat')

console.log(process.env.LOAD_SUCCESS)

async function main(){
    const clientId = process.env.BOT_CLIENT_ID
    const accessToken = process.env.BOT_PASSWORD
    const BOT_SECRET = process.env.BOT_SECRET
    const MY_CHANNEL = 'totescoax'
    const authProvider = new StaticAuthProvider(clientId, accessToken)
    const CHAT = new ChatClient({ authProvider, channels: [MY_CHANNEL] })
    await CHAT.connect().catch(console.error())

    CHAT.onMessage((channel, user, message, msg) => {
        console.log(`${user}: ${message}`)
        console.log(msg.userInfo.color)
    })

}
main()


