//Actually Important Imports
const { Secret } = require('./secrets')
const { promises: fs } = require('fs')
const { RefreshingAuthProvider, exchangeCode } = require('@twurple/auth')

const { ApiClient } = require ('@twurple/api')

const { PubSubClient, PubSubRedemptionMessage } = require('@twurple/pubsub')

const { ChatClient } = require('@twurple/chat')

//My shitty meme imports... so the truly important imports
const AI = require('./modules/rougeAI')
const { Utility } = require('./utilities')
const { Chatbox, ChatboxMessage } = require('./modules/chatBox')
const { Pollbox, PollboxChoice } = require('./modules/pollingBox')

console.log(Secret.loadSuccess)

async function main(){
    const clientId = Secret.botClientID
    const clientSecret = Secret.botSecret
    const MY_CHANNEL = 'totescoax'
    const MY_CHANNEL_USERID = '132562074'
    
    //bit that turns client code into access token
    // const botCODE = Secret.botCode
    // let newToken = await exchangeCode(clientId, clientSecret, botCODE, 'http://localhost')
    // console.log(newToken)

    // const clientCODE = Secret.clientCode
    // let newClientToken = await exchangeCode(clientId, clientSecret, clientCODE, 'http://localhost')
    // console.log(newClientToken)
    
    const tokenData = JSON.parse(await fs.readFile('./token.json'))
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

    // let bot_token_info = await getTokenInfo(tokenData.accessToken)
    // console.log(bot_token_info.scopes)
    // let client_token_info = await getTokenInfo(clientToken.accessToken)
    // console.log(client_token_info.scopes)

    //API Connection
    const activeAPI = new ApiClient({authProvider:clientAuthProvider})
    console.log('Connected to API?')
    // const API_token = await API.getTokenInfo()
    // console.log(API_token.scopes)
    // const rewards = await API.channelPoints.getCustomRewards(MY_CHANNEL_USERID)
    // rewards.forEach(reward => console.log(reward.title, reward.id))
    let pollHolder = []
    const polls = await activeAPI.polls.getPolls(MY_CHANNEL_USERID)
    polls.data.forEach(poll => pollHolder.push(new Pollbox(poll)))
    console.table(pollHolder)
    
    //PubSub connection for channel points redemptions
    const activePubSubClient = new PubSubClient()
    const userId = await activePubSubClient.registerUserListener(clientAuthProvider)
        .then(console.log('Connected to PubSub'))

    //Connection to chat
    const activeCHAT = new ChatClient({ authProvider:botAuthProvider, channels: [MY_CHANNEL], /*logger:{minLevel: 'debug'}*/ })
    await activeCHAT.connect().catch(console.error())
        .then(console.log('Connected to chat'))

    activeCHAT.onRegister(event => activeCHAT.say(MY_CHANNEL, AI.Startup.pullRandom()))

    //API Related

    //Pubsub Related
    activePubSubClient.onRedemption(userId, (redeem) => {
        console.log(`${redeem.userName.toUpperCase()} has redeemed ${redeem.rewardTitle.toUpperCase()}: "${redeem.message}"`);
    })
    
    //Chat Related
    //This is stuff that happens when a new message is put into chat.
    activeCHAT.onMessage((channel, user, message, msg) => {
        console.log(`${user}: ${message}`)
        if (message === "test"){
            activeCHAT.say(channel, 'The bot acknowledges your test.', {replyTo: msg})
        }
        if (message.charAt(0) === "!" && msg.userInfo.isBroadcaster){
            console.log("Command:", message.charAt(0) === "!" && msg.userInfo.isBroadcaster)
            activeCHAT.say(channel, "It will be done, my liege.")
        }
        if (message === "!polltest" && msg.userInfo.isBroadcaster){
            activeCHAT.polls.createPoll(MY_CHANNEL_USERID, {title:"Did this work?", choices:["yes","no"], duration: 15})
            .catch(console.error())
            .then(console.log('Poll created'))
            // .then(newPoll => {console.log(newPoll.id)})
            .then(newPoll => setTimeout(pollResults, Utility.TOms({s:16}), activeCHAT, newPoll.id))
        }
        if (message.toLowerCase() === "genkidama" && msg.userInfo.isBroadcaster){
            activeCHAT.predictions.createPrediction(MY_CHANNEL_USERID, {autoLockAfter: 60, outcomes:["I need help!", "I want to help!"], title:"SEARCH WITHIN YOURSELF"})
                .catch(console.error())
                .then(activeCHAT.say(channel, "FOCUS YOUR ENERGY"))
        }
    })
    //Listener for moderator actions to remove message from displayed chat
    activeCHAT.onMessageRemove((channel, id, msg) =>{
        console.log('Message was removed in response to moderator action.')
    })
    async function pollResults(api, pollId){
        console.log('Getting poll data!')
        // console.log(api, pollId)
        let targetPoll = await api.polls.getPollById(MY_CHANNEL_USERID, pollId)

        targetPoll.choices.forEach(choice => console.log(`${choice.title}: ${choice.totalVotes}`))
    }
}
main()

// export { activeAPI, activePubSubClient, activeCHAT }