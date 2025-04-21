import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '../../types/supabase'

/**
 * 创建客户端 Supabase 客户端
 * 用于在客户端组件中使用
 */
export function createSupabaseClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
} 