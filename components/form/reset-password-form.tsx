"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useAuth } from "@/hooks/use-auth"
import { ResetPasswordFormValues, resetPasswordSchema } from "@/lib/validations/auth"

export function ResetPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { updatePassword, user } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })

  // Submit new password
  const onSubmit = async (data: ResetPasswordFormValues) => {
    setIsLoading(true)
    setError(null)

    try {
      // Update password
      const { error } = await updatePassword(data.password)

      if (error) {
        throw error
      }

      // Password reset successful
      setIsSuccess(true)
    } catch (err: any) {
      setError(err.message || "Password reset failed, please try again")
    } finally {
      setIsLoading(false)
    }
  }

  // 密码重置成功
  if (isSuccess) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl">Password Reset Complete</CardTitle>
            <CardDescription>
              Your password has been successfully reset. You can now sign in with your new password.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center p-6">
              <div className="text-5xl mb-4">✅</div>
              <p className="mb-2">Password reset successful!</p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              className="w-full" 
              onClick={() => router.push("/auth/signin")}
            >
              Go to sign in
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }
  
  // 检查是否有活跃的用户会话
  if (!user) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl">Invalid Session ⚠️</CardTitle>
            <CardDescription>
              Your session has expired. Please request a new password reset link.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center p-6">
              <div className="text-5xl mb-4">⚠️</div>
              <p className="mb-2">Unable to verify your reset request</p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              className="w-full" 
              onClick={() => router.push("/auth/forgot-password")}
            >
              Request new reset link
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }
  
  // 用户已认证，显示密码重置表单
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Reset Password</CardTitle>
          <CardDescription>
            Enter your new password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full grid gap-6">
              {error && (
                <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
                  {error}
                </div>
              )}
              <div className="grid gap-6">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="••••••••"
                          type="password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="••••••••"
                          type="password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Processing..." : "Reset Password"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
} 