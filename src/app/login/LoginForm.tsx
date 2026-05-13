"use client";

import { useActionState, useRef, useEffect, useState } from "react";
import Link from "next/link";
import { loginAction } from "./actions";
import { cn } from "@/lib/utils";
import { AnimatedError } from "@/components/AnimatedError";
import { PasswordInput } from "@/components/PasswordInput";

export function LoginForm() {
  const [serverState, formAction, pending] = useActionState(
    loginAction,
    undefined
  );

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const errorBannerRef = useRef<HTMLDivElement>(null);

  const [suppressErrors, setSuppressErrors] = useState({ email: false, password: false });

  useEffect(() => {
    if (!serverState) return;
    setSuppressErrors({ email: false, password: false });
    if (serverState.fieldErrors?.email) {
      emailRef.current?.focus();
    } else if (serverState.fieldErrors?.password) {
      passwordRef.current?.focus();
    } else if (serverState.error) {
      errorBannerRef.current?.focus();
    }
  }, [serverState]);

  const emailError = !suppressErrors.email ? serverState?.fieldErrors?.email : undefined;
  const passwordError = !suppressErrors.password ? serverState?.fieldErrors?.password : undefined;

  return (
    <form action={formAction} noValidate className="flex flex-col gap-6">
      {/* Form-level error */}
      {serverState?.error && (
        <div
          ref={errorBannerRef}
          role="alert"
          tabIndex={-1}
          className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-[13px] text-red-400 focus:outline-none motion-safe:animate-error-in"
        >
          {serverState.error}
        </div>
      )}

      {/* Email */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="email"
          className="text-[15px] font-medium text-slate-100"
        >
          Email
        </label>
        <input
          ref={emailRef}
          id="email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          disabled={pending}
          aria-invalid={emailError ? "true" : "false"}
          aria-describedby={emailError ? "email-error" : undefined}
          onChange={() => setSuppressErrors((prev) => ({ ...prev, email: true }))}
          placeholder="Email"
          className={cn(
            "h-14 w-full rounded-xl border bg-transparent px-5 text-[15px] text-slate-100 placeholder:text-slate-400",
            "transition-all duration-150",
            "focus:outline-none focus:ring-1 focus:border-blue-500 focus:ring-blue-500",
            "disabled:cursor-not-allowed disabled:opacity-50",
            emailError ? "border-red-500" : "border-slate-700"
          )}
        />
        <AnimatedError id="email-error" message={emailError} />
      </div>

      {/* Password */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="password"
          className="text-[15px] font-medium text-slate-100"
        >
          Password
        </label>
        <PasswordInput
          ref={passwordRef}
          id="password"
          name="password"
          autoComplete="current-password"
          required
          disabled={pending}
          aria-invalid={passwordError ? "true" : "false"}
          aria-describedby={passwordError ? "password-error" : undefined}
          onChange={() => setSuppressErrors((prev) => ({ ...prev, password: true }))}
          placeholder="Password"
          className={cn(
            "h-14 w-full rounded-xl border bg-transparent px-5 text-[15px] text-slate-100 placeholder:text-slate-400",
            "transition-all duration-150",
            "focus:outline-none focus:ring-1 focus:border-blue-500 focus:ring-blue-500",
            "disabled:cursor-not-allowed disabled:opacity-50",
            passwordError ? "border-red-500" : "border-slate-700"
          )}
        />
        <AnimatedError id="password-error" message={passwordError} />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={pending}
        aria-label={pending ? "Signing in, please wait…" : undefined}
        className={cn(
          "group relative flex h-14 w-full items-center justify-center overflow-hidden rounded-full",
          "bg-blue-700 text-[15px] font-medium text-white",
          "cursor-pointer transition-[background-color,opacity,transform] duration-150",
          "hover:bg-blue-600",
          "motion-safe:active:scale-[0.98]",
          "disabled:cursor-not-allowed disabled:opacity-60",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
        )}
      >
        {/* Hover progress bar */}
        <span
          aria-hidden="true"
          className="absolute inset-y-0 left-0 w-full origin-left scale-x-0 bg-white/20 motion-safe:transition-transform motion-safe:duration-500 motion-safe:ease-out group-hover:scale-x-100 motion-reduce:hidden"
        />

        <span
          className={cn(
            "relative transition-opacity duration-150",
            pending ? "opacity-0" : "opacity-100"
          )}
          aria-hidden={pending ? "true" : undefined}
        >
          Sign in
        </span>

        {pending && (
          <span
            className="absolute inset-0 flex items-center justify-center"
            aria-hidden="true"
          >
            <svg
              className="size-5 motion-safe:animate-spin"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          </span>
        )}
      </button>

      {/* Footer */}
      <p className="text-[14px] text-slate-100">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="underline transition-colors duration-150 hover:text-blue-400"
        >
          Sign up
        </Link>
        .
      </p>
    </form>
  );
}
