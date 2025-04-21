import { PrismaClient, PermissionType } from '@/generated/prisma'

// 初始化 Prisma 客户端
const prisma = new PrismaClient()

async function main() {
  console.log('开始执行数据库种子脚本...')

  try {
    // 插入基本系统角色数据
    const roles = await Promise.all([
      prisma.role.upsert({
        where: { name: 'admin' },
        update: {
          description: '系统管理员，拥有最高权限',
          is_system: true,
          updated_at: new Date()
        },
        create: {
          name: 'admin',
          description: '系统管理员，拥有最高权限',
          is_system: true
        }
      }),
      prisma.role.upsert({
        where: { name: 'moderator' },
        update: {
          description: '内容审核员，负责内容管理和社区治理',
          is_system: true,
          updated_at: new Date()
        },
        create: {
          name: 'moderator',
          description: '内容审核员，负责内容管理和社区治理',
          is_system: true
        }
      }),
      prisma.role.upsert({
        where: { name: 'user' },
        update: {
          description: '普通用户，基础访问权限',
          is_system: true,
          updated_at: new Date()
        },
        create: {
          name: 'user',
          description: '普通用户，基础访问权限',
          is_system: true
        }
      })
    ])

    console.log(`已创建/更新 ${roles.length} 个系统角色`)

    // 插入基本系统权限数据
    const permissionsData = [
      {
        id: 1,
        name: 'Admin',
        code: 'ADMIN',
        parent_id: null,
        type: 'system' as PermissionType,
        description: '后台管理系统'
      },
      {
        id: 3,
        name: 'Dashboard',
        code: 'DASHBOARD',
        parent_id: 1,
        type: 'page' as PermissionType,
        description: '仪表盘页面'
      },
      {
        id: 4,
        name: 'Permission',
        code: 'PERMISSION',
        parent_id: 7,
        type: 'page' as PermissionType,
        description: '权限管理页面'
      },
      {
        id: 5,
        name: 'Role',
        code: 'ROLE',
        parent_id: 7,
        type: 'page' as PermissionType,
        description: '角色管理页面'
      },
      {
        id: 6,
        name: 'User',
        code: 'USER',
        parent_id: 7,
        type: 'page' as PermissionType,
        description: '用户管理页面'
      },
      {
        id: 7,
        name: 'Users',
        code: 'USERS',
        parent_id: 1,
        type: 'module' as PermissionType,
        description: '用户管理模块'
      },
      {
        id: 8,
        name: 'Models',
        code: 'MODELS',
        parent_id: 1,
        type: 'module' as PermissionType,
        description: '模型管理模块'
      },
      {
        id: 9,
        name: 'Competitions',
        code: 'COMPETITIONS',
        parent_id: 1,
        type: 'module' as PermissionType,
        description: '活动/竞赛管理模块'
      },
      {
        id: 10,
        name: 'Settings',
        code: 'SETTINGS',
        parent_id: 1,
        type: 'module' as PermissionType,
        description: '系统设置模块'
      },
      {
        id: 11,
        name: 'Permission:Add',
        code: 'PERMISSION:ADD',
        parent_id: 4,
        type: 'operation' as PermissionType,
        description: '权限管理:新增'
      },
      {
        id: 12,
        name: 'Permission:Delete',
        code: 'PERMISSION:DELETE',
        parent_id: 4,
        type: 'operation' as PermissionType,
        description: '权限管理:删除'
      },
      {
        id: 13,
        name: 'Permission:Edit',
        code: 'PERMISSION:EDIT',
        parent_id: 4,
        type: 'operation' as PermissionType,
        description: '权限管理:编辑'
      },
      {
        id: 14,
        name: 'Permission:View',
        code: 'PERMISSION:VIEW',
        parent_id: 4,
        type: 'operation' as PermissionType,
        description: '权限管理:查看'
      },
      {
        id: 15,
        name: 'Role:Add',
        code: 'ROLE:ADD',
        parent_id: 5,
        type: 'operation' as PermissionType,
        description: '角色管理:新增'
      },
      {
        id: 16,
        name: 'Role:Delete',
        code: 'ROLE:DELETE',
        parent_id: 5,
        type: 'operation' as PermissionType,
        description: '角色管理:删除'
      },
      {
        id: 17,
        name: 'Role:Edit',
        code: 'ROLE:EDIT',
        parent_id: 5,
        type: 'operation' as PermissionType,
        description: '角色管理:编辑'
      },
      {
        id: 18,
        name: 'Role:View',
        code: 'ROLE:VIEW',
        parent_id: 5,
        type: 'operation' as PermissionType,
        description: '角色管理:查看'
      },
      {
        id: 19,
        name: 'User:Edit',
        code: 'USER:EDIT',
        parent_id: 6,
        type: 'operation' as PermissionType,
        description: '用户管理:编辑'
      },
      {
        id: 20,
        name: 'User:View',
        code: 'USER:VIEW',
        parent_id: 6,
        type: 'operation' as PermissionType,
        description: '用户管理:查看'
      },
      {
        id: 21,
        name: 'User:Delete',
        code: 'USER:DELETE',
        parent_id: 6,
        type: 'operation' as PermissionType,
        description: '用户管理:删除'
      },
      {
        id: 22,
        name: 'User:Add',
        code: 'USER:ADD',
        parent_id: 6,
        type: 'operation' as PermissionType,
        description: '用户管理:新增'
      }
    ]

    // 由于存在父子关系，需要分批次插入权限数据
    // 第一批：无父级依赖的权限（ID=1的系统权限）
    await prisma.permission.upsert({
      where: { id: permissionsData[0].id },
      update: permissionsData[0],
      create: permissionsData[0]
    })

    // 第二批：依赖于ID=1的权限（模块级权限）
    const modulePermissions = permissionsData.filter(p => p.parent_id === 1)
    for (const permission of modulePermissions) {
      await prisma.permission.upsert({
        where: { id: permission.id },
        update: permission,
        create: permission
      })
    }

    // 第三批：依赖于模块级权限的页面权限
    const pagePermissions = permissionsData.filter(
      p =>
        p.parent_id === 7 ||
        p.parent_id === 8 ||
        p.parent_id === 9 ||
        p.parent_id === 10
    )
    for (const permission of pagePermissions) {
      await prisma.permission.upsert({
        where: { id: permission.id },
        update: permission,
        create: permission
      })
    }

    // 第四批：依赖于页面权限的操作权限
    const operationPermissions = permissionsData.filter(
      p => p.parent_id === 4 || p.parent_id === 5 || p.parent_id === 6
    )
    for (const permission of operationPermissions) {
      await prisma.permission.upsert({
        where: { id: permission.id },
        update: permission,
        create: permission
      })
    }

    console.log(`已创建/更新 ${permissionsData.length} 个系统权限`)

    // 为管理员角色分配所有权限
    const adminRole = await prisma.role.findUnique({
      where: { name: 'admin' }
    })

    if (adminRole) {
      // 获取所有权限ID
      const allPermissions = await prisma.permission.findMany({
        select: { id: true }
      })

      // 为管理员角色分配所有权限
      const rolePermissionsData = allPermissions.map(permission => ({
        role_id: adminRole.id,
        permission_id: permission.id
      }))

      // 使用事务批量插入角色权限关联
      await prisma.$transaction(async tx => {
        // 先删除此角色的所有现有权限
        await tx.rolePermission.deleteMany({
          where: { role_id: adminRole.id }
        })

        // 然后插入新的权限关联
        for (const data of rolePermissionsData) {
          await tx.rolePermission.create({
            data: data
          })
        }
      })

      console.log(`已为管理员角色分配 ${rolePermissionsData.length} 个权限`)
    }

    console.log('数据库种子脚本执行完成')
  } catch (error) {
    console.error('种子脚本执行出错:', error)
    throw error
  }
}

// 执行种子脚本
main()
  .catch(e => {
    console.error('种子脚本执行失败:', e)
    process.exit(1)
  })
  .finally(async () => {
    // 关闭 Prisma 客户端连接
    await prisma.$disconnect()
  })
