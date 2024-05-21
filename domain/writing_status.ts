export class WritingStatus {
  lines: Line[]

  constructor(lines: Line[]) {
    this.lines = lines
  }

  get title(): string {
    if (this.lines.length === 0) return ''
    return this.lines[0].text
  }

  get bodyLines(): Line[] {
    return this.lines.slice(1)
  }

  pushMessageToken(token: string): WritingStatus {
    const lines = token.split('\n')
    const lastLine = this.lines[this.lines.length - 1].pushToken(lines[0])
    return new WritingStatus(this.lines.slice(0, -1).concat(lastLine).concat(lines.slice(1).map((line, index) => new Line(this.lines.length + index, line))))
  }

  static fromResponse(response: string): WritingStatus {
    console.log("Response", response)
    console.log("Response", response.trim())
    return new WritingStatus(response.trim().split('\n').map((line, index) => new Line(index, line)))
  }
}


export class Line {
  id: number
  text: string

  constructor(id: number, text: string) {
    this.id = id
    this.text = text
  }

  pushToken(token: string): Line {
    return new Line(this.id, this.text + token)
  }
}