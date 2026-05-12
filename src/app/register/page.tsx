import { db } from "@/db";
import { users } from "@/db/schema";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";

export default function RegisterPage() {
    
    async function handleRegister(formData: FormData) {
        "use server";
        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const hashedPassword = await bcrypt.hash(password, 10);

        await db.insert(users).values({
            name,
            email,
            password: hashedPassword,
        });

        redirect("/login");
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
            <div className="max-w-md w-full bg-white rounded-lg shadow p-8">
                <h1 className="text-2xl font-bold mb-6">Register</h1>

                <form action={handleRegister} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            required
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            required
                            className="w-full border rounded px-3 py-2"
                            minLength={6}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                    >
                        Register
                    </button>
                </form>

                <p className="mt-4 text-center text-sm text-gray-600">
                    Already have an account? {" "}
                    <a href="/login" className="text-blue-600 hover:underline">
                        Login
                    </a>
                </p>
            </div>
        </div>
    )
}