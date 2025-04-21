"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

// 导入导航数据
import { navigationData, type NavItem } from "./navigation-data"

export function AppHeader() {
  const pathname = usePathname()
  
  // 生成面包屑导航项
  const breadcrumbs = generateBreadcrumbs(pathname, navigationData)

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={index}>
                {index > 0 && <BreadcrumbSeparator className="hidden md:block" />}
                <BreadcrumbItem className="hidden md:block">
                  {index === breadcrumbs.length - 1 ? (
                    <BreadcrumbPage>{crumb.title}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href={crumb.url}>
                      {crumb.title}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  )
}

// 根据路径和导航数据生成面包屑导航项
function generateBreadcrumbs(pathname: string, navItems: NavItem[]) {
  // 检查路径是否匹配导航项或子导航项
  const isActiveRoute = (url: string) => {
    if (url === "#") return false
    return pathname === url || (url !== "/" && pathname.startsWith(url))
  }
  
  // 查找匹配当前路径的导航项
  const activeMainItem = navItems.find(item => 
    isActiveRoute(item.url) || item.items?.some(subItem => isActiveRoute(subItem.url))
  )
  
  // 如果找不到匹配项，则返回空数组
  if (!activeMainItem) return []
  
  // 创建面包屑数组，首先添加主导航项
  const breadcrumbs = [{ title: activeMainItem.title, url: activeMainItem.url }]
  
  // 如果主导航项有子项，查找匹配当前路径的子项
  if (activeMainItem.items) {
    const activeSubItem = activeMainItem.items.find(subItem => isActiveRoute(subItem.url))
    
    // 如果找到匹配的子项，将其添加到面包屑数组
    if (activeSubItem) {
      breadcrumbs.push({ title: activeSubItem.title, url: activeSubItem.url })
    }
  }
  
  return breadcrumbs
} 