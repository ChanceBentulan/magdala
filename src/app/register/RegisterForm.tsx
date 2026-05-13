"use client";

import { useActionState, useRef, useEffect, useState } from "react";
import Link from "next/link";
import { registerAction } from "./actions";
import { cn } from "@/lib/utils";
import { AnimatedError } from "@/components/AnimatedError";
import { PasswordInput } from "@/components/PasswordInput";

export function RegisterForm() {
  const [serverState, formAction, pending] = useActionState(
    registerAction,
    undefined
  );

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const errorBannerRef = useRef<HTMLDivElement>(null);

  const [suppressErrors, setSuppressErrors] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  useEffect(() => {
    if (!serverState) return;
    setSuppressErrors({ name: false, email: false, password: false, confirmPassword: false });
    if (serverState.fieldErrors?.name) {
      nameRef.current?.focus();
    } else if (serverState.fieldErrors?.email) {
      emailRef.current?.focus();
    } else if (serverState.fieldErrors?.password) {
      passwordRef.current?.focus();
    } else if (serverState.fieldErrors?.confirmPassword) {
      confirmPasswordRef.current?.focus();
    } else if (serverState.error) {
      errorBannerRef.current?.focus();
    }
  }, [serverState]);

  const nameError = !suppressErrors.name ? serverState?.fieldErrors?.name : undefined;
  const emailError = !suppressErrors.email ? serverState?.fieldErrors?.email : undefined;
  const passwordError = !suppressErrors.password ? serverState?.fieldErrors?.password : undefined;
  const confirmPasswordError = !suppressErrors.confirmPassword ? serverState?.fieldErrors?.confirmPassword : undefined;

  const inputClass = cn(
    "h-14 w-full rounded-xl border bg-transparent px-5 text-[15px] text-slate-100 placeholder:text-slate-400",
    "transition-all duration-150",
    "focus:outline-none focus:ring-1 focus:border-blue-500 focus:ring-blue-500",
    "disabled:cursor-not-allowed disabled:opacity-50"
  );

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

      {/* Name */}
      <div className="flex flex-col gap-2">
        <label htmlFor="name" className="text-[15px] font-medium text-slate-100">
          Full name
        </label>
        <input
          ref={nameRef}
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          required
          disabled={pending}
          aria-invalid={nameError ? "true" : "false"}
          aria-describedby={nameError ? "name-error" : undefined}
          onChange={() => setSuppressErrors((prev) => ({ ...prev, name: true }))}
          placeholder="Full name"
          className={cn(inputClass, nameError ? "border-red-500" : "border-slate-700")}
        />
        <AnimatedError id="name-error" message={nameError} />
      </div>

      {/* Email */}
      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-[15px] font-medium text-slate-100">
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
          className={cn(inputClass, emailError ? "border-red-500" : "border-slate-700")}
        />
        <AnimatedError id="email-error" message={emailError} />
      </div>

      {/* Password */}
      <div className="flex flex-col gap-2">
        <label htmlFor="password" className="text-[15px] font-medium text-slate-100">
          Password
        </label>
        <PasswordInput
          ref={passwordRef}
          id="password"
          name="password"
          autoComplete="new-password"
          required
          disabled={pending}
          aria-invalid={passwordError ? "true" : "false"}
          aria-describedby={passwordError ? "password-error" : undefined}
          onChange={() => setSuppressErrors((prev) => ({ ...prev, password: true }))}
          placeholder="Password"
          className={cn(inputClass, passwordError ? "border-red-500" : "border-slate-700")}
        />
        <AnimatedError id="password-error" message={passwordError} />
      </div>

      {/* Confirm password */}
      <div className="flex flex-col gap-2">
        <label htmlFor="confirmPassword" className="text-[15px] font-medium text-slate-100">
          Confirm password
        </label>
        <PasswordInput
          ref={confirmPasswordRef}
          id="confirmPassword"
          name="confirmPassword"
          autoComplete="new-password"
          required
          disabled={pending}
          aria-invalid={confirmPasswordError ? "true" : "false"}
          aria-describedby={confirmPasswordError ? "confirm-password-error" : undefined}
          onChange={() => setSuppressErrors((prev) => ({ ...prev, confirmPassword: true }))}
          placeholder="Confirm password"
          className={cn(inputClass, confirmPasswordError ? "border-red-500" : "border-slate-700")}
        />
        <AnimatedError id="confirm-password-error" message={confirmPasswordError} />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={pending}
        aria-label={pending ? "Creating account, please wait…" : undefined}
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
          Create account
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
        Already have an account?{" "}
        <Link
          href="/login"
          className="underline transition-colors duration-150 hover:text-blue-400"
        >
          Sign in
        </Link>
        .
      </p>
    </form>
  );
}
