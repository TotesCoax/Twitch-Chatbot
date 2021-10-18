require('dotenv').config()
const { promises: fs } = require('fs')
const { RefreshingAuthProvider } = require('@twurple/auth')
const { ChatClient } = require('@twurple/chat')


console.log(process.env.LOAD_SUCCESS)

async function main(){
    const tokenData = JSON.parse(await fs.readFile('./token.json'))
    const clientId = process.env.BOT_CLIENT_ID
    const accessToken = process.env.BOT_PASSWORD
    const BOT_SECRET = process.env.BOT_SECRET
    const MY_CHANNEL = 'totescoax'
    const authProvider = new RefreshingAuthProvider(
        {
            clientId,
            BOT_SECRET,
            onRefresh: async newTokenData => await fs.writeFile('./token.json', JSON.stringify(newTokenData, null, 4), 'utf-8')
        },
        tokenData
    )
    const CHAT = new ChatClient({ authProvider, channels: [MY_CHANNEL] })
    await CHAT.connect().catch(console.error())

    CHAT.onMessage((channel, user, message, msg) => {
        console.log(`${user}: ${message}`)
        //console.log(msg.userInfo.color)
    })

}
main()


