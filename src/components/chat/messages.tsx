import { trpc } from '@/app/_trpc/client'
import { Loader2, MessagesSquareIcon } from 'lucide-react'
import React, { useContext, useEffect } from 'react'
import Skeleton from 'react-loading-skeleton'
import Message from './Message'
import { ChatContext } from './chatContext'
import {useIntersection} from '@mantine/hooks'

type Props = {
  fileId: string
}

const Messages = ({fileId}: Props) => {

  const {isLoading: aiThinking} = useContext(ChatContext)

  const {data, isLoading, fetchNextPage} = trpc.getFileMessages.useInfiniteQuery({
    fileId,
    limit: 10,
  }, {
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  })

  const messages = data?.pages.flatMap((page) => page.messages) ?? []

  const loadingMessage = {
    createdAt: new Date().toISOString(),
    id: 'loading-mssg',
    isUserMessage: false,
    text:(
      <span className='flex h-full items-center justify-center'><Loader2 className='h-4 w-4 animate-spin'/></span>
    )
  }

  const combinedMessage = [
    ...(aiThinking ? [loadingMessage] : []),
    ...(messages ?? [])
  ]

  const lastMessageRef = React.useRef<HTMLDivElement>(null)

  const {ref, entry}  = useIntersection({
    root: lastMessageRef.current,
    threshold:1
  })

  useEffect(() => {
    if(entry?.isIntersecting){
      fetchNextPage()
    } 
  }, [entry, fetchNextPage])

  return (
    <div className='flex max-h-[calc(100vh-3.5rem-7rem)] border-zinc-700 flex-1 flex-col-reverse gap-4 p-3 overflow-y-auto scroll-thumb-orange scrollbar-thumb-rounded scrollbar-track-orange-lighter scrollbar-w-2 scrolling-touch'>
      {combinedMessage && combinedMessage.length > 0 ? (
        combinedMessage.map((message, index) => {

          const isNextMessageSameUSer = combinedMessage[index-1]?.isUserMessage === combinedMessage[index]?.isUserMessage

          if(index === combinedMessage.length-1){
            return <Message ref={ref} message={message} key={message.id} isNextMessageSameUSer={isNextMessageSameUSer}/>
          }
          else{
            return <Message message={message} key={message.id} isNextMessageSameUSer={isNextMessageSameUSer}/>
          }
        })
      ) : isLoading ? (<div className='w-full flex flex-col gap-2'>
        <Loader2 className='animate-spin text-orange-500'/>
      </div>) : (
        <div className='flex-1 flex fle-col items-center justify-center gap-2'>
          <MessagesSquareIcon className='h-8 w-8 text-orange-500'/>
          <h3 className='font-semibold text-xl'>you&apos;re all set!</h3>
        </div>
      )}
    </div>
  )
}

export default Messages