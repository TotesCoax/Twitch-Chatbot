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
    Move to next chapter
    Toggle the entry redemption
    Take requests from chat?
Pseudocode:
    Someone summons an adventure - Redeem? Chat command?
    The app creates a new adventure
        Pulls data from saved adventure file
        Builds choice tree
    Game loop
        Exposition/Intro - App relaying information via chat or overlay
        Start the first choice
        Wait for the results
        Announce winning choice
        Process results and move onto next section
        Repeat loop until end

*/
class ChooseYourOwnAdventure {
    constructor(apiConnection, chatConnection, pubsubConnection){
        this.PollAPI = apiConnection,
        this.Chat = chatConnection,
        this.PubSub = pubsubConnection,
        this.ChoiceTree = {}
    }
    createAdventure(){

    }
}

class Chapter {
    constructor(introText, choices){
        this.exposition = introText,
        this.choices = choices
    }
}
class Choice {
    constructor(choiceTitle, chosenText){
        this.name = choiceTitle,
        this.text = chosenText,
        this.chosen = false
    }
}

module.exports = {
    ChooseYourOwnAdventure, Chapter, Choice
}