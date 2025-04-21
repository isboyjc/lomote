import { NextRequest } from 'next/server'
import { buildTree } from '@/lib/tree'
import {
  withApiHandler,
  createSuccessResponse,
  createErrorResponse,
  createPaginatedResponse,
  ApiHandler,
  DATA_ERROR
} from '@/lib/server'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

// 缓存类型
type PermissionTreeCache = {
  data: any
  treeData: any
} | null

// 权限树缓存
let permissionTreeCache: PermissionTreeCache = null

/**
 * 获取权限树
 * @param permissionIds 角色关联的权限ID
 * @returns 权限树及权限ID
 */
async function getPermissionTree(permissionIds: number[]) {
  // 获取所有权限
  const data = await prisma.permission.findMany({
    select: {
      id: true,
      name: true,
      code: true,
      parent_id: true,
      type: true
    },
    orderBy: { id: 'asc' }
  })

  // 添加缓存处理，如果权限数据相同，可以复用之前的树结构
  if (permissionTreeCache && permissionTreeCache.data === data) {
    return {
      treeData: permissionTreeCache.treeData,
      permissionIds: permissionIds.map(id => id.toString())
    }
  }

  // 处理数据中的ID为字符串类型
  const processedData = data.map(item => ({
    ...item,
    id: item.id.toString(),
    parent_id: item.parent_id ? item.parent_id.toString() : null
  }))

  // 将权限列表转换为树状结构
  const treeData = buildTree(processedData)

  // 缓存结果
  permissionTreeCache = {
    data,
    treeData
  }

  return {
    treeData,
    permissionIds: permissionIds.map(id => id.toString())
  }
}

/**
 * 获取角色列表或单个角色
 */
const getRolesHandler: ApiHandler = async (request: NextRequest) => {
  const { searchParams } = new URL(request.url)

  // 检查是否请求单个角色
  const id = searchParams.get('id')
  if (id) {
    // 为单个角色详情查询单独记录性能
    const detailStartTime = performance.now()

    try {
      // 获取角色基本信息
      const role = await prisma.role.findUnique({
        where: { id: parseInt(id) },
        include: {
          // 包含关联用户数量
          _count: {
            select: { user_roles: true }
          }
        }
      })

      if (!role) {
        return createErrorResponse(
          DATA_ERROR.NOT_FOUND,
          'Role not found',
          null,
          404
        )
      }

      // 获取角色关联的权限
      const rolePermissions = await prisma.rolePermission.findMany({
        where: { role_id: parseInt(id) },
        select: { permission_id: true }
      })

      // 获取权限ID数组
      const permissionIds = rolePermissions.map(item =>
        Number(item.permission_id)
      )

      // 获取权限树及关联的权限ID
      const permissionTree = await getPermissionTree(permissionIds)

      // 记录详情查询性能
      const detailDuration = performance.now() - detailStartTime
      console.log(
        `Role detail API performance: ${detailDuration.toFixed(
          2
        )}ms for role ID ${id}`
      )

      // 返回角色详情和关联信息 - 将id转为字符串
      return createSuccessResponse(
        {
          ...role,
          id: role.id.toString(),
          user_count: role._count.user_roles,
          permission_count: permissionIds.length,
          _count: undefined, // 移除原始计数对象
          permissions: permissionTree.permissionIds,
          permissionsTree: permissionTree.treeData
        },
        'Role details retrieved successfully'
      )
    } catch (error) {
      console.error(error)
      return createErrorResponse(
        DATA_ERROR.QUERY_FAILED,
        'Failed to retrieve role details',
        error,
        500
      )
    }
  }

  // 获取角色列表
  const listStartTime = performance.now()

  const page = searchParams.get('page')
    ? parseInt(searchParams.get('page') as string)
    : 1
  const pageSize = searchParams.get('pageSize')
    ? parseInt(searchParams.get('pageSize') as string)
    : 10
  const searchTerm = searchParams.get('searchTerm') || ''

  // 计算分页
  const skip = (page - 1) * pageSize
  const take = pageSize

  // 构建查询条件
  const where: Prisma.RoleWhereInput = {}

  // 应用搜索过滤
  if (searchTerm) {
    where.OR = [
      { name: { contains: searchTerm, mode: 'insensitive' } },
      { description: { contains: searchTerm, mode: 'insensitive' } }
    ]
  }

  try {
    // 获取总记录数
    const count = await prisma.role.count({ where })

    // 获取角色列表及每个角色关联的用户数量
    const roles = await prisma.role.findMany({
      where,
      skip,
      take,
      orderBy: { id: 'asc' },
      include: {
        _count: {
          select: { user_roles: true }
        }
      }
    })

    // 获取每个角色的权限数量
    const roleIds = roles.map(role => role.id)
    const permissionCounts = await prisma.rolePermission.groupBy({
      by: ['role_id'],
      _count: {
        permission_id: true
      },
      where: {
        role_id: {
          in: roleIds
        }
      }
    })

    // 创建权限数量查找表
    const permissionCountMap = permissionCounts.reduce((acc, item) => {
      acc[Number(item.role_id)] = item._count.permission_id
      return acc
    }, {} as Record<number, number>)

    // 转换响应数据，添加用户数量字段和权限数量字段，并将ID转为字符串
    const rolesWithUserCount = roles.map(role => ({
      ...role,
      id: role.id.toString(),
      user_count: role._count.user_roles,
      permission_count: permissionCountMap[Number(role.id)] || 0,
      _count: undefined // 移除原始计数对象
    }))

    // 记录列表查询性能
    const listDuration = performance.now() - listStartTime
    console.log(
      `Roles list API performance: ${listDuration.toFixed(
        2
      )}ms for page ${page}, pageSize ${pageSize}`
    )

    // 返回分页数据
    return createPaginatedResponse(
      rolesWithUserCount,
      count,
      page,
      pageSize,
      'Roles list retrieved successfully'
    )
  } catch (error) {
    console.error(error)
    return createErrorResponse(
      DATA_ERROR.QUERY_FAILED,
      'Failed to retrieve roles list',
      error,
      500
    )
  }
}

