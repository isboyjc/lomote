import { createSupabaseServerClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import {
  withApiHandler,
  createSuccessResponse,
  createErrorResponse,
  USER_ERROR
} from '@/lib/server'

// 定义处理函数
async function handler(req: NextRequest): Promise<NextResponse> {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase.rpc('sync_user')

  if (error) {
    return createErrorResponse(USER_ERROR.SYNC_FAILED, '', error, 500)
  }

  return createSuccessResponse(
    data,
    'User information synchronized successfully'
  )
}

// 导出使用中间件包装后的处理函数
export const POST = withApiHandler(handler)
