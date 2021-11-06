//This is the module for a choose your own adventure minigame using twitch chat polls.

/* 
Things that are needed for this to work:
    Passed in API connection to polls to create and manage polls. Also needed to manage redemptions.
    Passed in chat connection to listen to the players.
    Passed in pubsub listener to see redemptions.
    Some sort of file housing the story of the adventure for the bot to pick through.
Actions:
    Start Poll
    Read Finished Poll
    Say things in chat
    React to redemption
    Register active players talking in chat
    Move to next chapter
    Add players to module from redemptions
    Clear out redeemed people from the queue.
    Toggle the entry redemption
Pseudocode:

*/
class ChooseYourOwnAdventure {
    /**
    @param apiConnection twurple API Client instance
    @param chatConnection twurple Chat Client instance
    @param pubsubConnection twurple PubSub connection instance
    */
    constructor(apiConnection, chatConnection, pubsubConnection){
        this.PollAPI = apiConnection,
        this.Chat = chatConnection,
        this.PubSub = pubsubConnection,
        this.players = []


    }
}

module.exports = {
    ChooseYourOwnAdventure
}