import { NextRequest } from 'next/server'
import {
  withApiHandler,
  ApiHandler,
  createSuccessResponse,
  createErrorResponse,
  USER_ERROR
} from '@/lib/server'
import { prisma } from '@/lib/prisma'

/**
 * 获取用户详情接口
 * 通过ID查询特定用户
 */
const getUserHandler: ApiHandler = async (request: NextRequest) => {
  console.time('Total API time')

  const { searchParams } = new URL(request.url)

  // 检查是否指定了用户ID
  const userId = searchParams.get('id')

  // 如果未指定用户ID，返回错误
  if (!userId) {
    return createErrorResponse(
      USER_ERROR.NOT_FOUND,
      'User ID parameter not provided',
      null,
      400
    )
  }

  try {
    // 查询用户信息，包括关联的角色及权限
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
        is_deleted: false // 只查询未删除的用户
      },
      include: {
        user_roles: {
          include: {
            role: true
          }
        }
      }
    })

    // 如果用户不存在
    if (!user) {
      return createErrorResponse(
        USER_ERROR.NOT_FOUND,
        'User does not exist or has been deleted'
      )
    }

    // 提取角色和权限信息，简化响应结构
    const roles = user.user_roles
      ? user.user_roles.map(ur => {
          return {
            id: String(ur.role.id),
            name: ur.role.name,
            is_system: ur.role.is_system
          }
        })
      : []

    // 构建响应数据
    const userData = {
      id: String(user.id),
      full_name: user.full_name,
      user_name: user.user_name,
      avatar_url: user.avatar_url,
      email: user.email,
      bio: user.bio,
      gender: user.gender,
      birthday: user.birthday,
      status: user.status,
      last_login_at: user.last_login_at,
      created_at: user.created_at,
      roles: roles
    }

    console.timeEnd('Total API time')
    return createSuccessResponse(
      userData,
      'User details retrieved successfully'
    )
  } catch (error) {
    console.error('Failed to retrieve user details:', error)
    return createErrorResponse(
      USER_ERROR.NOT_FOUND,
      'Failed to retrieve user information',
      error
    )
  }
}

export const GET = withApiHandler(getUserHandler)
