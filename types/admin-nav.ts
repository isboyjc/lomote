import { type LucideIcon } from 'lucide-react'

export interface AdminNavigationItem {
  title: string
  url: string
  icon?: LucideIcon
  isActive?: boolean
  permissionCode?: string
  items?: {
    title: string
    url: string
    permissionCode?: string
  }[]
}
