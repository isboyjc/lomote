'use client'

import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  useRef
} from 'react'
import { createSupabaseClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import type { AuthError, Session, User } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'
import {
  getUserInfo as getUserInfoApi,
  User as UserType,
  syncUserInfo
} from '@/api/client/user'

export type AuthUser = User | null
export type AuthSession = Session | null

export interface UseAuthResult {
  user: AuthUser
  session: AuthSession
  userInfo: UserType | null
  isLoading: boolean
  isAuthenticated: boolean

  // 认证方法
  signIn: (
    email: string,
    password: string
  ) => Promise<{ error: AuthError | Error | null }>
  signUp: (
    email: string,
    password: string,
    userData?: any
  ) => Promise<{ error: AuthError | Error | null }>
  signInWithMagicLink: (
    email: string
  ) => Promise<{ error: AuthError | Error | null }>
  signInWithOAuth: (
    provider: 'google' | 'github' | 'facebook' | 'twitter' | 'apple'
  ) => Promise<void>
  signOut: () => Promise<void>

  // 用户数据操作
  updateUserInfo: (
    data: Partial<Database['public']['Tables']['users']['Update']>
  ) => Promise<{ error: Error | null }>
  syncUserData: () => Promise<{ error: Error | null }>
  resetPassword: (email: string) => Promise<{ error: AuthError | Error | null }>
  updatePassword: (
    password: string
  ) => Promise<{ error: AuthError | Error | null }>
}

const redirectUrl = `${process.env.NEXT_PUBLIC_DOMAIN}/api/auth/callback?next=/`
const redirectResetPasswordUrl = `${process.env.NEXT_PUBLIC_DOMAIN}/api/auth/callback?next=/auth/reset-password`

// 创建认证上下文
const AuthContext = createContext<UseAuthResult | undefined>(undefined)

/**
 * 主认证钩子 - 提供认证功能实现
 */
function useAuthImplementation(): UseAuthResult {
  const supabase = createSupabaseClient()
  const router = useRouter()

  const [user, setUser] = useState<AuthUser>(null)
  const [session, setSession] = useState<AuthSession>(null)
  const [userInfo, setUserInfo] = useState<UserType | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  // 使用 ref 跟踪是否已经同步过用户数据，避免重复同步
  const hasUserSynced = useRef(false)

  // 使用 ref 跟踪是否正在同步中
  const isSyncingUser = useRef(false)

  // 获取用户资料 - 先定义 getUserInfo
  const getUserInfo = async (currentUser = user) => {
    try {
      if (!currentUser) {
        setUserInfo(null)
        return
      }

      const res = await getUserInfoApi(currentUser.id)
      console.log('getUserInfo', res)

      if (!res.success) {
        throw new Error(res.message || 'Failed to get user info')
      }

      if (res.data) {
        setUserInfo(res.data)
      }
    } catch (error) {
      console.error('Get user info failed:', error)
      setUserInfo(null)
    }
  }

  // 同步用户数据
  const syncUserData = async (currentUser = user) => {
    try {
      if (!currentUser) return { error: new Error('Not logged in') }

      // 防止重复同步
      if (isSyncingUser.current) {
        return { error: null }
      }

      isSyncingUser.current = true

      const res = await syncUserInfo()

      if (!res.success) {
        throw new Error(res.message || 'Failed to sync user data')
      }

      // 获取最新的用户资料
      await getUserInfo(currentUser)

      // 标记已同步
      hasUserSynced.current = true

      return { error: null }
    } catch (error) {
      console.error('Failed to sync user data:', error)
      return { error: error as Error }
    } finally {
      isSyncingUser.current = false
    }
  }

  // 初始化 - 检查现有会话并获取用户资料
  useEffect(() => {
    let isMounted = true

    async function initAuth() {
      if (!isMounted) return
      setIsLoading(true)

      try {
        // 获取当前会话
        const {
          data: { session }
        } = await supabase.auth.getSession()

        if (!isMounted) return

        setSession(session)
        setUser(session?.user || null)

        console.log('auth.user', session?.user)
        if (session?.user) {
          // await getUserInfo(session.user);

          // 如果首次加载且没有同步过，则进行同步
          if (!hasUserSynced.current) {
            console.log('syncUserData')
            await syncUserData(session.user)
          }
        }
      } catch (error) {
        console.error('Failed to initialize authentication:', error)
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    initAuth()

    // 监听认证状态变化
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (!isMounted) return

      setSession(newSession)
      setUser(newSession?.user || null)

      if (event === 'SIGNED_IN') {
        console.log('event', event, 'signed in')
        setIsLoading(true)
        try {
          // 仅在未同步过的情况下同步数据
          if (!hasUserSynced.current) {
            await syncUserData(newSession?.user || null)
          }
        } finally {
          if (isMounted) {
            setIsLoading(false)
          }
        }
      } else if (event === 'SIGNED_OUT') {
        setUserInfo(null)
        // 重置同步状态
        hasUserSynced.current = false
      }

      // 刷新路由，更新页面状态
      router.refresh()
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [supabase, router])

  // 登录
  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      toast.success('Login successful')
      router.push('/') // 登录成功后跳转到首页

      return { error: null }
    } catch (error) {
      console.error('Login failed:', error)
      toast.error('Login failed:' + (error as Error).message)
      return { error: error as AuthError }
    }
  }

  // 注册
  const signUp = async (email: string, password: string, userData?: any) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData || {},
          emailRedirectTo: `${window.location.origin}/api/auth/callback`
        }
      })

      if (error) throw error

      toast.success(
        'Registration is successful, please check the verification email'
      )
      router.push('/auth/check-email')

      return { error: null }
    } catch (error) {
      console.error('Registration failed:', error)
      toast.error('Registration failed:' + (error as Error).message)
      return { error: error as AuthError }
    }
  }

  // 魔法链接登录
  const signInWithMagicLink = async (email: string) => {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectUrl
        }
      })

      if (error) throw error

      toast.success('The login link has been sent, please check the email')
      router.push('/auth/check-email')

      return { error: null }
    } catch (error) {
      console.error('Send magic link failed:', error)
      toast.error('Send failed: ' + (error as Error).message)
      return { error: error as AuthError }
    }
  }

  // 社交登录
  const signInWithOAuth = async (
    provider: 'google' | 'github' | 'facebook' | 'twitter' | 'apple'
  ) => {
    try {
      await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: redirectUrl
        }
      })
    } catch (error) {
      console.error('OAuth login failed:', error)
      toast.error('OAuth login failed:' + (error as Error).message)
    }
  }

  // 退出登录
  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      toast.success('Logged out')
      router.refresh()
    } catch (error) {
      console.error('Logout failed:', error)
      toast.error('Logout failed:' + (error as Error).message)
    }
  }

  // 更新用户资料
  const updateUserInfo = async (
    data: Partial<Database['public']['Tables']['users']['Update']>
  ) => {
    try {
      if (!user) return { error: new Error('Not logged in') }

      // 更新自定义用户表
      const { error: updateError } = await supabase
        .from('users')
        .update(data)
        .eq('id', user.id)

      if (updateError) throw updateError

      // 如果有相关字段，同时更新 Supabase Auth 用户元数据
      if (data.full_name || data.avatar_url) {
        const metadata: Record<string, any> = {}

        if (data.full_name) metadata.full_name = data.full_name
        if (data.avatar_url) metadata.avatar_url = data.avatar_url

        const { error: authError } = await supabase.auth.updateUser({
          data: metadata
        })

        if (authError) throw authError
      }

      // 刷新用户资料
      await getUserInfo(user)

      toast.success('Personal information has been updated')
      return { error: null }
    } catch (error) {
      console.error('Update failed:', error)
      toast.error('Update failed:' + (error as Error).message)
      return { error: error as Error }
    }
  }

  // 重置密码
  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectResetPasswordUrl
      })

      if (error) throw error

      toast.success('The password reset link has been sent to your email')

      return { error: null }
    } catch (error) {
      console.error('Password reset failed:', error)
      toast.error('Reset failed:' + (error as Error).message)
      return { error: error as AuthError }
    }
  }

  // 更新密码
  const updatePassword = async (password: string) => {
    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error

      toast.success('Password updated successfully')
      return { error: null }
    } catch (error) {
      console.error('Password update failed:', error)
      toast.error('Password update failed:' + (error as Error).message)
      return { error: error as AuthError }
    }
  }

  return {
    user,
    session,
    userInfo,
    isLoading,
    isAuthenticated: !!user,
    signIn,
    signUp,
    signInWithMagicLink,
    signInWithOAuth,
    signOut,
    updateUserInfo,
    syncUserData,
    resetPassword,
    updatePassword
  }
}

/**
 * 认证Provider组件 - 为应用提供认证上下文
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuthImplementation()

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}

/**
 * 公开的认证钩子 - 用于在组件中访问认证状态和方法
 * 必须在AuthProvider内部使用
 */
export function useAuth(): UseAuthResult {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error('use Auth must be used inside the Auth Provider.')
  }

  return context
}
