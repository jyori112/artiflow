import Message from '@/domain/message';
import OpenAI from 'openai';

export default class OpenAIInterface {
  private client: OpenAI;

  constructor(apiKey: string) {
    this.client = new OpenAI({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true
    });
  }

  async chat(prompt: string, messages: Message[], onToken: (token: string, end: boolean) => void): Promise<void> {
    const params: OpenAI.Chat.ChatCompletionCreateParams = {
      messages: [{ role: 'system', content: prompt }, ...messages.map((message) => ({ role: message.role, name: message.role, content: message.text }))],
      model: 'gpt-4',
      stream: true
    };

    const stream = await this.client.chat.completions.create(params);

    for await (const chunk of stream) {
      onToken(chunk.choices[0]?.delta?.content || "", false);
    }

    onToken('', true)
  }
}