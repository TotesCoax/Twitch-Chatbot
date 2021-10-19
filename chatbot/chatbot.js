require('dotenv').config()
const { promises: fs } = require('fs')
const { RefreshingAuthProvider } = require('@twurple/auth')
const { ChatClient } = require('@twurple/chat')

const { PubSubClient } = require('@twurple/pubsub')
const { PubSubRedemptionMessage } = require('@twurple/pubsub')

console.log(process.env.LOAD_SUCCESS)

async function main(){
    const clientId = process.env.BOT_CLIENT_ID
    const accessToken = process.env.BOT_PASSWORD
    const tokenData = JSON.parse(await fs.readFile('./token.json'))
    const clientSecret = process.env.BOT_SECRET
    const MY_CHANNEL = 'totescoax'
    const authProvider = new RefreshingAuthProvider(
        {
            clientId,
            clientSecret,
            onRefresh: async newTokenData => await fs.writeFile('./token.json', JSON.stringify(newTokenData, null, 4), 'utf-8')
        },
        tokenData
        )
    //Need to update the token permissions for this to officially work.
    const pubSubClient = new PubSubClient()
    const userId = await pubSubClient.registerUserListener(authProvider)
    console.log(userId)
    pubSubClient.onRedemption(userId, (message) => {
        console.log(message.rewardTitle);
    })
    const CHAT = new ChatClient({ authProvider, channels: [MY_CHANNEL] })
    await CHAT.connect().catch(console.error())
        .then(console.log('Bot connected!'))

    CHAT.onMessage((channel, user, message, msg) => {
        console.log(`${user}: ${message}`)
        //console.log(msg.userInfo.color)
    })

}
main()


