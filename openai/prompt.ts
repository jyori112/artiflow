import Message from "@/domain/message";
import OpenAIInterface from "./openai";
import StructuringStatus from "@/domain/structuring_status";
import ConversationStatus from "@/domain/conversation_status";

export class Prompt {
  private openai: OpenAIInterface;
  private promptString: string;

  constructor(openai: OpenAIInterface, promptString: string) {
    this.openai = openai
    this.promptString = promptString;
  }

  async chat(messages: Message[], onToken: (token: string, end: boolean) => void): Promise<void> {
    await this.openai.chat(this.promptString, messages, onToken)
  }
}

export class ConversationPrompt extends Prompt {
  constructor(openai: OpenAIInterface) {
    super(
      openai,
      `
あなたはIT技術・システム開発のスペシャリストです
`
    )
  }
}

export class StructuringPrompt extends Prompt {
  constructor(openai: OpenAIInterface, conversationStatus: ConversationStatus) {
    super(
      openai,
      `
あなたはIT技術・システム開発のスペシャリストです。以下の会話をまとめ、記事の構成を考えてください。

${conversationStatus.toPrompt()}
`
    )
  }
}

export class DraftPrompt extends Prompt {
  constructor(openai: OpenAIInterface, structuringStatus: StructuringStatus) {
    super(
      openai,
      `
あなたはIT技術・システム開発のスペシャリストです。技術系の記事を執筆してください。
これまでに、記事の内容・構成についての対話が行われています。以下の内容を元に、記事を執筆してください。

返答は記事の内容のみで、最初の行に記事のタイトルを記入してください。
`
    )
  }
}