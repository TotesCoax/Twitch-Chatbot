require('dotenv').config()
const { promises: fs } = require('fs')
const { RefreshingAuthProvider, exchangeCode, getTokenInfo } = require('@twurple/auth')

const { ApiClient, ChattersList } = require ('@twurple/api')

const { PubSubClient, PubSubRedemptionMessage } = require('@twurple/pubsub')

const { ChatClient } = require('@twurple/chat')

console.log(process.env.LOAD_SUCCESS)

async function main(){
    const clientId = process.env.BOT_CLIENT_ID
    const tokenData = JSON.parse(await fs.readFile('./token.json'))
    const clientSecret = process.env.BOT_SECRET
    const MY_CHANNEL = 'totescoax'
    const MY_CHANNEL_USERID = '132562074'

    //bit that turns client code into access token
    // const CODE = process.env.CLIENT_CODE
    // let newToken = await exchangeCode(clientId, clientSecret, CODE, 'http://localhost')
    // console.log(newToken)

    const botAuthProvider = new RefreshingAuthProvider(
        {
            clientId,
            clientSecret,
            onRefresh: async newTokenData => await fs.writeFile('./token.json', JSON.stringify(newTokenData, null, 4), 'utf-8')
        },
        tokenData
        )
    console.log('Bot auth generated')
    const clientToken = JSON.parse(await fs.readFile('./usertoken.json'))
    const clientAuthProvider = new RefreshingAuthProvider(
        {
            clientId,
            clientSecret,
            onRefresh: async newTokenData => await fs.writeFile('./usertoken.json', JSON.stringify(newTokenData, null, 4), 'utf-8')
        },
        clientToken
        )
    console.log('Client auth generated')

    console.log(botAuthProvider.clientId, clientAuthProvider.clientId)

    // let bot_token_info = await getTokenInfo(tokenData.accessToken)
    // console.log(bot_token_info.scopes)
    // let client_token_info = await getTokenInfo(clientToken.accessToken)
    // console.log(client_token_info.scopes)

    // //API Connection
    const API = new ApiClient({authProvider:clientAuthProvider})
    console.log('Connected to API?')
    const API_token = await API.getTokenInfo()
    console.log(API_token.scopes)
    const rewards = await API.channelPoints.getCustomRewards(MY_CHANNEL_USERID)
    rewards.forEach(reward => console.log(reward.title, reward.id))
    
    //PubSub connection for channel points redemptions
    const pubSubClient = new PubSubClient()
    const userId = await pubSubClient.registerUserListener(clientAuthProvider)
        .then(console.log('Connected to PubSub'))
    pubSubClient.onRedemption(userId, (message) => {
        console.log(message.rewardTitle);
    })

    //Connection to chat
    const CHAT = new ChatClient({ botAuthProvider, channels: [MY_CHANNEL] })
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

