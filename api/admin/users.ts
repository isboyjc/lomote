import { get, post, put, del } from '@/lib/fetch'
import { User, GetUsersParams, UserResponse, UserUpdate } from '@/types/user'
import { ApiResponse } from '@/lib/server/types'

/**
 * Get users list
 * @param params Query parameters
 * @returns Users list and pagination information
 */
export async function getUsers(params?: GetUsersParams) {
  const {
    page = 1,
    pageSize = 10,
    searchTerm = '',
    status = '',
    role = ''
  } = params || {}

  return await get<UserResponse>('/admin/users', {
    page,
    pageSize,
    searchTerm,
    status,
    role
  })
}

/**
 * Get user details
 * @param id User ID
 * @returns User details
 */
export async function getUserDetails(id: string): Promise<User> {
  const response = await get<ApiResponse<User>>('/admin/users', { id })
  return response.data as unknown as User
}

/**
 * Get all roles
 * @returns Roles list
 */
export async function getAllRoles() {
  return await get<{ data: any[]; count: number }>('/admin/roles', {
    pageSize: 100
  })
}

/**
 * Update user
 * @param id User ID
 * @param userData User data
 * @returns Updated user information
 */
export async function updateUser(id: string, userData: UserUpdate) {
  return await put<User>('/admin/users', { id, ...userData })
}

/**
 * Delete user
 * @param id User ID
 * @param hardDelete Hard delete flag
 * @returns Delete result
 */
export async function deleteUser(id: string, hardDelete: boolean = false) {
  return await del<ApiResponse<{ id: string }>>('/admin/users', {
    id,
    hardDelete
  })
}