/**
 * 创建新角色
 */
const createRoleHandler: ApiHandler = async (request: NextRequest) => {
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

  const { permissions, ...roleData } = body

  try {
    // 使用事务确保数据一致性
    const result = await prisma.$transaction(async tx => {
      // 创建角色
      const newRole = await tx.role.create({
        data: roleData
      })

      // 如果有权限数据，创建角色-权限关联
      if (permissions && permissions.length > 0) {
        await tx.rolePermission.createMany({
          data: permissions.map((permissionId: number) => ({
            role_id: newRole.id,
            permission_id: permissionId
          }))
        })
      }

      return newRole
    })

    // 将响应中的ID转为字符串
    return createSuccessResponse(
      {
        ...result,
        id: result.id.toString()
      },
      'Role created successfully',
      201
    )
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // 唯一性约束错误
      if (error.code === 'P2002') {
        return createErrorResponse(
          DATA_ERROR.DUPLICATE_ENTRY,
          'Role name already exists',
          error,
          409
        )
      }
    }
    return createErrorResponse(
      DATA_ERROR.CREATE_FAILED,
      'Failed to create role',
      error,
      500
    )
  }
}

/**
 * 更新角色
 */
const updateRoleHandler: ApiHandler = async (request: NextRequest) => {
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

  const { id, permissions, ...roleData } = body

  if (!id) {
    return createErrorResponse(
      DATA_ERROR.VALIDATION_FAILED,
      'Missing role ID',
      null,
      400
    )
  }

  try {
    // 使用事务确保数据一致性
    const result = await prisma.$transaction(async tx => {
      // 更新角色基本信息
      const updatedRole = await tx.role.update({
        where: { id: parseInt(id) },
        data: roleData
      })

      // 如果提供了权限数据，更新角色-权限关联
      if (permissions !== undefined) {
        // 先删除现有的权限关联
        await tx.rolePermission.deleteMany({
          where: { role_id: parseInt(id) }
        })

        // 如果有新的权限数据，创建新的关联
        if (permissions && permissions.length > 0) {
          await tx.rolePermission.createMany({
            data: permissions.map((permissionId: number) => ({
              role_id: parseInt(id),
              permission_id: permissionId
            }))
          })
        }
      }

      return updatedRole
    })

    // 将响应中的ID转为字符串
    return createSuccessResponse(
      {
        ...result,
        id: result.id.toString()
      },
      'Role updated successfully'
    )
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // 唯一性约束错误
      if (error.code === 'P2002') {
        return createErrorResponse(
          DATA_ERROR.DUPLICATE_ENTRY,
          'Role name already exists',
          error,
          409
        )
      }
      // 记录不存在
      if (error.code === 'P2025') {
        return createErrorResponse(
          DATA_ERROR.NOT_FOUND,
          'Role not found',
          error,
          404
        )
      }
    }
    return createErrorResponse(
      DATA_ERROR.UPDATE_FAILED,
      'Failed to update role',
      error,
      500
    )
  }
}

/**
 * 删除角色
 */
const deleteRoleHandler: ApiHandler = async (request: NextRequest) => {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id) {
    return createErrorResponse(
      DATA_ERROR.VALIDATION_FAILED,
      'Missing role ID',
      null,
      400
    )
  }

  const parsedId = parseInt(id)

  try {
    // 检查角色是否被用户使用
    const userCount = await prisma.userRole.count({
      where: { role_id: parsedId }
    })

    if (userCount > 0) {
      return createErrorResponse(
        DATA_ERROR.DELETE_FAILED,
        'Cannot delete role: This role is being used by users. Please remove the associations first',
        { userCount },
        409
      )
    }

    // 使用事务确保数据一致性
    await prisma.$transaction(async tx => {
      // 删除角色-权限关联
      await tx.rolePermission.deleteMany({
        where: { role_id: parsedId }
      })

      // 删除用户-角色关联（虽然前面已检查，但为了确保安全，还是执行删除）
      await tx.userRole.deleteMany({
        where: { role_id: parsedId }
      })

      // 删除角色
      await tx.role.delete({
        where: { id: parsedId }
      })
    })

    // 将响应中的ID转为字符串
    return createSuccessResponse(
      { id: id.toString() },
      'Role deleted successfully'
    )
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // 记录不存在
      if (error.code === 'P2025') {
        return createErrorResponse(
          DATA_ERROR.NOT_FOUND,
          'Role not found',
          error,
          404
        )
      }
    }
    return createErrorResponse(
      DATA_ERROR.DELETE_FAILED,
      'Failed to delete role',
      error,
      500
    )
  }
}

// 导出处理函数，使用API中间件包装
export const GET = withApiHandler(getRolesHandler)
export const POST = withApiHandler(createRoleHandler)
export const PUT = withApiHandler(updateRoleHandler)
export const DELETE = withApiHandler(deleteRoleHandler)
