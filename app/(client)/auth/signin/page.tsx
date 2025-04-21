"use client"

import { useState } from "react"
import { Logo } from "@/components/logo";

import { SignInForm } from "@/components/form/sign-in-form"
import { MagicLinkForm } from "@/components/form/magic-link-form"

export default function LoginPage() {
  const [loginMethod, setLoginMethod] = useState<"magic-link" | "password">("magic-link")

  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="w-full flex justify-center">
          <Logo />
        </div>
        
        {loginMethod === "magic-link" ? (
          <MagicLinkForm onPasswordLogin={() => setLoginMethod("password")} />
        ) : (
          <SignInForm onMagicLinkLogin={() => setLoginMethod("magic-link")} />
        )}
      </div>
    </div>
  )
}
