import React from 'react'
import MaxwidthWrapper from './maxWidthWrapper'
import Link from 'next/link'
import { buttonVariants } from './ui/button'
import { LoginLink, RegisterLink } from '@kinde-oss/kinde-auth-nextjs/server'
import { ArrowRight, GhostIcon } from 'lucide-react'

type Props = {}

const Navbar = (props: Props) => {
  return (
    <nav className='sticky h-14 inset-x-0 top-0 z-30 w-full border-b bg-opacity-70 border-gray-900 bg-black/75 backdrop-blur-lg transition-all'>
        <MaxwidthWrapper className="">
            <div className='flex h-14 items-center justify-between border-b border-gray-900'>
                <Link href={'/'} className=' items-center gap-2 md:flex hidden z-40 font-semibold'>
                    <GhostIcon className='h-7 w-7 mt-1'/>
                    <span className="text-3xl font-bold">clarity</span>
                </Link>
                <div className=' items-center space-x-4 flex'>
                    <>
                        <LoginLink className={buttonVariants({
                            variant: 'ghost',
                            size: 'sm'
                        })}>
                            sign in
                        </LoginLink>
                        <RegisterLink className={buttonVariants({
                            variant: 'ghost',
                            size: 'sm'
                        })}>
                            get started
                            <ArrowRight className='ml-1.5 h-5'/>
                        </RegisterLink>
                    </> 
                </div>
            </div>
        </MaxwidthWrapper>
    </nav>
  )
}

export default Navbar