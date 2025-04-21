'use client'

import { BadgeCheck, Bell, CreditCard, LogOut, ShieldUser } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { useAuth } from '@/hooks/use-auth'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { WithPermission } from '@/hooks/use-permission'
import { P } from '@/constants/permissions'

export default function NavUser() {
  const router = useRouter()
  const { user, userInfo, isLoading, signOut } = useAuth()

  if (isLoading) {
    return <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
  }

  if (!user) {
    return (
      <div className="flex items-center space-x-2">
        <Button
          className="cursor-pointer"
          onClick={() => router.push('/auth/signin')}
        >
          Sign in
        </Button>
      </div>
    )
  }

  const userInitial =
    userInfo?.user_name?.[0] ||
    userInfo?.full_name?.[0] ||
    user.email?.[0] ||
    'U'
  const userName = '@' + userInfo?.user_name
  const userNickname = userInfo?.full_name || userInfo?.user_name
  const avatarUrl =
    userInfo?.avatar_url ||
    `https://api.dicebear.com/7.x/identicon/svg?seed=${userInfo?.user_name}`

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer">
          {userInfo?.user_name ? (
            <AvatarImage src={avatarUrl} alt={userName || '用户头像'} />
          ) : (
            <AvatarFallback>{userInitial.toUpperCase()}</AvatarFallback>
          )}
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
        align="end"
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="h-8 w-8 rounded-lg">
              {userInfo?.user_name ? (
                <AvatarImage src={avatarUrl} alt={userName || ''} />
              ) : (
                <AvatarFallback>{userInitial.toUpperCase()}</AvatarFallback>
              )}
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">{userNickname}</span>
              <span className="truncate text-xs">{userInfo?.email}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <WithPermission permissionCode={P.SYSTEM.ADMIN}>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => router.push('/admin')}>
              <ShieldUser />
              Admin Portal
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </WithPermission>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <BadgeCheck />
            Account
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CreditCard />
            Billing
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Bell />
            Notifications
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()}>
          <LogOut />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
