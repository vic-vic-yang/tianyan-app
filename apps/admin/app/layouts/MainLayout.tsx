import { ReactNode } from 'react'
import { User } from '@/type/types'
import Header from '@/app/components/header'
import Sidebar from '@/app/components/Siddebar'

interface MainLayoutProps {
  children: ReactNode
  user: User
}

export default function MainLayout({ children, user }: MainLayoutProps) {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar user={user} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header user={user} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

