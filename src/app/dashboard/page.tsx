import { db } from '@/db'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { redirect } from 'next/navigation'
import React from 'react'
import Dashboard from "@/components/dashboard"

type Props = {}

const DashboardPage = async (props: Props) => {
 
  const {getUser} = getKindeServerSession()

  const user = await getUser();

  if(!user){
    redirect('/auth-callback?origin=dashboard')
  }

  const dbUser = await db.user.findFirst({
    where:{
      id: user.id
    }
  })

  if(!dbUser) redirect('/auth-callback?origin=dashboard')

  return (
    <Dashboard/>
  )
}

export default DashboardPage