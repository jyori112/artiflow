import ArticleStatus from "@/domain/article_status";

import StructuringStatus from "@/domain/structuring_status";
import OpenAIInterface from "@/openai/openai";
import assert from "assert";
import { useEffect, useState } from "react";
import { getCookie, setCookie } from 'typescript-cookie'

import StructuringColumn from "@/components/StructuringColumn";
import dynamic from "next/dynamic";
import ConversationColumn from "@/components/ConversationColumn";
import ConversationStatus from "@/domain/conversation_status";

const WritingColumn = dynamic(() => import('@/components/WritingColumn'), { ssr: false })

export default function Home() {
  const [focus, setFocus] = useState<'conversation' | 'structuring' | 'writing'>('structuring')
  const [articleStatus, setArticleStatus] = useState<ArticleStatus>(ArticleStatus.create())
  const [openai, setOpenai] = useState<OpenAIInterface | null>(null)

  const moveTo = (column: 'conversation' | 'structuring' | 'writing') => {
    setFocus(column)
  }

  const updateConversationStatus = (status: ConversationStatus) => {
    setArticleStatus(articleStatus.setConversationStatus(status))
  }

  const updateStructuringStatus = (status: StructuringStatus) => {
    setArticleStatus(articleStatus.setStructuringStatus(status))
  }

  useEffect(() => {
    if (!getCookie('apiToken')) {
      const token = prompt('OpenAPI Tokenを入力してください。')

      if (token) {
        setCookie('apiToken', token, { expires: 1, path: '/', secure: true, sameSite: 'strict' });
      } else {
        alert('OpenAPI Tokenが入力されなかったため、ページをリロードします。')
        location.reload()
      }
    }

    const apiToken = getCookie('apiToken')
    assert(apiToken, 'apiToken is not set')

    const openai = new OpenAIInterface(apiToken)
    setOpenai(openai)
  }, [articleStatus])


  if (!openai) {
    return <div>Loading...</div>
  }

  return (
    <div className="container-fluid h-100">
      <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
        <div className={`col-${focus === 'conversation' ? '6' : '3'} d-flex flex-column`}>
          <div className="col text-center" onClick={() => moveTo('conversation')}>
            <span className="navbar-brand mx-auto">対話</span>
          </div>
        </div>
        <div className={`col-${focus === 'structuring' ? '6' : '3'} d-flex flex-column`}>
          <div className="col text-center" onClick={() => moveTo('structuring')}>
            <span className="navbar-brand mx-auto">構造化</span>
          </div>
        </div>
        <div className={`col-${focus === 'writing' ? '6' : '3'} d-flex flex-column`}>
          <div className="col text-center" onClick={() => moveTo('writing')}>
            <span className="navbar-brand mx-auto">執筆</span>
          </div>
        </div>
      </nav>
      <div className="row h-100 pt-5">
        <div className={`col-${focus === 'conversation' ? '6' : '3'} d-flex flex-column`}>
          <ConversationColumn openai={openai} updateConversationStatus={updateConversationStatus} />
        </div>
        <div className={`col-${focus === 'structuring' ? '6' : '3'} d-flex flex-column border-x`}>
          <StructuringColumn openai={openai} articleStatus={articleStatus} updateStructuringStatus={updateStructuringStatus} />
        </div>
        <div className={`col-${focus === 'writing' ? '6' : '3'} d-flex flex-column p-0`}>
          <WritingColumn openai={openai} articleStatus={articleStatus} />
        </div>
      </div>
    </div>
  );
}
