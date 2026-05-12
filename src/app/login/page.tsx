import { signIn } from "@/auth";

export default function LoginPage() {
    async function handleLogin(formData: FormData) {
        "use server";
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        await signIn("credentials", {
            email,
            password,
            redirectTo: "/"
        });
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
            <div className="max-w-md w-full bg-white rounded-lg shadow p-8">
                <h1 className="text-2xl font-bold mb-6">Login</h1>

                <form action={handleLogin} className="space-y-4">
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
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                    >
                        Login
                    </button>
                </form>

                <p className="mt-4 text-center text-sm text-gray-600">
                    Don't have an account? {" "}
                    <a href="/register" className="text-blue-600 hover:underline">
                        Register
                    </a>
                </p>
            </div>
        </div>
    )
}


