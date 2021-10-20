require('dotenv').config()
const { promises: fs } = require('fs')
const { RefreshingAuthProvider } = require('@twurple/auth')
const { ChatClient } = require('@twurple/chat')

const { PubSubClient } = require('@twurple/pubsub')
const { PubSubRedemptionMessage } = require('@twurple/pubsub')

console.log(process.env.LOAD_SUCCESS)

async function main(){
    const clientId = process.env.BOT_CLIENT_ID
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
    //PubSub connection for channel points redemptions
    const pubSubClient = new PubSubClient()
    const userId = await pubSubClient.registerUserListener(authProvider)
        .then(console.log('Connected to PubSub'))
    pubSubClient.onRedemption(userId, (message) => {
        console.log(message.rewardTitle);
    })

    //Connection to chat
    const CHAT = new ChatClient({ authProvider, channels: [MY_CHANNEL] })
    await CHAT.connect().catch(console.error())
        .then(console.log('Connected to chat'))

    CHAT.onMessage((channel, user, message, msg) => {
        console.log(`${user}: ${message}`)
        if (message === "test"){
            CHAT.say(channel, 'The bot acknowledges your test.')
        }
    })

}
main()


