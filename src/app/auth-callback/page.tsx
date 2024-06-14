"use client"

import { useRouter, useSearchParams } from 'next/navigation'
import { trpc } from '../_trpc/client'
import { Loader2 } from 'lucide-react'
import { useEffect } from 'react'

const Page = () => {
  const router = useRouter()

  const searchParams = useSearchParams()
  const origin = searchParams.get('origin')

  const { data, error, isError } = trpc.authCallback.useQuery(undefined, {
    retry: true,
    retryDelay: 500,
  })

  useEffect(() => {
    if (data?.success) {
      // user is synced to db
      router.push(origin ? `/${origin}` : '/dashboard')
    }
  }, [data, origin, router])

  useEffect(() => {
    if (isError && error?.data?.code === 'UNAUTHORIZED') {
      router.push('/sign-in')
    }
  }, [isError, error, router])

  return (
    <div className='w-full mt-24 flex justify-center'>
      <div className='flex flex-col items-center gap-2'>
        <Loader2 className='h-8 w-8 animate-spin text-gray-400' />
        <h3 className='font-semibold text-xl text-orange-400'>
          Setting up your account...
        </h3>
        <p className=''>You will be redirected automatically.</p>
      </div>
    </div>
  )
}

export default Page
