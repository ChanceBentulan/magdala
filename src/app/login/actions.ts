"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export type LoginState =
  | {
      error?: string;
      fieldErrors?: {
        email?: string;
        password?: string;
      };
    }
  | undefined;

export async function loginAction(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = (formData.get("email") as string)?.trim();
  const password = formData.get("password") as string;

  const fieldErrors: NonNullable<LoginState>["fieldErrors"] = {};

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    fieldErrors.email = "Enter a valid email address.";
  }
  if (!password) {
    fieldErrors.password = "Password is required.";
  }
  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors };
  }

  try {
    await signIn("credentials", { email, password, redirectTo: "/" });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid email or password." };
        default:
          return { error: "Something went wrong. Please try again." };
      }
    }
    throw error;
  }
}
