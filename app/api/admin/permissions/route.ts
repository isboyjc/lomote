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
import { Prisma } from '@/generated/prisma'

/**
 * 获取权限列表或单个权限
 */
const getPermissionsHandler: ApiHandler = async (request: NextRequest) => {
  const { searchParams } = new URL(request.url)

  // 检查是否请求单个权限
  const id = searchParams.get('id')
  if (id) {
    const permission = await prisma.permission.findUnique({
      where: { id: parseInt(id) }
    })

    if (!permission) {
      return createErrorResponse(
        DATA_ERROR.NOT_FOUND,
        'Permission not found',
        null,
        404
      )
    }

    return createSuccessResponse(permission)
  }

  // 获取权限列表
  const page = searchParams.get('page')
    ? parseInt(searchParams.get('page') as string)
    : 1
  const pageSize = searchParams.get('pageSize')
    ? parseInt(searchParams.get('pageSize') as string)
    : 10
  const searchTerm = searchParams.get('searchTerm') || ''
  const type = searchParams.get('type') || ''
  const tree = searchParams.get('tree') === 'true' // 判断是否请求树形结构

  // 计算分页
  const skip = (page - 1) * pageSize
  const take = pageSize

  // 构建查询条件
  const where: Prisma.PermissionWhereInput = {}

  // 应用搜索过滤
  if (searchTerm) {
    where.OR = [
      { name: { contains: searchTerm, mode: 'insensitive' } },
      { code: { contains: searchTerm, mode: 'insensitive' } },
      { description: { contains: searchTerm, mode: 'insensitive' } }
    ]
  }

  // 应用类型过滤
  if (type && type !== 'all') {
    where.type = type as any // 使用类型断言解决类型问题
  }

  try {
    // 获取总记录数
    const count = await prisma.permission.count({ where })

    // 获取数据
    const data = await prisma.permission.findMany({
      where,
      skip,
      take,
      orderBy: { id: 'asc' }
    })

    // 如果请求树形结构，将扁平数组转换为树状结构
    if (tree && data) {
      const treeData = buildTree(data)
      return createPaginatedResponse(
        treeData,
        count,
        page,
        pageSize,
        'Permission tree retrieved successfully'
      )
    }

    return createPaginatedResponse(
      data,
      count,
      page,
      pageSize,
      'Permissions list retrieved successfully'
    )
  } catch (error) {
    console.log(error)
    return createErrorResponse(
      DATA_ERROR.QUERY_FAILED,
      'Failed to query permissions',
      error,
      500
    )
  }
}

/**
 * 创建新权限
 */
const createPermissionHandler: ApiHandler = async (request: NextRequest) => {
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

  try {
    // 创建权限
    const data = await prisma.permission.create({
      data: body
    })

    return createSuccessResponse(data, 'Permission created successfully', 201)
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // 唯一性约束错误
      if (error.code === 'P2002') {
        console.log(error)
        return createErrorResponse(
          DATA_ERROR.DUPLICATE_ENTRY,
          'Permission code already exists',
          error,
          409
        )
      }
    }
    return createErrorResponse(
      DATA_ERROR.CREATE_FAILED,
      'Failed to create permission',
      error,
      500
    )
  }
}

/**
 * 更新权限
 */
const updatePermissionHandler: ApiHandler = async (request: NextRequest) => {
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

  const { id, ...permissionData } = body

  if (!id) {
    return createErrorResponse(
      DATA_ERROR.VALIDATION_FAILED,
      'Missing permission ID',
      null,
      400
    )
  }

  try {
    // 更新权限
    const data = await prisma.permission.update({
      where: { id: parseInt(id) },
      data: permissionData
    })

    return createSuccessResponse(data, 'Permission updated successfully')
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // 唯一性约束错误
      if (error.code === 'P2002') {
        return createErrorResponse(
          DATA_ERROR.DUPLICATE_ENTRY,
          'Permission code already exists',
          error,
          409
        )
      }
      // 记录不存在
      if (error.code === 'P2025') {
        return createErrorResponse(
          DATA_ERROR.NOT_FOUND,
          'Permission not found',
          error,
          404
        )
      }
    }
    return createErrorResponse(
      DATA_ERROR.UPDATE_FAILED,
      'Failed to update permission',
      error,
      500
    )
  }
}

/**
 * 删除权限
 */
const deletePermissionHandler: ApiHandler = async (request: NextRequest) => {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id) {
    return createErrorResponse(
      DATA_ERROR.VALIDATION_FAILED,
      'Missing permission ID',
      null,
      400
    )
  }

  const parsedId = parseInt(id)

  try {
    // 先检查是否有子权限
    const childrenCount = await prisma.permission.count({
      where: { parent_id: parsedId }
    })

    if (childrenCount > 0) {
      return createErrorResponse(
        DATA_ERROR.DELETE_FAILED,
        'Cannot delete permission: Child permissions exist. Please delete all child permissions first',
        { childrenCount },
        409
      )
    }

    // 检查是否与角色关联
    const rolePermissionsCount = await prisma.rolePermission.count({
      where: { permission_id: parsedId }
    })

    if (rolePermissionsCount > 0) {
      return createErrorResponse(
        DATA_ERROR.DELETE_FAILED,
        'Cannot delete permission: This permission is being used by roles. Please remove the associations first',
        { rolesCount: rolePermissionsCount },
        409
      )
    }

    // 删除权限
    await prisma.permission.delete({
      where: { id: parsedId }
    })

    return createSuccessResponse(
      { id: parsedId },
      'Permission deleted successfully'
    )
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // 记录不存在
      if (error.code === 'P2025') {
        return createErrorResponse(
          DATA_ERROR.NOT_FOUND,
          'Permission not found',
          error,
          404
        )
      }
    }
    return createErrorResponse(
      DATA_ERROR.DELETE_FAILED,
      'Failed to delete permission',
      error,
      500
    )
  }
}

// 导出处理函数，使用API中间件包装
export const GET = withApiHandler(getPermissionsHandler)
export const POST = withApiHandler(createPermissionHandler)
export const PUT = withApiHandler(updatePermissionHandler)
export const DELETE = withApiHandler(deletePermissionHandler)
