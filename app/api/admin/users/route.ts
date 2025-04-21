import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import {
  withApiHandler,
  ApiHandler,
  createSuccessResponse,
  createErrorResponse,
  createPaginatedResponse,
  DATA_ERROR,
  USER_ERROR
} from '@/lib/server'
import { Prisma } from '@prisma/client'

/**
 * 获取用户列表或单个用户详情
 */
const getUsersHandler: ApiHandler = async (request: NextRequest) => {
  const { searchParams } = new URL(request.url)

  // 检查是否请求单个用户
  const id = searchParams.get('id')
  if (id) {
    try {
      // 获取用户基本信息
      const user = await prisma.user.findUnique({
        where: { id },
        include: {
          user_roles: {
            select: {
              role: {
                select: {
                  id: true,
                  name: true,
                  description: true
                }
              }
            }
          }
        }
      })

      if (!user) {
        return createErrorResponse(
          USER_ERROR.NOT_FOUND,
          'User not found',
          null,
          404
        )
      }

      // 转换用户数据为期望的格式
      const userData = {
        ...user,
        roles: user.user_roles.map(ur => ur.role),
        user_roles: undefined // 移除原始关联数据
      }

      // 返回用户详情及角色
      return createSuccessResponse(
        userData,
        'User details retrieved successfully'
      )
    } catch (error) {
      return createErrorResponse(
        DATA_ERROR.QUERY_FAILED,
        'Failed to retrieve user details',
        error,
        500
      )
    }
  }

  // 获取用户列表
  const page = searchParams.get('page')
    ? parseInt(searchParams.get('page') as string)
    : 1
  const pageSize = searchParams.get('pageSize')
    ? parseInt(searchParams.get('pageSize') as string)
    : 10
  const searchTerm = searchParams.get('searchTerm') || ''
  const status = searchParams.get('status') || ''

  // 计算分页
  const skip = (page - 1) * pageSize
  const take = pageSize

  // 构建查询条件
  const where: Prisma.UserWhereInput = {
    is_deleted: false // 排除逻辑删除的用户
  }

  // 应用搜索过滤
  if (searchTerm) {
    where.OR = [
      { full_name: { contains: searchTerm, mode: 'insensitive' } },
      { user_name: { contains: searchTerm, mode: 'insensitive' } },
      { email: { contains: searchTerm, mode: 'insensitive' } }
    ]
  }

  // 应用状态过滤
  if (status && status !== 'all') {
    where.status = status as any
  }

  try {
    // 获取总记录数
    const count = await prisma.user.count({ where })

    // 获取用户列表
    const users = await prisma.user.findMany({
      where,
      skip,
      take,
      orderBy: { created_at: 'desc' },
      include: {
        user_roles: {
          select: {
            role: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    })

    // 转换响应数据，添加角色信息
    const usersWithRoles = users.map(user => ({
      ...user,
      roles: user.user_roles.map(ur => ur.role),
      user_roles: undefined // 移除原始关联数据
    }))

    // 返回分页数据
    return createPaginatedResponse(
      usersWithRoles,
      count,
      page,
      pageSize,
      'Users list retrieved successfully'
    )
  } catch (error) {
    return createErrorResponse(
      DATA_ERROR.QUERY_FAILED,
      'Failed to retrieve users list',
      error,
      500
    )
  }
}

/**
 * 更新用户信息
 */
const updateUserHandler: ApiHandler = async (request: NextRequest) => {
  // 获取请求体
  let body
  try {
    body = await request.json()
  } catch (error) {
    return createErrorResponse(
      DATA_ERROR.VALIDATION_FAILED,
      'Invalid request body',
      error,
      400
    )
  }

  const { id, roleIds, ...userData } = body

  if (!id) {
    return createErrorResponse(
      DATA_ERROR.VALIDATION_FAILED,
      'Missing user ID',
      null,
      400
    )
  }

  // 清理数据：处理空字符串的日期字段
  const cleanedUserData = { ...userData }

  // 处理日期字段
  if (cleanedUserData.birthday === '') {
    cleanedUserData.birthday = null
  }

  // 处理其他可能为空的字符串字段
  const stringFields = ['full_name', 'user_name', 'bio', 'gender']
  stringFields.forEach(field => {
    if (cleanedUserData[field] === '') {
      cleanedUserData[field] = null
    }
  })

  try {
    // 使用事务确保数据一致性
    const result = await prisma.$transaction(async tx => {
      // 更新用户基本信息
      const updatedUser = await tx.user.update({
        where: { id },
        data: cleanedUserData
      })

      // 如果提供了角色数据，更新用户-角色关联
      if (roleIds !== undefined) {
        // 删除现有角色关联
        await tx.userRole.deleteMany({
          where: { user_id: id }
        })

        // 如果有新的角色数据，创建新的关联
        if (roleIds && Array.isArray(roleIds) && roleIds.length > 0) {
          // 验证所有角色ID是否有效
          const sanitizedRoleIds = roleIds.filter(
            roleId => typeof roleId === 'number' && !isNaN(roleId) && roleId > 0
          )

          if (sanitizedRoleIds.length > 0) {
            // 创建用户角色关联记录
            await tx.userRole.createMany({
              data: sanitizedRoleIds.map((roleId: number) => ({
                user_id: id,
                role_id: roleId
              }))
            })
          }
        }
      }

      return updatedUser
    })

    // 获取更新后的用户信息（包括角色）
    const updatedUserWithRoles = await prisma.user.findUnique({
      where: { id },
      include: {
        user_roles: {
          select: {
            role: {
              select: {
                id: true,
                name: true,
                description: true
              }
            }
          }
        }
      }
    })

    // 转换用户数据为期望的格式
    const userData = {
      ...updatedUserWithRoles,
      roles: updatedUserWithRoles?.user_roles.map(ur => ur.role) || [],
      user_roles: undefined // 移除原始关联数据
    }

    return createSuccessResponse(
      userData,
      'User information updated successfully'
    )
  } catch (error) {
    // 检查是否为唯一性约束错误
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return createErrorResponse(
          DATA_ERROR.DUPLICATE_ENTRY,
          'Username or email already exists',
          error,
          409
        )
      }
    }
    return createErrorResponse(
      USER_ERROR.UPDATE_FAILED,
      'Failed to update user information',
      error,
      500
    )
  }
}

/**
 * 删除用户（逻辑删除或硬删除）
 */
const deleteUserHandler: ApiHandler = async (request: NextRequest) => {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  const hardDelete = searchParams.get('hardDelete') === 'true'

  if (!id) {
    return createErrorResponse(
      DATA_ERROR.VALIDATION_FAILED,
      'Missing user ID',
      null,
      400
    )
  }

  try {
    // 检查用户是否存在
    const user = await prisma.user.findUnique({
      where: { id }
    })

    if (!user) {
      return createErrorResponse(
        USER_ERROR.NOT_FOUND,
        'User not found',
        null,
        404
      )
    }

    if (hardDelete) {
      // 使用事务进行硬删除
      await prisma.$transaction(async tx => {
        // 先删除用户-角色关联
        await tx.userRole.deleteMany({
          where: { user_id: id }
        })

        // 然后删除用户记录
        await tx.user.delete({
          where: { id }
        })
      })

      return createSuccessResponse(
        { id, deletionType: 'hard' },
        'User permanently deleted'
      )
    } else {
      // 逻辑删除 - 仅标记用户为已删除
      await prisma.user.update({
        where: { id },
        data: {
          is_deleted: true,
          deletion_date: new Date(),
          status: 'inactive'
        }
      })

      return createSuccessResponse(
        { id, deletionType: 'soft' },
        'User deactivated'
      )
    }
  } catch (error) {
    return createErrorResponse(
      USER_ERROR.DELETE_FAILED,
      'Failed to delete user',
      error,
      500
    )
  }
}

// 导出处理函数，使用API中间件包装
export const GET = withApiHandler(getUsersHandler)
export const PUT = withApiHandler(updateUserHandler)
export const DELETE = withApiHandler(deleteUserHandler)
