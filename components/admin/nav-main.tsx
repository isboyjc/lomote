'use client'

import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem
} from '@/components/ui/sidebar'
import { AdminNavigationItem } from '@/types/admin-nav'
import { usePermission } from '@/hooks/use-permission'

export function NavMain({ items }: { items: AdminNavigationItem[] }) {
  const pathname = usePathname()
  const { hasPermission } = usePermission()

  // 过滤掉用户没有权限的菜单项
  const authorizedItems = items
    .filter(item => {
      // 如果没有设置权限码，则默认可见
      if (!item.permissionCode) return true
      // 检查权限
      return hasPermission(item.permissionCode)
    })
    .map(item => {
      // 过滤子菜单
      if (item.items) {
        return {
          ...item,
          items: item.items.filter(
            subItem =>
              !subItem.permissionCode || hasPermission(subItem.permissionCode)
          )
        }
      }
      return item
    })

  // 检查当前路径是否匹配或是子路径
  const isActiveRoute = (url: string) => {
    if (url === '#') return false
    return pathname === url || (url !== '/' && pathname.startsWith(url))
  }

  return (
    <SidebarGroup>
      {/* <SidebarGroupLabel>Platform</SidebarGroupLabel> */}
      <SidebarMenu>
        {authorizedItems.map(item => {
          // 检查当前导航项是否应该高亮
          const isActive = isActiveRoute(item.url)

          // 检查子项是否有任何一个匹配当前路径
          const hasActiveChild = item.items?.some(subItem =>
            isActiveRoute(subItem.url)
          )

          // 如果当前项活跃或有活跃的子项，则该项应该高亮
          const shouldHighlight = isActive || hasActiveChild

          if (!item.items) {
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  isActive={shouldHighlight}
                >
                  <Link href={item.url}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          }

          return (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={item.isActive || shouldHighlight}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip={item.title}
                    isActive={shouldHighlight}
                  >
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map(subItem => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton
                          asChild
                          isActive={isActiveRoute(subItem.url)}
                        >
                          <Link href={subItem.url}>
                            <span>{subItem.title}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
