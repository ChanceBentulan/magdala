import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { db } from "./db";
import { users } from "./db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            credentials: {
                email: {label:"Email", type:"email"},
                password: {label: "Password", type:"password"},
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials.password) {
                    return null;
                } 
                const [user] = await db.select().from(users).where(eq(users.email, credentials.email as string))

                if (!user) {
                    return null;
                }
                const passwordMatch = await bcrypt.compare(
                    credentials.password as string,
                    user.password
                )

                if (!passwordMatch) {
                    return null;
                }

                return {
                    id: user.id.toString(),
                    name: user.name,
                    email: user.email,
                }
            }
        })
    ],
    pages: {
        signIn: "/login",
    },
    callbacks: {
        async session({ session, token }) {
            if (token.sub) {
                session.user.id = token.sub;
            }
            return session;
        }
    }
});