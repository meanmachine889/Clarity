import React from 'react'

type Props = {}

const PdfRenderer = (props: Props) => {
  return (
    <div className='w-full rounded-md shadow flex flex-col items-center'>
        <div className='h-14 w-full border-b bg-gray-900 rounded-md border-black flex items-center justify-between px-2'>
            <div className='flex items-center gap-1.5'>Top Bar</div>
        </div>
    </div>
  )
}

export default PdfRenderer