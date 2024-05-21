'use client'

import ReactQuill from 'react-quill';
import ArticleStatus from "@/domain/article_status"
import OpenAIInterface from "@/openai/openai"

import 'react-quill/dist/quill.snow.css';
import { useEffect, useState } from 'react';
import { DraftPrompt, StructuringPrompt } from '@/openai/prompt';
import assert from 'assert';
import { Line, WritingStatus } from '@/domain/writing_status';

export default function WritingColumn(props: { openai: OpenAIInterface, articleStatus: ArticleStatus}) {
  const [writingStatus, setWritingStatus] = useState<WritingStatus|null>()
  const [hoveredLine, setHoveredLine] = useState<number | null>(null)
  const [draftPrompt, setDraftPrompt] = useState<StructuringPrompt | null>(null)

  const generateArticle = () => {
    onDraftSubmit()
  }

  const onDraftSubmit = async () => {
    assert(draftPrompt, 'draftPrompt is not set')
    assert(writingStatus, 'writingStatus is not set')

    let newWritingStatus = new WritingStatus([new Line(0, '')])
    setWritingStatus(newWritingStatus)

    draftPrompt.chat([], (token: string, end: boolean) => {
      newWritingStatus = newWritingStatus.pushMessageToken(token)
      setWritingStatus(newWritingStatus)
    })
  }

  const onMouseEnter = (lineId: number, e: React.MouseEvent<HTMLParagraphElement, MouseEvent>) => {
    console.log("Hover", lineId, e)
    setHoveredLine(lineId)
  }

  const onMouseLeave = (e: React.MouseEvent<HTMLParagraphElement, MouseEvent>) => {
    setHoveredLine(null)
  }

  useEffect(() => {
    setWritingStatus(new WritingStatus([new Line(0, '')]))
  }, [])

  useEffect(() => {
    setDraftPrompt(new DraftPrompt(props.openai, props.articleStatus.structuring))
  }, [props.openai, props.articleStatus])

  if (!writingStatus) {
    return <></>
  }

  return (
    <>
      <button className="btn btn-primary mt-3 mx-auto" onClick={generateArticle}>生成</button>
      <div className="article-body p-2" contentEditable>
        {
          writingStatus.lines.map((line, index) => (
            <p id={`p-${line.id}`} className="mt-1" key={line.id}
              dangerouslySetInnerHTML={{ __html: line.text }}
              onMouseEnter={(e) => onMouseEnter(line.id, e)} onMouseLeave={onMouseLeave}></p>
          ))
        }
      </div>
      <p>{ hoveredLine && "Hello World" }</p>
    </>
  )
}