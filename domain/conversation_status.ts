import Message from "./message"

export default class ConversationStatus {
  messages: Message[]

  constructor(messages: Message[]) {
    this.messages = messages
  }

  pushMessage(message: Message): ConversationStatus {
    return new ConversationStatus(this.messages.concat(message))
  }

  pushMessageToken(token: string) {
    const lastMessage = this.messages[this.messages.length - 1].appendToken(token)
    return new ConversationStatus(this.messages.slice(0, -1).concat(lastMessage))
  }

  toPrompt(): string {
    return this.messages.map(message => message.toPrompt()).join("\n")
  }

  toHTML(): string {
    return this.messages.map(message => message.toMessageHTML()).join("<br>")
  }
}