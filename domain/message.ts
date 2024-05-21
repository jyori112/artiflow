import { Section, Structure } from "./structure"

export default class Message {
  role: 'user' | 'assistant'
  text: string

  constructor(role: 'user' | 'assistant', text: string) {
    this.role = role
    this.text = text
  }

  extractStructure(): Structure | null {
    const structure = this.text.match(/(```|''')article_structure.json\n({[^]+})\n(```|''')/)?.[2]
    if (!structure) {
      return null
    }

    try {
      const parsed = JSON.parse(structure)
      return new Structure(parsed.title, parsed.sections.map((section: any) => new Section(section.title, section.summary)))
    } catch (e) {
      return null
    }
  }

  rawText(): string {
    return this.text.split(/(```|''')article_structure.json/, 1)[0]
  }

  toMessageHTML(): string {
    return this.rawText().replaceAll('\n', '<br>')
  }

  appendToken(token: string): Message {
    return new Message(this.role, this.text + token)
  }

  toPrompt(): string {
    return this.role + ': ' + this.text
  }
}
