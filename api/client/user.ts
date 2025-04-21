import { get, post, put, del } from '@/lib/fetch'
import { ApiResponse } from '@/lib/server/types'
import { Permission } from '@/types/permission'

/**
 * User data structure
 */
export interface User {
  id: string
  full_name: string | null
  user_name: string | null
  avatar_url: string | null
  email: string | null
  bio: string | null
  gender: string | null
  birthday: string | null
  status: string
  last_login_at?: string | null
  created_at?: string
  roles?: UserRole[]
}

/**
 * User role structure
 */
export interface UserRole {
  id: string
  name: string
  is_system: boolean
  description?: string
}

/**
 * Get user info
 * @param id User ID
 * @returns User info
 */
export async function getUserInfo(id: string): Promise<ApiResponse<User>> {
  return await get<User>('/client/user', { id })
}

/**
 * Sync user info
 * @returns User info
 */
export async function syncUserInfo(): Promise<ApiResponse<User>> {
  return await post<User>('/client/sync-user')
}

/**
 * Get user permissions
 * @param id User ID
 * @returns User permissions
 */
export async function getUserPermissions(
  id: string
): Promise<ApiResponse<Permission[]>> {
  return await get<Permission[]>('/client/permission', { id })
}
