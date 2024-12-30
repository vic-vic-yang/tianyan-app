'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { User, MenuItem } from '@/type/types'
import { Button } from '@repo/ui/components/ui/button'
import { ScrollArea } from '@repo/ui/components/ui/scroll-area'
import { cn } from '@repo/ui/lib/utils'
import { Users, BarChart, Layers, Settings, Home } from 'lucide-react'
import { useAuth } from '@/app/contexts/AuthContext'

interface SidebarProps {
  user: User
}

const menuItems: MenuItem[] = [
  { title: 'Dashboard', icon: Home, href: '/dashboard', roles: ['admin', 'manager', 'employee'] },
  { title: 'Customers', icon: Users, href: '/customers', roles: ['admin', 'manager', 'employee'] },
  { title: 'Analytics', icon: BarChart, href: '/analytics', roles: ['admin', 'manager'] },
  { title: 'Products', icon: Layers, href: '/products', roles: ['admin', 'manager'] },
  { title: 'Settings', icon: Settings, href: '/settings', roles: ['admin'] },
]

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const { isAuthorized } = useAuth()

  return (
    <div className={cn(
      "flex flex-col bg-gray-800 text-white transition-all duration-300 ease-in-out",
      isCollapsed ? "w-16" : "w-64"
    )}>
      <div className="flex items-center justify-between p-4">
        {!isCollapsed && <span className="text-xl font-bold">CRM</span>}
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-white hover:bg-gray-700"
        >
          {isCollapsed ? '→' : '←'}
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <nav className="space-y-2 p-2">
          {menuItems.map((item) => {
            if (isAuthorized(item.roles)) {
              return (
                <Link 
                  key={item.href} 
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-2 rounded-lg px-3 py-2 text-gray-300 hover:bg-gray-700 hover:text-white",
                    pathname === item.href && "bg-gray-900 text-white",
                    isCollapsed && "justify-center"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {!isCollapsed && <span>{item.title}</span>}
                </Link>
              )
            }
            return null
          })}
        </nav>
      </ScrollArea>
    </div>
  )
}

