export default class StructuringStatus {
  message: string

  constructor(message: string) {
    this.message = message
  }

  pushToken(token: string) {
    return new StructuringStatus(this.message + token)
  }

  toHTML() {
    return this.message.replace(/\n/g, "<br>")
  }
}
