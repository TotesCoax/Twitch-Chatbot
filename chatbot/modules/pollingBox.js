class Pollbox {
    constructor(pollData){
        this.title = pollData.title,
        this.choices = pollData.choices.map(choice => new PollboxChoice(choice)),
        this.winner = ""
        this.status = pollData.status
    }
}

class PollboxChoice {
    constructor(choice){
        this.title = choice.title,
        this.total = choice.totalVotes
    }
}

export {
    Pollbox, PollboxChoice
}