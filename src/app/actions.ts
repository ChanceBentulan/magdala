"use server"

import { auth } from "@/auth";
import { db } from "@/db";
import { photos } from "@/db/schema";
import { revalidatePath } from "next/cache";

export async function createPhoto(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error("Unauthorized");
    }
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const imageUrl = formData.get("imageUrl") as string;
    const year = parseInt(formData.get("year") as string);

    await db.insert(photos).values({
        title,
        description,
        imageUrl,
        userId: parseInt(session.user.id),
        year
    });

    revalidatePath("/");
}