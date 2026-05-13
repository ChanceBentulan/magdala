"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";

export type RegisterState =
  | {
      error?: string;
      fieldErrors?: {
        name?: string;
        email?: string;
        password?: string;
        confirmPassword?: string;
      };
    }
  | undefined;

export async function registerAction(
  _prevState: RegisterState,
  formData: FormData
): Promise<RegisterState> {
  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  const fieldErrors: NonNullable<RegisterState>["fieldErrors"] = {};

  if (!name) {
    fieldErrors.name = "Name is required.";
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    fieldErrors.email = "Enter a valid email address.";
  }
  if (!password || password.length < 8) {
    fieldErrors.password = "Password must be at least 8 characters.";
  }
  if (password && confirmPassword && password !== confirmPassword) {
    fieldErrors.confirmPassword = "Passwords do not match.";
  }
  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await db.insert(users).values({ name, email, password: hashedPassword });
  } catch (error) {
    if (error instanceof Error && "code" in error && (error as { code: string }).code === "23505") {
      return { fieldErrors: { email: "An account with this email already exists." } };
    }
    return { error: "Something went wrong. Please try again." };
  }

  redirect("/login");
}
