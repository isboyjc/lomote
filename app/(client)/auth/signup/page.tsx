"use client"

import { Logo } from "@/components/logo";
import { SignUpForm } from "@/components/form/sign-up-form"

export default function SignUpPage() {
  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="w-full flex justify-center">
          <Logo />
        </div>

        <SignUpForm />
      </div>
    </div>
  )
} 