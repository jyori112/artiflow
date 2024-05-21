import ArticleStatus from "@/domain/article_status"
import Message from "@/domain/message"
import StructuringStatus from "@/domain/structuring_status"
import OpenAIInterface from "@/openai/openai"
import { StructuringPrompt } from "@/openai/prompt"
import assert from "assert"
import { use, useEffect, useState } from "react";

export default function StructuringColumn(props: { openai: OpenAIInterface, articleStatus: ArticleStatus, updateStructuringStatus: (status: StructuringStatus) => void}) {
  const [structuringStatus, setStructuringStatus] = useState<StructuringStatus|null>()
  const [structuringPrompt, setStructuringPrompt] = useState<StructuringPrompt|null>(null)

  const generateStructure = () => {
    console.log("Generating structure")
    assert(structuringPrompt, 'structuringPrompt is not set')
    assert(structuringStatus, 'structuringStatus is not set')

    let newStructuringStatus = structuringStatus

    structuringPrompt.chat([], (token: string, end: boolean) => {
      newStructuringStatus = newStructuringStatus.pushToken(token)
      setStructuringStatus(newStructuringStatus)
      props.updateStructuringStatus(newStructuringStatus)
    })
  }

  useEffect(() => {
    setStructuringStatus(new StructuringStatus(''))
  }, [])

  useEffect(() => {
    setStructuringPrompt(new StructuringPrompt(props.openai, props.articleStatus.conversation))
  }, [props.openai, props.articleStatus])

  if (!structuringStatus) {
    return <></>
  }

  return (
    <>
      <button className="btn btn-primary mt-3 mx-auto" onClick={generateStructure}>生成</button>
      <div dangerouslySetInnerHTML={{__html: structuringStatus.toHTML()}}></div>
    </>
  )
}
