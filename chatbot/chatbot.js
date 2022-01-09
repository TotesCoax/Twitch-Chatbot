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
    // const CODE = Secret.botCode
    // let newToken = await exchangeCode(clientId, clientSecret, CODE, 'http://localhost')
    // console.log(newToken)
    
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
    const API = new ApiClient({authProvider:clientAuthProvider})
    console.log('Connected to API?')
    // const API_token = await API.getTokenInfo()
    // console.log(API_token.scopes)
    // const rewards = await API.channelPoints.getCustomRewards(MY_CHANNEL_USERID)
    // rewards.forEach(reward => console.log(reward.title, reward.id))
    let pollHolder = []
    const polls = await API.polls.getPolls(MY_CHANNEL_USERID)
    polls.data.forEach(poll => pollHolder.push(new Pollbox(poll)))
    console.table(pollHolder)
    
    //PubSub connection for channel points redemptions
    const pubSubClient = new PubSubClient()
    const userId = await pubSubClient.registerUserListener(clientAuthProvider)
        .then(console.log('Connected to PubSub'))

    //Connection to chat
    const CHAT = new ChatClient({ authProvider:botAuthProvider, channels: [MY_CHANNEL], /*logger:{minLevel: 'debug'}*/ })
    await CHAT.connect().catch(console.error())
        .then(console.log('Connected to chat'))

    CHAT.onRegister(event => CHAT.say(MY_CHANNEL, AI.Startup.pullRandom()))

    //API Related

    //Pubsub Related
    pubSubClient.onRedemption(userId, (redeem) => {
        console.log(`${redeem.userName.toUpperCase()} has redeemed ${redeem.rewardTitle.toUpperCase()}: "${redeem.message}"`);
    })
    
    //Chat Related
    let DisplayChat = new Chatbox()
    //This is stuff that happens when a new message is put into chat.
    CHAT.onMessage((channel, user, message, msg) => {
        console.log(`${user}: ${message}`)
        DisplayChat.add(user, message, msg)
        if (message === "test"){
            CHAT.say(channel, 'The bot acknowledges your test.', {replyTo: msg})
        }
        if (message.charAt(0) === "!" && msg.userInfo.isBroadcaster){
            console.log("Command:", message.charAt(0) === "!" && msg.userInfo.isBroadcaster)
            CHAT.say(channel, "It will be done, my liege.")
        }
        if (message === "!polltest" && msg.userInfo.isBroadcaster){
            API.polls.createPoll(MY_CHANNEL_USERID, {title:"Did this work?", choices:["yes","no"], duration: 15})
            .catch(console.error())
            .then(console.log('Poll created'))
            // .then(newPoll => {console.log(newPoll.id)})
            .then(newPoll => setTimeout(pollResults, Utility.TOms({s:16}), API, newPoll.id))
        }
        if (message.toLowerCase() === "genkidama" && msg.userInfo.isBroadcaster){
            API.predictions.createPrediction(MY_CHANNEL_USERID, {autoLockAfter: 60, outcomes:["I need help!", "I want to help!"], title:"SEARCH WITHIN YOURSELF"})
                .catch(console.error())
                .then(CHAT.say(channel, "FOCUS YOUR ENERGY"))
        }
    })
    //Listener for moderator actions to remove message from displayed chat
    CHAT.onMessageRemove((channel, id, msg) =>{
        DisplayChat.remove(msg)
        console.log('Message was removed from DisplayChat in response to moderator action.')
    })
    async function pollResults(api, pollId){
        console.log('Getting poll data!')
        // console.log(api, pollId)
        let targetPoll = await api.polls.getPollById(MY_CHANNEL_USERID, pollId)

        targetPoll.choices.forEach(choice => console.log(`${choice.title}: ${choice.totalVotes}`))
    }
}
main()