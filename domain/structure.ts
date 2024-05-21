export class Structure {
  title: string
  sections: Section[]

  constructor(title: string, sections: Section[]) {
    this.title = title
    this.sections = sections
  }

  toPromptString(): string {
    const sections = this.sections.map((section) => `## ${section.title}\n${section.summary}`).join('\n\n')
    return `Title: ${this.title}\n${sections}`
  }
}

export class Section {
  title: string
  summary: string

  constructor(title: string, summary: string) {
    this.title = title
    this.summary = summary
  }
}