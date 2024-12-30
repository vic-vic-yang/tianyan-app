'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/contexts/AuthContext'
import { UserRole } from '@/type/types'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles: UserRole[]
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, isAuthorized } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push('/login')
    } else if (!isAuthorized(allowedRoles)) {
      router.push('/unauthorized')
    }
  }, [user, isAuthorized, allowedRoles, router])

  if (!user || !isAuthorized(allowedRoles)) {
    return null
  }

  return <>{children}</>
}

