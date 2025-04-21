import { BaseQueryParams } from '@/components/custom-table'
import { Role } from './role'
import { ApiResponse } from '@/lib/server/types'

// 用户完整类型
export type User = {
  id: string
  full_name: string | null
  user_name: string | null
  avatar_url: string | null
  email: string | null
  bio: string | null
  gender: string | null
  birthday: string | null
  status: 'active' | 'pending' | 'restricted' | 'banned' | 'inactive'
  is_deleted: boolean
  deletion_date: string | null
  last_login_at: string | null
  created_at: string
  updated_at: string
  roles?: Role[]
}

// 用户查询参数
export interface GetUsersParams extends BaseQueryParams {
  searchTerm?: string
  status?: string
  role?: string
}

// 用户响应类型
export type UserResponse = ApiResponse<{
  data: User[]
  total: number
  page?: number
  pageSize?: number
}>

// 用户更新类型
export type UserUpdate = Partial<
  Omit<User, 'id' | 'created_at' | 'updated_at' | 'role_names'>
> & {
  roleIds?: number[]
}
