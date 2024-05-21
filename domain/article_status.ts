import ConversationStatus from "./conversation_status"
import Message from "./message"
import StructuringStatus from "./structuring_status"
import { WritingStatus } from "./writing_status"

export default class ArticleStatus {
  conversation: ConversationStatus
  structuring: StructuringStatus
  writing: WritingStatus

  constructor(conversation: ConversationStatus, structuring: StructuringStatus, writing: WritingStatus) {
    this.conversation = conversation
    this.structuring = structuring
    this.writing = writing
  }

  setConversationStatus(conversation: ConversationStatus) {
    return new ArticleStatus(conversation, this.structuring, this.writing)
  }

  setStructuringStatus(structuring: StructuringStatus) {
    return new ArticleStatus(this.conversation, structuring, this.writing)
  }

  setWritingStatus(writing: WritingStatus) {
    return new ArticleStatus(this.conversation, this.structuring, writing)
  }

  static create() {
    return new ArticleStatus(new ConversationStatus([]), new StructuringStatus([]), new WritingStatus([]))
  }
}

