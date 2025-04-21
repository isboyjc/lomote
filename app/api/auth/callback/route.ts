import { createSupabaseServerClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { withApiHandler } from '@/lib/server'

// 定义处理函数
async function handler(req: NextRequest): Promise<NextResponse> {
  const requestUrl = new URL(req.url)
  const code = requestUrl.searchParams.get('code')
  const redirectTo = requestUrl.searchParams.get('next') || '/'
  console.log('code', code)
  console.log('next', redirectTo)

  // 检查认证码是否存在
  if (!code) {
    // 对于OAuth回调，我们需要重定向而不是返回错误响应
    const errorMessage = encodeURIComponent(
      'The authentication code does not exist'
    )
    return NextResponse.redirect(
      new URL(`/auth/signin?error=${errorMessage}`, req.url)
    )
  }

  const supabase = await createSupabaseServerClient()

  // 处理OAuth/魔法链接验证
  const { error } = await supabase.auth.exchangeCodeForSession(code)

  // 如果认证过程有错误
  if (error) {
    const errorMessage = encodeURIComponent(
      error.message || 'Authentication failed'
    )
    return NextResponse.redirect(
      new URL(`/auth/signin?error=${errorMessage}`, req.url)
    )
  }

  // 认证成功，重定向到指定页面或首页
  return NextResponse.redirect(new URL(redirectTo, req.url))
}

export const GET = withApiHandler(handler)
