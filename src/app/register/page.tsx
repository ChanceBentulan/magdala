import { DM_Serif_Display } from "next/font/google";
import { RegisterForm } from "./RegisterForm";
import { CursorGlow } from "@/components/CursorGlow";

const dmSerifDisplay = DM_Serif_Display({
  weight: "400",
  subsets: ["latin"],
});

export default function RegisterPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-[#0F172A]">
      <CursorGlow />
      {/* Form panel */}
      <section className="flex w-full flex-col justify-center overflow-y-auto px-4 py-12 lg:w-3/5 lg:py-16 lg:px-14">
        <div className="mx-auto w-full max-w-[440px]">
          <div className="mb-6 flex flex-col gap-1">
            <h1 className={`${dmSerifDisplay.className} text-balance text-[35px] text-slate-100`}>
              Create account
            </h1>
            <p className="text-pretty text-[14px] text-slate-400">
              Sign up to get started.
            </p>
          </div>
          <RegisterForm />
        </div>
      </section>
    </main>
  );
}
