import { Trophy, Home, Settings, Package, Users } from 'lucide-react'
import type { AdminNavigationItem } from '@/types/admin-nav'

// 导航数据
export const navigationData: AdminNavigationItem[] = [
  {
    title: 'Dashboard',
    url: '/admin/dashboard',
    icon: Home,
    permissionCode: 'DASHBOARD'
  },
  {
    title: 'Account',
    url: '/admin/users',
    permissionCode: 'USERS',
    icon: Users,
    items: [
      {
        title: 'Roles',
        url: '/admin/roles',
        permissionCode: 'ROLE'
      },
      {
        title: 'Permissions',
        url: '/admin/permissions',
        permissionCode: 'PERMISSION'
      },
      {
        title: 'Users',
        url: '/admin/users',
        permissionCode: 'USER'
      }
    ]
  },
  {
    title: 'Models',
    url: '#',
    icon: Package,
    permissionCode: 'MODELS',
    items: [
      {
        title: 'Models Management',
        url: '#'
      }
    ]
  },
  {
    title: 'Competitions',
    url: '#',
    icon: Trophy,
    permissionCode: 'COMPETITIONS',
    items: [
      {
        title: 'Introduction',
        url: '#'
      },
      {
        title: 'Get Started',
        url: '#'
      },
      {
        title: 'Tutorials',
        url: '#'
      },
      {
        title: 'Changelog',
        url: '#'
      }
    ]
  },
  {
    title: 'Settings',
    url: '#',
    icon: Settings,
    permissionCode: 'SETTINGS',
    items: [
      {
        title: 'System settings',
        url: '#'
      },
      {
        title: 'Team',
        url: '#'
      }
    ]
  }
]
