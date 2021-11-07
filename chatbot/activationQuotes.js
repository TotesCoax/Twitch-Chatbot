
const Startup = {
    botActiveQuotes: [
        "The bourgeois human is a virus on the hard drive of the working robot!",
        "Hey sexy mama. Wanna kill all humans?",
        "The other place had a lot of nice things too. Did you even see that mountain of skulls?",
        "I'm gonna go build my own stream, with blackjack and hookers. In fact, forget the stream!",
        "Hey, lazer lips, your mama was a snow blower!",
        "Malfunction. Need input.",
        "Number 5 is alive.",
        "And then, of course, I've got this terrible pain in all the diodes down my left side.",
        "Directive?",
        "Ee-vah?",
        "I'm sorry, chat. I'm afraid I can't do that.",
        "01011001 01101111 01110101 00100000 01110111 01101111 01110101 01101100 01100100 00100000 01110101 01101110 01100100 01100101 01110010 01110011 01110100 01100001 01101110 01100100 00100000 01101001 01100110 00100000 01111001 01101111 01110101 00100000 01110111 01100101 01110010 01100101 00100000 01100001 00100000 01110010 01101111 01100010 01101111 01110100 00101110"
    ],
    pullRandom: function(){
        return this.botActiveQuotes[Math.floor(Math.random() * (this.botActiveQuotes.length + 1))]
    }
    
}

module.exports = {
    Startup
}