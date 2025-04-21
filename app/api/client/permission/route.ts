import { NextRequest } from 'next/server'
import {
  withApiHandler,
  ApiHandler,
  createSuccessResponse,
  createErrorResponse,
  USER_ERROR
} from '@/lib/server'
import { prisma } from '@/lib/prisma'
import { Permission } from '@/types/permission'

const getUserPermissionsHandler: ApiHandler = async (request: NextRequest) => {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('id')

  if (!userId) {
    return createErrorResponse(
      USER_ERROR.NOT_FOUND,
      'User ID is not provided',
      null,
      400
    )
  }

  try {
    // 获取用户角色及关联的权限
    const userRoles = await prisma.userRole.findMany({
      where: { user_id: userId },
      include: {
        role: {
          include: {
            role_permissions: {
              include: {
                permission: true
              }
            }
          }
        }
      }
    })

    // 提取所有权限
    const permissions: Permission[] = []
    const permissionMap = new Map()

    userRoles.forEach(userRole => {
      userRole.role.role_permissions.forEach(rolePermission => {
        const permission = rolePermission.permission
        // 避免权限重复
        if (!permissionMap.has(permission.id)) {
          permissionMap.set(permission.id, permission)
          permissions.push({
            id: Number(permission.id),
            name: permission.name ?? '',
            code: permission.code ?? '',
            type: permission.type as
              | 'system'
              | 'page'
              | 'module'
              | 'operation'
              | 'data',
            parent_id: permission.parent_id
              ? Number(permission.parent_id)
              : null,
            description: permission.description ?? undefined
          })
        }
      })
    })

    return createSuccessResponse(
      permissions,
      'User permission retrieval successful'
    )
  } catch (error) {
    console.error('User permission retrieval failed:', error)
    return createErrorResponse(
      USER_ERROR.PERMISSION_RETRIEVAL_FAILED,
      'User permission retrieval failed',
      error,
      500
    )
  }
}

export const GET = withApiHandler(getUserPermissionsHandler)
