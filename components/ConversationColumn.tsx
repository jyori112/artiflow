import ConversationStatus from "@/domain/conversation_status"
import { ConversationPrompt } from "@/openai/prompt"
import Message from "@/domain/message"
import OpenAIInterface from "@/openai/openai"
import assert from "assert"
import { useEffect, useState } from "react";

export default function ConversationColumn(props: { openai: OpenAIInterface, updateConversationStatus: (status: ConversationStatus) => void}) {
  const [conversationStatus, setConversationStatus] = useState<ConversationStatus|null>()
  const conversationPrompt = new ConversationPrompt(props.openai)

  const chatEditorKeyDown = async (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.currentTarget.textContent && e.key === 'Enter' && e.metaKey) {
      onMessageSubmit(e.currentTarget.textContent)
      e.currentTarget.textContent = ''
      e.preventDefault()
    }
  }

  const onMessageSubmit = async (message: string) => {
    assert(conversationStatus, 'conversationStatus is not set')

    let newConversationStatus = conversationStatus.pushMessage(new Message('user', message)).pushMessage(new Message('assistant', ''))
    setConversationStatus(newConversationStatus)
    props.updateConversationStatus(newConversationStatus)

    await conversationPrompt.chat(newConversationStatus.messages, (token: string, end: boolean) => {
      newConversationStatus = newConversationStatus.pushMessageToken(token)
      setConversationStatus(newConversationStatus)
      props.updateConversationStatus(newConversationStatus)
    })
  }

  useEffect(() => {
    setConversationStatus(new ConversationStatus([]))
  }, [])

  if (!conversationStatus) {
    return <></>
  }

  return (
    <>
      <div className="row">
        {
          conversationStatus.messages.map((message, index) => (
            <div key={index} className='border-bottom p-3'>
              <h6 className="h6">{message.role === 'user' ? 'あなた' : 'AI'}</h6>
              <p className="pl-3" dangerouslySetInnerHTML={{ __html: message.toMessageHTML() }}></p>
            </div>
          ))
        }
      </div>
      <div className="row mt-auto border-top">
        <div className="col h-20 p-3 chat-editor" contentEditable onKeyDown={chatEditorKeyDown}></div>
      </div>
    </>
  )
}
