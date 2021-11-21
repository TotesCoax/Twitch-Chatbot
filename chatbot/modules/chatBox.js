class Chatbox {
    constructor(){
        this.show = true,
        this.delay = 5,
        this.messages = []
    }
    add(user, message, msg){
        let newMsg = new ChatboxMessage(user, message, msg)
        this.messages = [...this.messages, newMsg]
        setTimeout(this.remove.bind(this), this.delay * 1000, newMsg)
        // console.log('Message Added')
        // console.log(this.messages)
    }
    remove(msg){
        // console.log(msg)
        this.messages = this.messages.filter(message => message.id !== msg.id)
        // console.log('Message Removed')
        // console.table(this.messages)
    }
}

class ChatboxMessage {
    constructor(user, message, msg){
        this.username = user,
        this.message = message,
        this.id = msg.id
    }
}

export {
    Chatbox, ChatboxMessage
}