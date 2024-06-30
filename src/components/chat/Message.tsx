import React, { forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { ExtendedMessage } from '@/types/message'
import { Icons } from '../Icons'
import ReactMarkdown from 'react-markdown'
import { format } from 'date-fns'

type Props = {
  message: ExtendedMessage
  isNextMessageSameUSer: boolean
}

const Message = forwardRef<HTMLDivElement, Props>(
  ({message, isNextMessageSameUSer}, ref) => {
    return (
      <div ref={ref} className={cn('flex items-end', {
        'justify-end': message.isUserMessage,
      })}>
        <div className={cn("relative rounded-2xl flex h-9 shadow-xl w-9 p-1 items-center justify-center", {
          "order-2 bg-zinc-800": message.isUserMessage,
          "order-1 bg-zinc-800": !message.isUserMessage,
          invisible: isNextMessageSameUSer,
        })}>
          {message.isUserMessage ? (
            <Icons.user className='text-zinc-200 h-3/4 w-3/4'/>
          ) : (<Icons.logo className=' text-zinc-200 h-3/4 w-3/4'/>)
          }
        </div>
        <div className={cn("flex flex-col space-y-2 text-base max-w-md mx-2", {
          "order-1 items-end": message.isUserMessage,
          "order-2 items-start": !message.isUserMessage,
        })}>
          <div className={cn('px-4 py-2 rounded-lg inline-block', {
            'bg-orange-200 text-black': message.isUserMessage,
            'bg-zinc-900 text-white': !message.isUserMessage,
            'rounded-br-none': !isNextMessageSameUSer && message.isUserMessage,
            'rounded-bl-none': !isNextMessageSameUSer && !message.isUserMessage,
          })}>
            {typeof message.text === 'string' ? (
              <ReactMarkdown className={cn('prose', {
                "text-black": message.isUserMessage,
              })}>{message.text}</ReactMarkdown>
            ): (message.text)}
            {message.id !== 'loading-mssg'?(
              <div className={cn("text-xs select-none mt-2 w-full text-right", {
               'text-black': message.isUserMessage,
               'text-white': !message.isUserMessage,
              })}>
                {format(new Date(message.createdAt), 'hh:mm a')}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    )
  }
)

Message.displayName = 'Message'

export default Message
