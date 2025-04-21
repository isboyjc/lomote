import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createSupabaseServerClient } from './lib/supabase/server'

// 路由配置
const ROUTES = {
  // 公开路由（无需登录即可访问）
  public: [
    '/',
    '/auth/signin',
    '/auth/signup',
    '/auth/forgot-password',
    '/auth/check-email',
    '/api/auth/callback',
    '/api/client/user',
    '/api/client/sync-user'
  ],
  // 仅限未登录用户访问的路径
  authOnly: [
    '/auth/signin',
    '/auth/signup',
    '/auth/forgot-password',
    '/auth/check-email'
  ]
}

/**
 * 检查路径是否匹配指定的路由列表
 */
function matchesPath(pathname: string, paths: string[]): boolean {
  return paths.some(path => {
    // 对根路径'/'进行特殊处理
    if (path === '/' && pathname === '/') {
      return true
    }
    // 其他路径需要完全匹配或者以路径加'/'开头
    return (
      pathname === path || (path !== '/' && pathname.startsWith(`${path}/`))
    )
  })
}

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
    request: {
      headers: request.headers
    }
  })

  // 创建 Supabase 服务端客户端
  const supabase = await createSupabaseServerClient()

  // 获取用户会话
  const {
    data: { session }
  } = await supabase.auth.getSession()

  const pathname = request.nextUrl.pathname
  const isPublicPath = matchesPath(pathname, ROUTES.public)
  const isAuthOnlyPath = matchesPath(pathname, ROUTES.authOnly)

  // 未登录用户访问非公开路径 -> 重定向到登录页
  if (!session && !isPublicPath) {
    return NextResponse.redirect(new URL('/auth/signin', request.url))
  }

  // 已登录用户访问仅限未登录用户的页面 -> 重定向到首页
  if (session && isAuthOnlyPath) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)' // 排除静态资源
  ]
}
